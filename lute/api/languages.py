"""
Languages endpoints
"""

from flask import Blueprint, jsonify, request

from sqlalchemy import text as SQLText
from lute.parse.registry import supported_parsers

from lute.db import db
from lute.models.language import Language as LanguageModel
from lute.language.service import Service as LangService

bp = Blueprint("api_languages", __name__, url_prefix="/api/languages")


@bp.route("/")
def get_languages_list():
    """
    List all languages, with book and term counts.
    """

    lang_type = request.args.get("type")

    if not lang_type or lang_type == "defined":
        # Using plain sql, easier to get bulk quantities.
        sql = """
        select LgID, LgName, book_count, term_count from languages
        left outer join (
        select BkLgID, count(BkLgID) as book_count from books
        group by BkLgID
        ) bc on bc.BkLgID = LgID
        left outer join (
        select WoLgID, count(WoLgID) as term_count from words
        where WoStatus != 0
        group by WoLgID
        ) tc on tc.WoLgID = LgID
        order by LgName
        """
        result = db.session.execute(SQLText(sql)).all()
        languages = [
            {
                "id": row[0],
                "name": row[1],
                "bookCount": row[2] or 0,
                "termCount": row[3] or 0,
            }
            for row in result
        ]

        return jsonify(languages)

    if lang_type == "predefined":
        service = LangService(db.session)
        # !TODO this function gets all info for languages. but we need only the name here
        predefined = service.supported_predefined_languages()

        return jsonify([language.name for language in predefined])

    return jsonify("")


@bp.route("/new/", defaults={"langname": None}, methods=["GET"])
@bp.route("/new/<string:langname>", methods=["GET"])
def new_language(langname=None):
    "get language"

    language = LanguageModel()
    if langname is not None:
        service = LangService(db.session)
        predefined = service.supported_predefined_languages()
        candidates = [lang for lang in predefined if lang.name == langname]
        if len(candidates) == 1:
            language = candidates[0]

    return jsonify(language.to_dict())


@bp.route("/<string:langname>", methods=["GET"])
def get_existing_language(langname):
    "get existing language"

    langid = None
    for lang in db.session.query(LanguageModel).all():
        if lang.name == langname:
            langid = lang.id
            break

    if not langid:
        return jsonify("Language does not exist")

    language = db.session.get(LanguageModel, langid)
    return jsonify(language.to_dict())


@bp.route("/parsers", methods=["GET"])
def get_parsers():
    return jsonify([{"value": a[0], "label": a[1].name()} for a in supported_parsers()])
