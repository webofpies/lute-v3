"Term endpoints"

from flask import Blueprint, jsonify
from sqlalchemy import text as SQLText

from lute.db import db
from lute.read.service import Service as ReadService
from lute.term.model import Repository
from lute.utils.data_tables import supported_parser_type_criteria


bp = Blueprint("api_terms", __name__, url_prefix="/api/terms")


@bp.route("/", methods=["GET"])
def get_terms():
    "Term json data for tables."

    base_sql = f"""
                SELECT w.WoID AS WoID,
                    LgName,
                    L.LgID AS LgID,
                    w.WoText AS WoText,
                    parents.parentlist AS ParentText,
                    w.WoTranslation,
                    w.WoRomanization,
                    replace(wi.WiSource, '.jpeg', '') AS WiSource,
                    ifnull(tags.taglist, '') AS TagList,
                    StText,
                    StID,
                    StAbbreviation,
                    CASE w.WoSyncStatus
                        WHEN 1 THEN 'y'
                        ELSE ''
                    END AS SyncStatus,
                    datetime(WoCreated, 'localtime') AS WoCreated
                FROM words w

                INNER JOIN languages L ON L.LgID = w.WoLgID

                INNER JOIN statuses S ON S.StID = w.WoStatus

                LEFT OUTER JOIN
                (SELECT WpWoID AS WoID,
                        GROUP_CONCAT(PText, ', ') AS parentlist
                FROM
                    (SELECT WpWoID,
                            WoText AS PText
                    FROM wordparents wp
                    INNER JOIN words ON WoID = WpParentWoID
                    ORDER BY WoText) parentssrc
                GROUP BY WpWoID) AS parents ON parents.WoID = w.WoID

                LEFT OUTER JOIN
                (SELECT WtWoID AS WoID,
                        GROUP_CONCAT(TgText, ', ') AS taglist
                FROM
                    (SELECT WtWoID,
                            TgText
                    FROM wordtags wt
                    INNER JOIN tags t ON t.TgID = wt.WtTgID
                    ORDER BY TgText) tagssrc
                GROUP BY WtWoID) AS tags ON tags.WoID = w.WoID

                LEFT OUTER JOIN wordimages wi ON wi.WiWoID = w.WoID

                WHERE L.LgParserType in ({ supported_parser_type_criteria() })
    """

    results = db.session.execute(SQLText(base_sql)).fetchall()

    # print([print(row.WoID) for row in results])

    response = []
    for row in results:
        response.append(
            {
                "id": row.WoID,
                "language": row.LgName,
                "languageId": row.LgID,
                "text": row.WoText,
                "parentText": row.ParentText,
                "translation": row.WoTranslation,
                "romanization": row.WoRomanization,
                "statusLabel": row.StText,
                "statusId": row.StID,
                "createdOn": row.WoCreated
                # "StAbbreviation": row.StAbbreviation,
                # "tags": row.TagList.split(",") if row.TagList else [],
            }
        )

    return jsonify(response)

    # typecrit = supported_parser_type_criteria()
    # wheres = [f"L.LgParserType in ({typecrit})"]

    # language_id = parameters["filtLanguage"]
    # if language_id == "null" or language_id is None:
    #     language_id = "0"
    # language_id = int(language_id)
    # if language_id != 0:
    #     wheres.append(f"L.LgID == {language_id}")

    # # if parameters["filtParentsOnly"] == "true":
    # #     wheres.append("parents.parentlist IS NULL")

    # sql_age_calc = "cast(julianday('now') - julianday(w.wocreated) as int)"
    # age_min = parameters["filtAgeMin"].strip()
    # if age_min:
    #     wheres.append(f"{sql_age_calc} >= {int(age_min)}")
    # age_max = parameters["filtAgeMax"].strip()
    # if age_max:
    #     wheres.append(f"{sql_age_calc} <= {int(age_max)}")

    # st_range = ["StID != 98"]
    # status_min = int(parameters.get("filtStatusMin", "0"))
    # status_max = int(parameters.get("filtStatusMax", "99"))
    # st_range.append(f"StID >= {status_min}")
    # st_range.append(f"StID <= {status_max}")
    # st_where = " AND ".join(st_range)
    # if parameters["filtIncludeIgnored"] == "true":
    #     st_where = f"({st_where} OR StID = 98)"
    # wheres.append(st_where)


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
            "term": {"text": d["term"].text, "romanization": d["term"].romanization},
            "translation": d["term_translation"],
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
