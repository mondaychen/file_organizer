import os
from flask import Flask, json, abort, request
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from langchain.chat_models import ChatOpenAI, ChatAnthropic
from file_organizer.main import analyze_file
import logging

app = Flask(__name__)
logging.getLogger('flask_cors').level = logging.DEBUG
CORS(app, origins=["http://localhost:3000"])

@app.errorhandler(HTTPException)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error
    response = e.get_response()
    # replace the body with JSON
    response.data = json.dumps(
        {
            "code": e.code,
            "name": e.name,
            "description": e.description,
        }
    )
    response.content_type = "application/json"
    return response


@app.route("/")
def index():
    return "<p>Hello, World!</p>"


@app.post("/listdir")
def listdir():
    dir = os.path.expanduser(request.get_json().get("dir") or "~")
    app.logger.info(f"Listing directory {dir}")
    # check if the directory exists
    if not os.path.isdir(dir):
        abort(404, description=f"Directory {dir} does not exist.")
    # TODO: add options to recursively search for files
    # search for files in the directory
    files = [
        file
        for file in os.listdir(dir)
        if (not file.startswith(".")) and os.path.isfile(os.path.join(dir, file))
    ]
    return files

@app.post("/analyze")
def analyze():
    dir = request.get_json().get("dir")
    file = request.get_json().get("file")
    destinations = request.get_json().get("destinations")
    result = analyze_file(dir, file, destinations)
    if result is None:
        return {"error": "No suggestion found."}
    else:
        return {"destination": result}
