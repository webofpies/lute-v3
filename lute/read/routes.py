"""
/read endpoints.
"""

from urllib.parse import urlparse
from datetime import datetime
from flask import Blueprint, flash, request, render_template, redirect, jsonify
from lute.read.service import set_unknowns_to_known, start_reading, get_popup_data
from lute.read.render.service import get_paragraphs
from lute.read.forms import TextForm
from lute.term.model import Repository
from lute.term.routes import handle_term_form
from lute.models.book import Book, Text
from lute.models.setting import UserSetting
from lute.db import db


bp = Blueprint("read", __name__, url_prefix="/read")


def _render_book_page(book, pagenum):
    """
    Render a particular book page.
    """
    lang = book.language
    show_highlights = bool(int(UserSetting.get_value("show_highlights")))
    term_dicts = lang.all_dictionaries()[lang.id]["term"]

    return render_template(
        "read/index.html",
        hide_top_menu=True,
        is_rtl=lang.right_to_left,
        html_title=book.title,
        book=book,
        sentence_dict_uris=lang.sentence_dict_uris,
        page_num=pagenum,
        page_count=book.page_count,
        show_highlights=show_highlights,
        lang_id=lang.id,
        term_dicts=term_dicts,
    )


@bp.route("/<int:bookid>", methods=["GET"])
def read(bookid):
    """
    Read a book, opening to its current page.

    This is called from the book listing, on Lute index.
    """
    book = Book.find(bookid)
    if book is None:
        flash(f"No book matching id {bookid}")
        return redirect("/", 302)

    page_num = 1
    text = book.texts[0]
    if book.current_tx_id:
        text = Text.find(book.current_tx_id)
        page_num = text.order

    return _render_book_page(book, page_num)


@bp.route("/<int:bookid>/page/<int:pagenum>", methods=["GET"])
def read_page(bookid, pagenum):
    """
    Read a particular page of a book.

    Called from term Sentences link.
    """
    book = Book.find(bookid)
    if book is None:
        flash(f"No book matching id {bookid}")
        return redirect("/", 302)

    pagenum = book.page_in_range(pagenum)
    return _render_book_page(book, pagenum)


@bp.route("/page_done", methods=["post"])
def page_done():
    "Handle POST when page is done."
    data = request.json
    bookid = int(data.get("bookid"))
    pagenum = int(data.get("pagenum"))
    restknown = data.get("restknown")

    book = Book.find(bookid)
    text = book.text_at_page(pagenum)
    text.read_date = datetime.now()
    db.session.add(text)
    db.session.commit()
    if restknown:
        set_unknowns_to_known(text)
    return jsonify("ok")


@bp.route("/delete_page/<int:bookid>/<int:pagenum>", methods=["GET"])
def delete_page(bookid, pagenum):
    """
    Delete page.
    """
    book = Book.find(bookid)
    if book is None:
        flash(f"No book matching id {bookid}")
        return redirect("/", 302)

    if len(book.texts) == 1:
        flash("Cannot delete only page in book.")
    else:
        book.remove_page(pagenum)
        db.session.add(book)
        db.session.commit()

    url = f"/read/{bookid}/page/{pagenum}"
    return redirect(url, 302)


@bp.route("/new_page/<int:bookid>/<position>/<int:pagenum>", methods=["GET", "POST"])
def new_page(bookid, position, pagenum):
    "Create a new page."
    form = TextForm()
    book = Book.find(bookid)

    if form.validate_on_submit():
        t = None
        if position == "before":
            t = book.add_page_before(pagenum)
        else:
            t = book.add_page_after(pagenum)
        t.book = book
        t.text = form.text.data
        db.session.add(book)
        db.session.commit()

        book.current_tx_id = t.id
        db.session.add(book)
        db.session.commit()

        return redirect(f"/read/{book.id}", 302)

    text_dir = "rtl" if book.language.right_to_left else "ltr"
    return render_template(
        "read/page_edit_form.html", hide_top_menu=True, form=form, text_dir=text_dir
    )


@bp.route("/save_player_data", methods=["post"])
def save_player_data():
    "Save current player position, bookmarks.  Called on a loop by the player."
    data = request.json
    bookid = int(data.get("bookid"))
    book = Book.find(bookid)
    book.audio_current_pos = float(data.get("position"))
    book.audio_bookmarks = data.get("bookmarks")
    db.session.add(book)
    db.session.commit()
    return jsonify("ok")


@bp.route("/renderpage/<int:bookid>/<int:pagenum>", methods=["GET"])
def render_page(bookid, pagenum):
    "Method called by ajax, render the given page."
    book = Book.find(bookid)
    if book is None:
        flash(f"No book matching id {bookid}")
        return redirect("/", 302)
    paragraphs = start_reading(book, pagenum, db.session)
    return render_template("read/page_content.html", paragraphs=paragraphs)


@bp.route("/empty", methods=["GET"])
def empty():
    "Show an empty/blank page."
    return ""


@bp.route("/termform/<int:langid>/<text>", methods=["GET", "POST"])
def term_form(langid, text):
    """
    Create a multiword term.
    """
    repo = Repository(db)
    term = repo.find_or_new(langid, text)
    if term.status == 0:
        term.status = 1
    return handle_term_form(
        term,
        repo,
        "/read/frameform.html",
        render_template("/read/updated.html", term_text=term.text),
        embedded_in_reading_frame=True,
    )


