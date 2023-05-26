# File Organizer

This project is an experiment to use LLM as a general purpose classifier. It reads files in a directory and moves them to a new directory based on the file name, type and content. The destination directory is determined by the LLM model (OpenAI GPT-3.5).

## Usage

As of now, you need to have an OpenAI API key to use this project.

First, install the dependencies with poetry:

```bash
poetry update
```

Then, create a `config.toml` file. You can use `config.toml.example` as a template.

Finally, run the script:

```bash
poetry run start
```

Example output:

```
➜  file_organizer git:(main) poetry run start
Found 7 files in /Users/mengdi/Downloads. Do you want to proceed? (Y/n)

IMG_6943-removebg.png => ~/Downloads/pictures
IMG_6943-removebg.jpg => ~/Downloads/pictures
health-form.pdf => ~/Downloads/personal/medical
2022_TaxReturn.pdf => ~/Downloads/personal/tax
5E1FAFCF-2E4B-44B3-B2CD-8656B0890D86.jpeg => ~/Downloads/pictures
IMG_6492.JPG => ~/Downloads/pictures
Raycast.dmg => ~/Downloads/software

Please check the output in "output.sh" and run it: source output.sh
```

