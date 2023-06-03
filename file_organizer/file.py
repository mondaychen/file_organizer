from io import BufferedReader
from typing import Optional, Tuple
import mimetypes
from PyPDF2 import PdfReader
import docx2txt
import csv

DEFAULT_CONTENT_LEN_LIMIT = 1800


def extract_info_from_filepath(
    filepath: str, content_len_limit: Optional[int] = None
) -> Tuple[Optional[str], Optional[str]]:
    # Get the mimetype of the file based on its extension
    mimetype, _ = mimetypes.guess_type(filepath)

    if not mimetype and filepath.endswith(".md"):
        mimetype = "text/markdown"

    if not mimetype:
        return None, None
    return mimetype, extract_text_from_filepath(
        filepath, mimetype, content_len_limit or DEFAULT_CONTENT_LEN_LIMIT
    )


def extract_text_from_filepath(
    filepath: str, mimetype: str, content_len_limit: int
) -> Optional[str]:
    """Return the text content of a file given its filepath."""

    try:
        with open(filepath, "rb") as file:
            extracted_text = extract_text_from_file(file, mimetype, content_len_limit)
    except Exception as e:
        print(f"Error: {e}")
        raise e

    return extracted_text


def extract_text_from_file(
    file: BufferedReader, mimetype: str, content_len_limit: int
) -> Optional[str]:
    if mimetype == "application/pdf":
        # Extract text from pdf using PyPDF2
        reader = PdfReader(file)
        extracted_text = ""
        for page in reader.pages:
            if len(extracted_text) >= content_len_limit:
                break
            try:
                extracted_text += page.extract_text() + "\n"
            except Exception as e:
                print(f"Error in PDF {file}: {e}")
                continue
    elif mimetype == "text/plain" or mimetype == "text/markdown":
        # Read text from plain text file
        extracted_text = file.read().decode("utf-8")
    elif (
        mimetype
        == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ):
        # Extract text from docx using docx2txt
        extracted_text = docx2txt.process(file)
    elif mimetype == "text/csv":
        # Extract text from csv using csv module
        extracted_text = ""
        decoded_buffer = (line.decode("utf-8") for line in file)
        reader = csv.reader(decoded_buffer)
        for row in reader:
            if len(extracted_text) >= content_len_limit:
                break
            extracted_text += " ".join(row) + "\n"
    else:
        # Unsupported file type
        return None

    return extracted_text[:content_len_limit]

def move_file(dir: str, filename: str, destination: str) -> None:
    """Move the file to the destination folder."""
    import os
    import shutil

    des = os.path.expanduser(destination)

    if not os.path.exists(des):
        os.makedirs(des)
    filepath = os.path.join(os.path.expanduser(dir), filename)
    print("moving ", filepath, " => ", os.path.join(des, filename))
    shutil.move(filepath, os.path.join(des, filename))
