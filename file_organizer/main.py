import os
import toml
from langchain.chat_models import ChatOpenAI, ChatAnthropic
from typing import List, Optional

from .toml_types import Config
from .file import extract_info_from_filepath
from .prompt import get_system_message, get_user_message


def start():
    # check if config.toml exists
    if not os.path.isfile("config.toml"):
        raise Exception(
            "config.toml does not exist. Please create one based on config.toml.example."
        )

    config = Config(toml.load(os.path.join(os.getcwd(), "config.toml")))

    dir = os.path.expanduser(config.dir)
    # check if the directory exists
    if not os.path.isdir(dir):
        raise Exception(f"Directory {dir} does not exist.")
    # TODO: add options to recursively search for files
    # search for files in the directory
    files = [
        file for file in os.listdir(dir) if os.path.isfile(os.path.join(dir, file))
    ]
    if len(files) == 0:
        raise Exception(f"No files found in {dir}.")
    else:
        # confirm with the user that they want to proceed
        print(f"Found {len(files)} files in {dir}. Do you want to proceed? (Y/n)")
        response = input() or "y"
        if response.lower() != "y":
            exit(0)

    # verify the destinations exists, if not, confirm with the user whether to create them
    destinations = config.destinations
    missing_destinations = []
    for destination in destinations:
        if not os.path.isdir(os.path.expanduser(destination)):
            missing_destinations.append(destination)
    if len(missing_destinations) > 0:
        print(
            f"The following destinations do not exist: {missing_destinations}. Do you want to create them? (Y/n)"
        )
        response = input() or "y"
        if response.lower() == "y":
            for destination in missing_destinations:
                os.makedirs(os.path.expanduser(destination))
        else:
            print("Please create the missing destinations.")
            exit(0)

    chat = None
    if config.openai_api_key is not None:
        chat = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0,  # because we want the chatbot to be deterministic
            openai_api_key=config.openai_api_key,
            client=None,
        )
    elif config.anthropic_api_key is not None:
        chat = ChatAnthropic(
            temperature=0,  # because we want the chatbot to be deterministic
            anthropic_api_key=config.anthropic_api_key,
        )

    if chat is None:
        raise Exception("No chatbot API key provided.")

    output = "# !/bin/bash\n"

    print("Running the organizer...")
    # loop through the files, extract text from them, and send them to the chatbot
    for file in files:
        filepath = os.path.join(dir, file)
        mimetype, content = extract_info_from_filepath(
            filepath, config.content_length_limit
        )
        if mimetype is None:
            continue
        # get the response from the chatbot
        response = chat(
            [
                get_system_message(),
                get_user_message(config.destinations, file, mimetype, content),
            ]
        )
        response_content = response.content.strip(" \t\n\r")
        # verify the response is valid in case the chatbot does not follow the response format
        if response_content not in destinations:
            print(f"Invalid response: {response_content} for file {file}. Skipping.")
            continue
        print(f"{file} => {response_content}")
        newline = f'mv "{filepath}" "{os.path.join(os.path.expanduser(response_content), file)}"\n'
        output += newline

    print('Please check the output in "output.sh" and run it: source output.sh')
    with open("output.sh", "w") as f:
        f.write(output)

chat = None
if 'openai_api_key' in os.environ and os.environ['openai_api_key'] is not None:
    chat = ChatOpenAI(
        model="gpt-3.5-turbo",
        temperature=0,  # because we want the chatbot to be deterministic
        openai_api_key=os.environ['openai_api_key'],
        client=None,
    )
elif 'anthropic_api_key' in os.environ and os.environ['anthropic_api_key'] is not None:
    chat = ChatAnthropic(
        temperature=0,  # because we want the chatbot to be deterministic
        anthropic_api_key=os.environ['anthropic_api_key'],
    )
if chat is None:
    raise Exception("No chatbot API key provided.")

def analyze_file(dir: str, filename: str, destinations: List[str]) -> Optional[str]:
    print("Running the organizer...")

    filepath = os.path.join(os.path.expanduser(dir), filename)
    mimetype, content = extract_info_from_filepath(
        filepath
    )
    if mimetype is None:
        return None
    # get the response from the chatbot
    response = chat(
        [
            get_system_message(),
            get_user_message(destinations, filename, mimetype, content),
        ]
    )
    response_content = response.content.strip(" \t\n\r")
    # verify the response is valid in case the chatbot does not follow the response format
    if response_content not in destinations:
        print(f"Invalid response: {response_content} for file {filename}. Skipping.")
        return None
    return response_content
