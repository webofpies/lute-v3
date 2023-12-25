"""
Language mapping tests.
"""

from lute.models.language import Language, LanguageDictionary
from lute.db import db
from tests.dbasserts import assert_sql_result
from tests.utils import make_text, add_terms


def test_save_new_language(empty_db):
    """
    Check language mappings and defaults.
    """
    sql = """select LgName, LgRightToLeft,
    LgShowRomanization, LgRegexpSplitSentences
    from languages"""
    assert_sql_result(sql, [], "empty table")

    lang = Language()
    lang.name = "abc"
    lang.dict_1_uri = "something"
    lang.sentence_translate_uri = "sentence_uri"

    ld = LanguageDictionary()
    ld.dicttype = "inlinehtml"
    ld.dicturi = "something?###"
    ld.sort_order = 1
    lang.dictionaries.append(ld)
    ld2 = LanguageDictionary()
    ld2.dicttype = "popuphtml"
    ld2.dicturi = "pop?###"
    ld2.sort_order = 2
    lang.dictionaries.append(ld2)

    db.session.add(lang)
    db.session.commit()
    assert_sql_result(sql, ["abc; 0; 0; .!?"], "have language, defaults as expected")

    sqldicts = """select LgName, LdType, LdDictURI
    from languages
    inner join languagedicts on LdLgID = LgID
    order by LdSortOrder"""
    assert_sql_result(
        sqldicts,
        [
            "abc; inlinehtml; something?###",
            "abc; popuphtml; pop?###",
        ],
        "dict saved",
    )

    lang.right_to_left = True
    db.session.add(lang)
    db.session.commit()
    assert_sql_result(sql, ["abc; 1; 0; .!?"], "rtl is True")

    retrieved = db.session.query(Language).filter(Language.name == "abc").first()
    # print(retrieved)
    assert retrieved.name == "abc"
    assert retrieved.right_to_left is True, "retrieved is RTL"
    assert retrieved.show_romanization is False, "retrieved no roman"

    assert len(retrieved.dictionaries) == 2, "have dicts"
    ld = retrieved.dictionaries[0]
    assert ld.dicttype == "inlinehtml", "type"
    assert ld.dicturi == "something?###", "uri"


def test_delete_language_removes_book_and_terms(app_context, spanish):
    """
    Test HACKY Language.delete() method to ensure deletes cascade.
    """
    add_terms(spanish, ["gato", "perro"])
    t = make_text("hola", "Hola amigo", spanish)
    db.session.add(t)
    db.session.commit()

    sqlterms = "select WoText from words order by WoText"
    sqlbook = "select BkTitle from books where BkTitle = 'hola'"
    assert_sql_result(sqlterms, ["gato", "perro"], "initial terms")
    assert_sql_result(sqlbook, ["hola"], "initial book")

    Language.delete(spanish)

    assert_sql_result(sqlbook, [], "book deleted")
    assert_sql_result(sqlterms, [], "terms deleted")
