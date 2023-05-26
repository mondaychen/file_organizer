from langchain.schema import HumanMessage, SystemMessage
from typing import List, Optional

system_message = """You are an assistant to help user decide which folder should a file be put into.
You will be given a list of possible destinations (folder path), and the filename, mime type, and content of the file. The mimetype or content of the file might be empty (marked as "None").
Your output should only contain one folder path that you believe to be the best match. You should not give any reasoning or any other information to the user.

Example 1:

User: 
[destinations]
- ~/Downloads/personal/legal_docs
- ~/Downloads/personal/bills
- ~/Downloads/personal/bank_statement
- ~/Downloads/work
- ~/Downloads/softwares
- ~/Downloads/other

[filename]
May 02 Chase scan.pdf

[mimetype]
application/pdf

[content]
None

Assistant:
~/Downloads/personal/bank_statement

Example 2:

User: 
[destinations]
- ~/Downloads/personal/legal_docs
- ~/Downloads/personal/bills
- ~/Downloads/personal/bank_statement
- ~/Downloads/softwares
- ~/Downloads/other

[filename]
12312455.pdf

[mimetype]
application/pdf

[content]
Form I-485, Application to Register Permanent Residence or Adjust Status
Receipt Notice
This is a Notice about your Application to Register Permanent Residence or Adjust Status. We have received your application form on May 01, 2023.

Assistant:
~/Downloads/personal/legal_docs"""


def get_system_message() -> SystemMessage:
    return SystemMessage(content=system_message)


def get_user_message(
    destinations: List[str], filename: str, mimetype: Optional[str], content: Optional[str]
) -> HumanMessage:
    destinations_str = "- " + "\n- ".join(destinations)
    return HumanMessage(
        content=f"""
[destinations]
{destinations_str}

[filename]
{filename}

[mimetype]
{mimetype or "None"}

[content]
{content or "None"}
"""
    )
