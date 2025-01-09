"Term endpoints"

import os
import json
import csv

from flask import Blueprint, jsonify, send_file, current_app, request
from sqlalchemy import text as SQLText

from lute.db import db
from lute.read.service import Service as ReadService
from lute.term.model import Repository
from lute.utils.data_tables import supported_parser_type_criteria


bp = Blueprint("api_terms", __name__, url_prefix="/api/terms")


def parse_url_params():
    """
    parse table url params
    """
    return {
        # Pagination
        "start": int(request.args.get("start", 0)),  # Starting index
        "size": int(request.args.get("size", 10)),  # Page size
        # Filters
        "global_filter": request.args.get("globalFilter", "").strip(),
        # [{"id": "title", "value": "Book"}]
        "filters": json.loads(request.args.get("filters", "[]")),
        # {"title": "contains"}
        "filter_modes": json.loads(request.args.get("filterModes", "{}")),
        # Sorting [{"id": "WordCount", "desc": True}]
        "sorting": json.loads(request.args.get("sorting", "[]")),
    }


@bp.route("/", methods=["GET"])
def get_terms():
    """
    get terms with request parameters
    """
    params = parse_url_params()
    return get_all_terms(params)


def get_all_terms(params):
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

    if request.args.get("parentsOnly", "false") == "true":
        base_sql += "AND parents.parentlist IS NULL"

    # Mapping fields to their respective database columns
    field_mapping = {
        "text": "WoText",
        "parentText": "ParentText",
        "translation": "WoTranslation",
        "language": "LgName",
        "status": "StID",
        "createdOn": "WoCreated",
        "tags": "TagList",
    }
    # Apply Filters
    for flt in params["filters"]:
        field = flt.get("id")
        value = flt.get("value", "")
        mode = params["filter_modes"].get(field, "contains")

        # Check if the field is valid
        if field in field_mapping and field != "status" and field != "createdOn":
            column = field_mapping[field]
            if mode == "contains":
                base_sql += f" AND {column} LIKE '%{value}%'"
            elif mode == "startsWith":
                base_sql += f" AND {column} LIKE '{value}%'"
            elif mode == "endsWith":
                base_sql += f" AND {column} LIKE '%{value}'"

        if field == "status":
            value0 = value[0]
            value1 = value[1]
            statuses = [0, 1, 2, 3, 4, 5, 99, 98]

            if value0 == value1:
                base_sql += f" AND StID = {statuses[value0]}"
                continue

            status_range = statuses[value0 : value1 + 1]
            base_sql += f" AND StID IN {(tuple(status_range))}"

        elif field == "createdOn":
            value0 = value[0]
            value1 = value[1]

            if not value0 and not value1:
                continue

            base_sql += f" AND WoCreated BETWEEN '{value0}' AND '{value1}'"

    # Apply Global Filter
    if params["global_filter"]:
        global_filter = params["global_filter"]
        if global_filter.isdigit():
            base_sql += f""" AND (WoCreated LIKE '%{global_filter}%' OR
                            StID = {global_filter}
                        )"""
        else:  # String value
            base_sql += f""" AND (
                            WoText LIKE '%{global_filter}%' OR
                            ParentText LIKE '%{global_filter}%' OR
                            WoTranslation LIKE '%{global_filter}%' OR
                            LgName LIKE '%{global_filter}%'
                        )"""

    # initial sorting (status filtering messes up default sorting)
    sort_clauses = ["WoCreated DESC"]
    # Apply Sorting
    if params["sorting"]:
        sort_clauses = []
        for sort in params["sorting"]:
            field = sort.get("id")
            desc_order = sort.get("desc", False)

            # Check if the field is valid and append the corresponding sort clause
            if field in field_mapping:
                sort_direction = "DESC" if desc_order else "ASC"
                sort_clauses.append(f"{field_mapping[field]} {sort_direction}")

    # Add the ORDER BY clause
    if sort_clauses:
        base_sql += " ORDER BY " + ", ".join(sort_clauses)

    # Count rows after filtering
    count_sql = f"SELECT COUNT(*) FROM ({base_sql}) AS filtered_query"
    # Apply Pagination
    base_sql += f" LIMIT {params['size']} OFFSET {params['start']}"

    results = db.session.execute(SQLText(base_sql)).fetchall()
    rowCount = db.session.execute(SQLText(count_sql)).scalar()

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
                "statusId": row.StID,
                "image": row.WiSource,
                "createdOn": row.WoCreated,
                "tags": row.TagList.split(",") if row.TagList else [],
                # "statusLabel": row.StText,
            }
        )

    return jsonify({"data": response, "total": rowCount})


@bp.route("/tags", methods=["GET"])
def get_term_tags():
    "json data for term tags."

    base_sql = """SELECT
          TgID,
          TgText,
          TgComment,
          ifnull(TermCount, 0) as TermCount
          FROM tags
          left join (
            select WtTgID,
            count(*) as TermCount
            from wordtags
            group by WtTgID
          ) src on src.WtTgID = TgID
    """

    results = db.session.execute(SQLText(base_sql)).fetchall()

    response = []
    for row in results:
        response.append(
            {
                "id": row.TgID,
                "text": row.TgText,
                "termCount": row.TermCount,
                "comment": row.TgComment,
            }
        )

    return jsonify(response)


@bp.route("/export", methods=["GET"])
def export_terms():
    "Generate export file of terms."
    # !!! NEED TO GET ALL DATA, NOT FILTERED OR PAGINATED (OR CAN USE PARAMS FOR CUSTOM EXPORT)
    export_file = os.path.join(current_app.env_config.temppath, "terms.csv")
    response = get_terms()
    term_data = response.get_json()
    # Term data is an array of dicts, with the sql field name as dict
    # keys.  These need to be mapped to headings.
    heading_to_fieldname = {
        "Term": "text",
        "Parent": "parentText",
        "Translation": "translation",
        "Language": "language",
        "Status": "statusLabel",
        "Added on": "createdOn",
        "Pronunciation": "romanization",
    }

    headings = heading_to_fieldname.keys()
    output_data = [
        [r[heading_to_fieldname[fieldname]] for fieldname in headings]
        for r in term_data
    ]
    with open(export_file, "w", encoding="utf-8", newline="") as f:
        csv_writer = csv.writer(f)
        csv_writer.writerow(headings)
        csv_writer.writerows(output_data)

    return send_file(export_file, as_attachment=True)


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


@bp.route("/tags/suggestions", methods=["GET"])
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
