import os
from flask import Flask, json, abort, request
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
import logging

app = Flask(__name__)
CORS(app, origins=["http://localhost:*"])

@app.errorhandler(HTTPException)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error
    response = e.get_response()
    # replace the body with JSON
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response

@app.route("/")
def index():
    return "<p>Hello, World!</p>"

@app.route("/listdir")
def listdir():
    dir = os.path.expanduser(request.args.get('dir') or "~")
    app.logger.info(f"Listing directory {dir}")
    # check if the directory exists
    if not os.path.isdir(dir):
        abort(404, description=f"Directory {dir} does not exist.")
    # TODO: add options to recursively search for files
    # search for files in the directory
    files = [
        file for file in os.listdir(dir) if os.path.isfile(os.path.join(dir, file))
    ]
    return files
