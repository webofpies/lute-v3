"Book endpoints"

import os

from flask import Blueprint, jsonify, send_file, current_app

from lute.db import db
from lute.models.book import Text, Book as BookModel
from lute.models.repositories import BookRepository
from lute.read.service import Service as ReadService
from lute.read.render.service import Service as RenderService
from lute.book.stats import Service as StatsService


bp = Blueprint("api_books", __name__, url_prefix="/api/books")


@bp.route("/", methods=["GET"])
def all_books():
    "Hacky listing."
    results = []
    books = db.session.query(BookModel).all()

    for b in books:
        row = {
            "id": b.id,
            "title": b.title,
            "language": b.language.name,
            "wordCount": sum([text.word_count for text in b.texts]),
            "tags": [
                {"id": tag.id, "text": tag.text, "comment": tag.comment}
                for tag in b.book_tags
            ],
            "currentPage": _get_current_page(b),
            # "statusDistribution": get_status_distribution(b)
        }
        results.append(row)

    return jsonify(results)


@bp.route("/<int:bookid>", methods=["GET"])
def book_info(bookid):
    "book object to json"

    book = _find_book(bookid)
    if book is None:
        return jsonify("No such book")

    page_num = 1
    text = book.texts[0]
    if book.current_tx_id:
        text = db.session.get(Text, book.current_tx_id)
        page_num = text.order

    book_dict = {
        "id": book.id,
        "title": book.title,
        "source": book.source_uri,
        "pageCount": book.page_count,
        "currentPage": page_num,
        "languageId": book.language.id,
        "audio": (
            {
                "name": book.audio_filename,
                "position": (
                    float(book.audio_current_pos) if book.audio_current_pos else 0
                ),
                "bookmarks": (
                    [float(x) for x in book.audio_bookmarks.split(";")]
                    if book.audio_bookmarks
                    else []
                ),
            }
            if book.audio_filename
            else None
        ),
    }

    return jsonify(book_dict)


@bp.route("/<int:bookid>/pages/<int:pagenum>", methods=["GET"])
def page_info(bookid, pagenum):
    "send book info in json"
    book = _find_book(bookid)
    if book is None:
        return jsonify("No such book")

    service = ReadService(db.session)
    text = book.text_at_page(pagenum)
    text.load_sentences()  # determine if this is need at the load time
    lang = text.book.language
    rs = RenderService(service.session)
    paragraphs = rs.get_paragraphs(text.text, lang)

    paras = [
        [
            [
                {
                    "id": textitem.span_id,
                    "displayText": textitem.html_display_text,
                    "classes": getattr(textitem, "html_class_string", ""),
                    "langId": getattr(textitem, "lang_id", ""),
                    "paragraphId": textitem.paragraph_number,
                    "sentenceId": textitem.sentence_number,
                    "text": textitem.text,
                    "statusClass": textitem.status_class,
                    "order": textitem.index,
                    "wid": textitem.wo_id,
                    "isWord": textitem.is_word,
                }
                for textitem in sentence
            ]
            for sentence in paragraph
        ]
        for paragraph in paragraphs
    ]

    return jsonify({"text": text.text, "paragraphs": paras})


@bp.route("<int:bookid>/audio", methods=["GET"])
def stream(bookid):
    "Serve the audio, no caching."
    dirname = current_app.env_config.useraudiopath
    br = BookRepository(db.session)
    book = br.find(bookid)
    fname = os.path.join(dirname, book.audio_filename)
    return send_file(fname, as_attachment=True, max_age=0)


@bp.route("/<int:bookid>/stats", methods=["GET"])
def book_stats(bookid):
    "Calc stats for the book using the status distribution."
    book = _find_book(bookid)
    svc = StatsService(db.session)
    status_distribution = svc.calc_status_distribution(book)
    return jsonify(status_distribution)


def _get_current_page(book):
    page_num = 1
    text = book.texts[0]
    if book.current_tx_id:
        text = db.session.get(Text, book.current_tx_id)
        page_num = text.order

    return page_num


def _find_book(bookid):
    "Find book from db."
    br = BookRepository(db.session)
    return br.find(bookid)
