"""
API endpoints
"""

from flask import Blueprint, jsonify, current_app

from lute import __version__
from lute.db import db

from lute.models.setting import UserSetting

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/shortcuts", methods=["GET", "POST"])
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
