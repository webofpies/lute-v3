"Bookmark endpoints"


from flask import Blueprint, jsonify


bp = Blueprint("api_bookmarks", __name__, url_prefix="/api/bookmarks")


@bp.route("/<int:bookid>", methods=["GET"])
def get_bookmarks(bookid):
    """
    get bookmarks for a book
    """

    # mock
    all_bookmarks = {
        23: {  # book
            2: [  # page
                {
                    "id": 2,
                    "description": "This sentence reminds me of my chilhood",
                },
                {"id": 6, "description": "Oh, the memories"},
                {"id": 8, "description": "Are we looting?"},
            ],
            9: [
                {
                    "id": 2,
                    "description": "This sentence reminds me of my chilhood",
                },
                {"id": 5, "description": "Oh, the memories"},
                {"id": 6, "description": "Are we looting?"},
                {"id": 7, "description": "Are we looting?"},
                {"id": 8, "description": "Are we looting?"},
            ],
            12: [
                {
                    "id": 4,
                    "description": "This sentence reminds me of my chilhood",
                },
                {"id": 5, "description": "Oh, the memories"},
                {"id": 6, "description": "Are we looting?"},
                {"id": 7, "description": "Are we looting?"},
            ],
        }
    }

    bookmarks = all_bookmarks.get(bookid, None)

    return jsonify(bookmarks)
