from flask import Flask, jsonify, request, g, render_template
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
import sqlite3

import nltk
import uuid
from datetime import datetime 
from chat import generate_bot_response

app = Flask(__name__, static_folder='./../dist', template_folder='./../dist')
CORS(app)
app.config["SECRET_KEY"] = "6c407449884af326107b2096f54ae515"
app.config["DATABASE"] = "chatbot.db"

def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(app.config["DATABASE"])
        db.execute("PRAGMA foreign_keys = ON")  # Enable foreign key constraints
    return db


@app.teardown_appcontext
def close_db(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


def init_db():
    with app.app_context():
        db = get_db()
        # Check if the users table already exists
        existing_tables = db.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
        )
        if existing_tables.fetchone() is None:
            # The users table does not exist, so create it
            with app.open_resource("schema.sql", mode="r") as f:
                db.cursor().executescript(f.read())
            db.commit()
        else:
            print("Users table already exists in the database.")


@app.cli.command("initdb")
def initdb_command():
    init_db()
    print("Initialized the database.")

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return app.send_static_file(filename)

@app.errorhandler(404)
def catch_all(e):
    return app.send_static_file('index.html')

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    firstname = data["firstname"]
    lastname = data["lastname"]
    email = data["email"]
    password = generate_password_hash(data["password"])
    user_id = str(uuid.uuid4())  # Generate a UUID for the user ID

    db = get_db()
    existing_user = db.execute(
        "SELECT * FROM users WHERE email = ?", (email,)
    ).fetchone()
    if existing_user:
        return jsonify({"message": "User already exists", "userId": None}), 409

    db.execute(
        "INSERT INTO users (id, firstname, lastname, email, password, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (user_id, firstname, lastname, email, password, datetime.now()),
    )
    db.commit()

    user_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]

    return (
        jsonify(
            {
                "message": "User registered successfully",
                "userId": user_id,
                "created_at": datetime.now(),
            }
        ),
        201,
    )

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    db = get_db()
    user = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

    stored_hashed_password = user[4]
    new_signin_at = user[8]

    if user and check_password_hash(stored_hashed_password, password):
        user_id = user[0]

        db.execute(
            "UPDATE users SET last_signin_at = ? WHERE id = ?", (new_signin_at, user_id)
        )

        db.execute(
            "UPDATE users SET new_signin_at = ? WHERE id = ?", (datetime.now(), user_id)
        )

        db.commit()

        return jsonify(
            {"message": "Login successful", "userId": user_id, "created_at": user[6]}
        )
    else:
        return (
            jsonify(
                {
                    "message": "Invalid email or password",
                    "userId": None,
                    "last_signin_at": new_signin_at,
                    "new_signin_at": datetime.now,
                }
            ),
            401,
        )


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_id = data["user_id"]
    user_input = data["user_input"]
    current_chat_box = data["current_chat_box"]

    db = get_db()

    # Fetch the name of the current chat box
    current_chat_box_name = db.execute(
        "SELECT name FROM chat_boxes WHERE id = ?", (current_chat_box["id"],)
    ).fetchone()[0]

    bot_response = generate_bot_response(user_input)

    conversation_id = str(uuid.uuid4())  # Generate a random UUID for the conversation

    db.execute(
        "INSERT INTO conversations (id, user_id, chat_box_id, chat_box_name, user_input, bot_response, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (
            conversation_id,
            user_id,
            current_chat_box["id"],
            current_chat_box_name,
            user_input,
            bot_response,
            datetime.now(),
            datetime.now(),
        ),
    )

    db.commit()

    return jsonify(
        {
            "message": "Conversation saved",
            "user_input": user_input,
            "bot_response": bot_response,
            "conversation_id": conversation_id,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }
    )


@app.route("/conversations/<string:user_id>/<string:chat_box_id>", methods=["GET"])
def get_conversations(user_id, chat_box_id):
    db = get_db()
    conversations = db.execute(
        "SELECT id, user_input, bot_response, created_at, updated_at FROM conversations WHERE user_id = ? AND chat_box_id = ? ORDER BY id ASC",
        (user_id, chat_box_id),
    ).fetchall()

    results = [
        {
            "id": row[0],
            "user_input": row[1],
            "bot_response": row[2],
            "created_at": row[3],
            "updated_at": row[4],
        }
        for row in conversations
    ]
    return jsonify(results)


@app.route("/chat_boxes", methods=["GET"])
def get_chat_boxes():
    db = get_db()
    db.row_factory = sqlite3.Row  # Set the row_factory to sqlite3.Row

    chat_boxes = db.execute(
        "SELECT id, name, created_at, updated_at FROM chat_boxes"
    ).fetchall()

    results = [
        {
            "id": row["id"],
            "name": row["name"],
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }
        for row in chat_boxes
    ]
    return jsonify(results)


