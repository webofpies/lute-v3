"""
API endpoints
"""

import os
from urllib.parse import urlparse, quote
from flask import (
    Blueprint,
    jsonify,
    redirect,
    send_file,
    send_from_directory,
    current_app,
)
from lute import __version__
from lute.db import db
from lute.models.book import Text, Book as BookModel
from lute.book.stats import Service as StatsService
from lute.read.service import Service
from lute.term.model import Repository
from lute.models.repositories import BookRepository, LanguageRepository
from lute.models.setting import UserSetting


bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/books", methods=["GET"])
def all_books():
    "Hacky listing."
    results = []
    books = db.session.query(BookModel).all()

    def get_current_page(book):
        page_num = 1
        text = book.texts[0]
        if book.current_tx_id:
            text = db.session.get(Text, book.current_tx_id)
            page_num = text.order

        return page_num

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
            "currentPage": get_current_page(b),
            # "statusDistribution": get_status_distribution(b)
        }
        results.append(row)

    return jsonify(results)


@bp.route("/book/<int:bookid>/stats", methods=["GET"])
def book_stats(bookid):
    "Calc stats for the book using the status distribution."
    book = _find_book(bookid)
    svc = StatsService(db.session)
    status_distribution = svc.calc_status_distribution(book)
    return jsonify(status_distribution)


def _find_book(bookid):
    "Find book from db."
    br = BookRepository(db.session)
    return br.find(bookid)


#
@bp.route("/book/<int:bookid>", methods=["GET"])
def book_info(bookid):
    "book object to json"

    book = _find_book(bookid)
    if book is None:
        return redirect("/", 302)

    page_num = 1
    text = book.texts[0]
    if book.current_tx_id:
        text = db.session.get(Text, book.current_tx_id)
        page_num = text.order

    lang = book.language
    lang_repo = LanguageRepository(db.session)
    term_dicts = lang_repo.all_dictionaries()[lang.id]["term"]
    sentence_dicts = lang_repo.all_dictionaries()[lang.id]["sentence"]
    # show_highlights = bool(int(UserSetting.get_value("show_highlights")))
    # term_dicts = lang.all_dictionaries()[lang.id]["term"]

    def get_dict_info(dictURL, dictID):
        is_external = dictURL[0] == "*"
        url = dictURL.replace("*", "")
        # label = url if len(url) <= 10 else f"{url[:10]}..."
        hostname = urlparse(url).hostname
        label = hostname.split("www.")[-1] if hostname.startswith("www.") else hostname

        if "www.bing.com" in url:
            bing_hash = url.replace("https://www.bing.com/images/search?", "")
            url = "http://localhost:5001/bing/search/{}/###/{}".format(
                lang.id, quote(bing_hash, safe="()*!.'")
            )

        return {
            "id": dictID,
            "url": url,
            "label": label,
            "isExternal": is_external,
            "hostname": hostname,
        }

    term_dicts = [get_dict_info(dict, index) for index, dict in enumerate(term_dicts)]
    sentence_dicts = [
        get_dict_info(dict, index) for index, dict in enumerate(sentence_dicts)
    ]

    book_dict = {
        "id": book.id,
        "title": book.title,
        "source": book.source_uri,
        "pageCount": book.page_count,
        "currentPage": page_num,
        "languageId": lang.id,
        "dictionaries": {"term": term_dicts, "sentence": sentence_dicts},
        "isRightToLeft": lang.right_to_left,
        "audio": {
            "name": book.audio_filename,
            "position": (
                float(book.audio_current_pos) if book.audio_current_pos else 0
            ),
            "bookmarks": (
                [float(x) for x in book.audio_bookmarks.split(";")]
                if book.audio_bookmarks
                else []
            ),
        },
    }

    return jsonify(book_dict)


