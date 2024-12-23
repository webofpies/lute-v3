"Term endpoints"

from flask import Blueprint, jsonify

from lute.db import db
from lute.read.service import Service as ReadService
from lute.term.model import Repository


bp = Blueprint("api_terms", __name__, url_prefix="/api/terms")


@bp.route("/<int:term_id>", methods=["GET", "POST"])
def term_info(term_id):
    """
    term info for term form
    """
    repo = Repository(db.session)
    term = repo.load(term_id)

    return _term_to_dict(term)


@bp.route("/<text>/<int:langid>", methods=["GET", "POST"])
def multiterm_info(langid, text):
    """
    multiterm info for term form
    """
    usetext = text.replace("LUTESLASH", "/")
    repo = Repository(db.session)
    term = repo.find_or_new(langid, usetext)

    return _term_to_dict(term)


@bp.route("<int:termid>/popup", methods=["GET"])
def popup_content(termid):
    """
    Show a term popup for the given DBTerm.
    """
    service = ReadService(db.session)
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


@bp.route("/<text>/<int:langid>/sentences", methods=["GET"])
def get_sentences(langid, text):
    "Get sentences for terms."
    repo = Repository(db.session)
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
    variations = [
        {
            "term": k,
            "references": [
                {
                    "id": dtos.index(dto),
                    "sentence": dto.sentence,
                    "bookId": dto.book_id,
                    "bookTitle": dto.title,
                    "pageNumber": dto.page_number,
                }
                for dto in dtos
            ],
        }
        for k, dtos in refdata
    ]

    return jsonify({"text": text, "variations": variations if refcount > 0 else []})


@bp.route("/<int:langid>/<text>", methods=["GET"])
def get_term_suggestions(text, langid):
    "term suggestions for parent data"

    if text.strip() == "" or langid == 0:
        return []

    repo = Repository(db.session)
    matches = repo.find_matches(langid, text)

    def _make_entry(t):
        return {
            "id": t.id,
            "text": t.text,
            "translation": t.translation,
            "status": t.status,
        }

    result = [_make_entry(t) for t in matches]
    return jsonify(result)


@bp.route("/tags", methods=["GET"])
def get_tag_suggestions():
    "tag suggestions"

    repo = Repository(db.session)
    return jsonify(repo.get_term_tags())


def _term_to_dict(term):
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