@app.route("/new_chat_box/<string:user_id>", methods=["POST"])
def new_chat_box(user_id):
    db = get_db()
    current_chat_box = db.execute(
        "SELECT current_chat_box FROM users WHERE id = ?", (user_id,)
    ).fetchone()[0]

    new_chat_box = current_chat_box + 1

    new_chat_box_id = str(uuid.uuid4())  # Generate a random UUID for the new chat box

    # Generate a suitable name for the new chat box
    new_chat_box_name = generate_chat_box_name()

    db.execute(
        "UPDATE users SET current_chat_box = ? WHERE id = ?", (new_chat_box, user_id)
    )

    db.execute(
        "INSERT INTO chat_boxes (id, name) VALUES (?, ?)",
        (new_chat_box_id, new_chat_box_name),
    )

    db.commit()

    return jsonify(
        {
            "message": "New chat box created",
            "user_id": user_id,
            "name": new_chat_box_name,
            "id": new_chat_box_id,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }
    )


@app.route("/edit_chat_box/<string:user_id>/<string:chat_box_id>", methods=["POST"])
def edit_chat_box(user_id, chat_box_id):
    data = request.get_json()
    new_chat_box_name = data["new_chat_box_name"]

    db = get_db()
    db.execute(
        "UPDATE chat_boxes SET name = ?, updated_at = ? WHERE id = ?",
        (new_chat_box_name, datetime.now(), chat_box_id),
    )
    db.commit()

    # Fetch the updated chat box name and timestamps from the database
    updated_chat_box = db.execute(
        "SELECT name, created_at, updated_at FROM chat_boxes WHERE id = ?",
        (chat_box_id,),
    ).fetchone()
    updated_chat_box_name = updated_chat_box[0]
    created_at = updated_chat_box[1]
    updated_at = updated_chat_box[2]

    return jsonify(
        {
            "message": "Chat box name updated",
            "name": updated_chat_box_name,
            "created_at": created_at,
            "updated_at": updated_at,
        }
    )


@app.route("/delete_chat_box/<string:user_id>/<string:chat_box_id>", methods=["GET"])
def delete_chat_box(user_id, chat_box_id):
    db = get_db()

    # Delete all conversations associated with the chat box
    db.execute(
        "DELETE FROM conversations WHERE user_id = ? AND chat_box_id = ?",
        (user_id, chat_box_id),
    )

    # Delete the chat box
    db.execute("DELETE FROM chat_boxes WHERE id = ?", (chat_box_id,))

    db.commit()
    return jsonify({"message": "Chat box deleted"})


@app.route(
    "/edit_query/<string:user_id>/<string:chat_box_id>/<string:conversation_id>",
    methods=["POST"],
)
def edit_query(user_id, chat_box_id, conversation_id):
    data = request.get_json()
    new_query = data["new_query"]

    db = get_db()

    # Delete all the conversations after the specified conversation
    db.execute(
        "DELETE FROM conversations WHERE user_id = ? AND chat_box_id = ? AND id > ?",
        (user_id, chat_box_id, conversation_id),
    )

    # Update the specified conversation with the new query and update the 'updated_at' timestamp
    db.execute(
        "UPDATE conversations SET user_input = ?, updated_at = ? WHERE user_id = ? AND chat_box_id = ? AND id = ?",
        (new_query, datetime.now(), user_id, chat_box_id, conversation_id),
    )

    db.commit()

    # Generate a new bot response for the updated query
    bot_response = generate_bot_response(new_query)

    # Get the updated conversation
    updated_conversation = db.execute(
        "SELECT * FROM conversations WHERE user_id = ? AND chat_box_id = ? AND id = ?",
        (user_id, chat_box_id, conversation_id),
    ).fetchone()

    return jsonify(
        {
            "message": "Query updated",
            "user_input": updated_conversation[
                2
            ],  # Use integer index 2 for 'user_input'
            "bot_response": bot_response,
            "conversation_id": conversation_id,
            "created_at": updated_conversation[
                4
            ],  # Use integer index 4 for 'created_at'
            "updated_at": updated_conversation[
                5
            ],  # Use integer index 5 for 'updated_at'
        }
    )


@app.route("/regenerate_response", methods=["POST"])
def regenerate_response():
    data = request.get_json()
    conversation_id = data["conversation_id"]
    user_input = data["user_input"]

    # Generate a new bot response based on the user input
    bot_response = generate_bot_response(user_input)

    db = get_db()

    # Update the bot_response in the conversations table
    db.execute(
        "UPDATE conversations SET bot_response = ?, updated_at = ? WHERE id = ?",
        (bot_response, datetime.now(), conversation_id),
    )

    db.commit()

    return jsonify(
        {
            "message": "Bot response regenerated and updated",
            "bot_response": bot_response,
            "user_input": user_input,
            "bot_response": bot_response,
            "conversation_id": conversation_id,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }
    )


def generate_chat_box_name(user_input=None):
    if user_input is not None:
        # Tokenize user input
        tokens = nltk.word_tokenize(user_input)

        # Lemmatize tokens
        lemmatizer = WordNetLemmatizer()
        lemmas = [lemmatizer.lemmatize(token) for token in tokens]

        # Get synonyms for each lemma
        synonyms = set()
        for lemma in lemmas:
            for syn in wordnet.synsets(lemma):
                for name in syn.lemma_names():
                    synonyms.add(name.replace("_", " "))

        # Generate chat box names based on synonyms
        names = [name.capitalize() for name in synonyms if len(name.split()) > 1]

        if names:
            return names[0]

    # If no suitable names are found or user_input is None, use a default name
    return "New Chat"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)