#
@bp.route("/book/<int:bookid>/page/<int:pagenum>", methods=["GET"])
def page_info(bookid, pagenum):
    "send book info in json"
    book = _find_book(bookid)
    if book is None:
        return redirect("/", 302)

    # paragraphs = start_reading(book, pagenum, db.session)

    # paragraphs = get_page_paragraphs(bookid, pagenum)
    service = Service(db.session)
    paragraphs = service.start_reading(book, pagenum)
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
                    # "hasPopup": has_popup(textitem.wo_id) if textitem.wo_id else False,
                    # "hasPopup": True if textitem.wo_id else False,
                }
                for textitem in sentence
            ]
            for sentence in paragraph
        ]
        for paragraph in paragraphs
    ]

    return jsonify(paras)


@bp.route("/terms/<int:term_id>", methods=["GET", "POST"])
def term_info(term_id):
    """
    term info for term form
    """
    repo = Repository(db.session)
    term = repo.load(term_id)
    if term.status == 0:
        term.status = 1
    return {
        "text": term.text,
        "textLC": term.text_lc,
        "originalText": term.original_text,
        "status": term.status,
        "translation": term.translation,
        "romanization": term.romanization,
        "syncStatus": term.sync_status,
        "termTags": term.term_tags,
        "parents": term.parents,
        "currentImg": term.current_image,
    }


@bp.route("/terms/<int:langid>/<text>", methods=["GET", "POST"])
def multiterm_info(langid, text):
    """
    multiterm info for term form
    """
    usetext = text.replace("LUTESLASH", "/")
    repo = Repository(db.session)
    term = repo.find_or_new(langid, usetext)
    if term.status == 0:
        term.status = 1

    return {
        "text": term.text,
        "textLC": term.text_lc,
        "originalText": term.original_text,
        "status": term.status,
        "translation": term.translation,
        "romanization": term.romanization,
        "syncStatus": term.sync_status,
        "termTags": term.term_tags,
        "parents": term.parents,
        "currentImg": term.current_image,
    }


@bp.route("/popup/<int:termid>", methods=["GET"])
def popup_content(termid):
    """
    Show a term popup for the given DBTerm.
    """
    service = Service(db.session)
    d = service.get_popup_data(termid)
    if d is None:
        return jsonify(None)

    return jsonify(
        {
            "term": d["term"].text,
            "translation": d["term"].translation,
            "romanization": d["term"].romanization,
            "tags": d["term_tags"],
            "images": d["term_images"],
            "parentData": d["parentdata"],
            "parentTerms": d["parentterms"],
            "componentData": d["components"],
        }
    )


#
@bp.route("/sent/<int:langid>/<text>", methods=["GET"])
def get_sentences(langid, text):
    "Get sentences for terms."
    repo = Repository(db)
    # Use find_or_new(): if the user clicks on a parent tag
    # in the term form, and the parent does not exist yet, then
    # we're creating a new term.
    t = repo.find_or_new(langid, text)
    refs = repo.find_references(t)

    # Transform data for output, to
    # { "term": [refs], "children": [refs], "parent1": [refs], "parent2" ... }
    refdata = [(f'"{text}"', refs["term"]), (f'"{text}" child terms', refs["children"])]
    for p in refs["parents"]:
        refdata.append((f"\"{p['term']}\"", p["refs"]))

    refcount = sum(len(ref[1]) for ref in refdata)
    references = [
        {
            "dto": {
                "sentence": dto.sentence,
                "bookId": dto.book_id,
                "pageNumber": dto.page_number,
                "title": dto.title,
            },
            "term": k,
        }
        for k, dtos in refdata
        for dto in dtos
    ]

    return jsonify({"text": text, "references": references if refcount > 0 else []})