@bp.route("/edit_term/<int:term_id>", methods=["GET", "POST"])
def edit_term_form(term_id):
    """
    Edit a term.
    """
    repo = Repository(db)
    term = repo.load(term_id)
    # print(f"editing term {term_id}", flush=True)
    if term.status == 0:
        term.status = 1
    return handle_term_form(
        term,
        repo,
        "/read/frameform.html",
        render_template("/read/updated.html", term_text=term.text),
        embedded_in_reading_frame=True,
    )


@bp.route("/termpopup/<int:termid>", methods=["GET"])
def term_popup(termid):
    """
    Get popup html for DBTerm, or None if nothing should be shown.
    """
    d = get_popup_data(termid)
    if d is None:
        return ""
    return render_template(
        "read/termpopup.html",
        term=d["term"],
        flashmsg=d["flashmsg"],
        term_tags=d["term_tags"],
        term_images=d["term_images"],
        parentdata=d["parentdata"],
        parentterms=d["parentterms"],
        componentdata=d["components"],
    )


@bp.route("/flashcopied", methods=["GET"])
def flashcopied():
    return render_template("read/flashcopied.html")


@bp.route("/editpage/<int:bookid>/<int:pagenum>", methods=["GET", "POST"])
def edit_page(bookid, pagenum):
    "Edit the text on a page."
    book = Book.find(bookid)
    text = book.text_at_page(pagenum)
    if text is None:
        return redirect("/", 302)
    form = TextForm(obj=text)

    if form.validate_on_submit():
        form.populate_obj(text)
        db.session.add(text)
        db.session.commit()
        return redirect(f"/read/{book.id}", 302)

    text_dir = "rtl" if book.language.right_to_left else "ltr"
    return render_template(
        "read/page_edit_form.html", hide_top_menu=True, form=form, text_dir=text_dir
    )


# API for React
@bp.route("/<int:bookid>/info", methods=["GET"])
def book_info(bookid):
    "book object to json"

    book = Book.find(bookid)
    if book is None:
        return redirect("/", 302)

    page_num = 1
    text = book.texts[0]
    if book.current_tx_id:
        text = Text.find(book.current_tx_id)
        page_num = text.order

    lang = book.language
    show_highlights = bool(int(UserSetting.get_value("show_highlights")))
    term_dicts = lang.all_dictionaries()[lang.id]["term"]

    def get_dict_info(dictURL, dictID):
        is_external = dictURL[0] == "*"
        url = dictURL.replace("*", "")
        # label = url if len(url) <= 10 else f"{url[:10]}..."
        hostname = urlparse(url).hostname
        label = hostname.split("www.")[-1] if hostname.startswith("www.") else hostname

        return {
            "id": dictID,
            "url": url,
            "label": label,
            "isExternal": is_external,
            "hostname": hostname,
        }

    dicts = [get_dict_info(dict, index) for index, dict in enumerate(term_dicts)]

    # print(vars(book))

    book_dict = {
        "id": book.id,
        "title": book.title,
        "page_count": book.page_count,
        "page_num": page_num,
        "show_highlights": show_highlights,
        "lang_id": lang.id,
        "term_dicts": dicts,
        "is_rtl": lang.right_to_left,
        "sentence_dict_uris": lang.sentence_dict_uris,
        "audio_filename": book.audio_filename,
        "audio_current_pos": (
            float(book.audio_current_pos) if book.audio_current_pos else 0
        ),
        "audio_bookmarks": (
            [float(x) for x in book.audio_bookmarks.split(";")]
            if book.audio_bookmarks
            else []
        ),
    }

    # print(book_dict)

    return jsonify(book_dict)


@bp.route("/<int:bookid>/<int:pagenum>/pageinfo", methods=["GET"])
def page_info(bookid, pagenum):
    "send book info in json"
    book = Book.find(bookid)
    if book is None:
        return redirect("/", 302)

    paragraphs = get_page_paragraphs(bookid, pagenum)
    paras = [
        [
            {
                "sentence_id": sentence.sentence_id,
                "textitems": [
                    {
                        "id": textitem.span_id,
                        "html_display_text": textitem.html_display_text,
                        "class": textitem.html_class_string,
                        "data-lang-id": textitem.lang_id,
                        "data-paragraph-id": textitem.para_id,
                        "data-sentence-id": textitem.se_id,
                        "data-text": textitem.text,
                        "data-status-class": textitem.status_class,
                        "data-order": textitem.order,
                        "data-wid": textitem.wo_id,
                    }
                    for textitem in sentence.textitems
                ],
            }
            for sentence in paragraph
        ]
        for paragraph in paragraphs
    ]

    return jsonify(paras)


def get_page_paragraphs(bookid, pagenum):
    "does what it says"
    book = Book.find(bookid)
    text = book.text_at_page(pagenum)
    lang = text.book.language

    return get_paragraphs(text.text, lang)


@bp.route("/terms/<int:term_id>", methods=["GET", "POST"])
def term_info(term_id):
    """
    term info for term form
    """
    repo = Repository(db)
    term = repo.load(term_id)
    # print(f"editing term {term_id}", flush=True)
    if term.status == 0:
        term.status = 1
    # print(vars(term), "term")
    # print(repo, "repo")
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
    repo = Repository(db)
    term = repo.find_or_new(langid, text)
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
    d = get_popup_data(termid)

    return jsonify(
        {
            "term": d["term"].text,
            "translation": d["term"].translation,
            "romanization": d["term"].romanization,
            "flashmsg": d["flashmsg"],
            "term_tags": d["term_tags"],
            "term_images": d["term_images"],
            "parentdata": d["parentdata"],
            "parentterms": d["parentterms"],
            "componentdata": d["components"],
        }
    )
