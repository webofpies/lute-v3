"""
API endpoints
"""

from flask import Blueprint, jsonify, current_app

from lute import __version__
from lute.db import db

from lute.settings.current import current_settings
from lute.models.setting import UserSetting
from lute.models.repositories import UserSettingRepository

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/backup", methods=["GET"])
def backup():
    """
    backup settings
    """
    us_repo = UserSettingRepository(db.session)
    bs = us_repo.get_backup_settings()

    return {
        "enabled": bs.backup_enabled,
        "directory": bs.backup_dir,
        "lastDate": bs.last_backup_display_date,
        "timeSince": bs.time_since_last_backup,
    }


@bp.route("/settings", methods=["GET"])
def user_settings():
    """
    settings
    """

    # temporary mock data
    highlights = {
        "highlights": {
            "status": {
                "status0": {"light": "#d0ebff", "dark": "#5cacf3", "type": "bg"},
                "status1": {"light": "#ffd8a8", "dark": "#e68f79", "type": "bg"},
                "status2": {"light": "#8ce99a", "dark": "#efa96d", "type": "text"},
                "status3": {"light": "#b2f2bb", "dark": "#f3cd64", "type": "text"},
                "status4": {"light": "#d3f9d8", "dark": "#fcac67", "type": "solid"},
                "status5": {"light": "#ebfbee", "dark": "#7ae07a", "type": "dashed"},
                "status98": {"light": "#ee8577", "dark": "#ee8577", "type": "none"},
                "status99": {"light": "#51cf66", "dark": "#51cf66", "type": "none"},
            },
            "general": {
                "kwordmarked": {"light": "#228be6", "dark": "#228be6", "type": "solid"},
                "wordhover": {"light": "#f56767", "dark": "#f56767", "type": "solid"},
                "multiterm": {"light": "#ffe066", "dark": "#ffe066", "type": "bg"},
                "flash": {"light": "#ff6868", "dark": "#ff6868", "type": "bg"},
            },
        }
    }

    settings = current_settings | highlights

    return jsonify(settings)


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