#
@bp.route("/keys", methods=["GET", "POST"])
def keys():
    """
    Return hotkey UserSetting keys and values,
    grouped by category.
    """

    categorized_settings = [
        {
            "Navigation": [
                "hotkey_StartHover",
                "hotkey_PrevWord",
                "hotkey_NextWord",
                "hotkey_PrevUnknownWord",
                "hotkey_NextUnknownWord",
                "hotkey_PrevSentence",
                "hotkey_NextSentence",
            ]
        },
        {
            "Update status": [
                "hotkey_Status1",
                "hotkey_Status2",
                "hotkey_Status3",
                "hotkey_Status4",
                "hotkey_Status5",
                "hotkey_StatusIgnore",
                "hotkey_StatusWellKnown",
                "hotkey_StatusUp",
                "hotkey_StatusDown",
                "hotkey_DeleteTerm",
            ]
        },
        {
            "Translate": [
                "hotkey_TranslateSentence",
                "hotkey_TranslatePara",
                "hotkey_TranslatePage",
            ]
        },
        {
            "Copy": [
                "hotkey_CopySentence",
                "hotkey_CopyPara",
                "hotkey_CopyPage",
            ]
        },
        {
            "Misc": [
                "hotkey_Bookmark",
                "hotkey_EditPage",
                "hotkey_NextTheme",
                "hotkey_ToggleHighlight",
                "hotkey_ToggleFocus",
            ]
        },
    ]

    setting_descs = {
        "hotkey_StartHover": "Deselect all words",
        "hotkey_PrevWord": "Move to previous word",
        "hotkey_NextWord": "Move to next word",
        "hotkey_PrevUnknownWord": "Move to previous unknown word",
        "hotkey_NextUnknownWord": "Move to next unknown word",
        "hotkey_PrevSentence": "Move to previous sentence",
        "hotkey_NextSentence": "Move to next sentence",
        "hotkey_StatusUp": "Bump up by 1",
        "hotkey_StatusDown": "Bump down by 1",
        "hotkey_Bookmark": "Bookmark the current page",
        "hotkey_CopySentence": "Sentence of the current word",
        "hotkey_CopyPara": "Paragraph of the current word",
        "hotkey_CopyPage": "Full page",
        "hotkey_TranslateSentence": "Sentence of the current word",
        "hotkey_TranslatePara": "Paragraph of the current word",
        "hotkey_TranslatePage": "Full page",
        "hotkey_NextTheme": "Cycle theme",
        "hotkey_ToggleHighlight": "Toggle highlights",
        "hotkey_ToggleFocus": "Toggle focus mode",
        "hotkey_Status1": "Set to 1",
        "hotkey_Status2": "Set to 2",
        "hotkey_Status3": "Set to 3",
        "hotkey_Status4": "Set to 4",
        "hotkey_Status5": "Set to 5",
        "hotkey_StatusIgnore": "Set to Ignore",
        "hotkey_StatusWellKnown": "Set to Well Known",
        "hotkey_DeleteTerm": "Set to Unknown (Delete term)",
        "hotkey_EditPage": "Edit the current page",
    }

    settings = {h.key: h.value for h in db.session.query(UserSetting).all()}
    return jsonify(
        [
            {
                "name": category,
                "shortcuts": [
                    {
                        "label": setting_descs[key],
                        "key": settings[key],
                        "description": key,
                    }
                    for key in keylist
                ],
            }
            for entry in categorized_settings
            for category, keylist in entry.items()
        ]
    )


#
@bp.route("/appinfo")
def version():
    """
    app version
    """
    ac = current_app.env_config
    return jsonify(
        {
            "version": __version__,
            "datapath": ac.datapath,
            "database": ac.dbfilename,
            "isDocker": ac.is_docker,
        }
    )


@bp.route("/audio/<int:bookid>", methods=["GET"])
def stream(bookid):
    "Serve the audio, no caching."
    dirname = current_app.env_config.useraudiopath
    br = BookRepository(db.session)
    book = br.find(bookid)
    fname = os.path.join(dirname, book.audio_filename)
    return send_file(fname, as_attachment=True, max_age=0)


@bp.route("/image/<int:lgid>/<term>", methods=["GET"])
def get_image(lgid, term):
    "Serve the image from the data/userimages directory."
    datapath = current_app.config["DATAPATH"]
    directory = os.path.join(datapath, "userimages", str(lgid))
    filename = term + ".jpeg"
    return send_from_directory(directory, filename)
