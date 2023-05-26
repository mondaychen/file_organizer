from typing import List, Optional

class Config(dict):
    openai_api_key: str
    dir: str
    recursive: bool = False
    content_length_limit: Optional[int] = None
    destinations: List[str] # automatically de-duplicated

    def __init__(self, _dict: dict):
        for k, v in _dict.items():
            if (k == 'destinations'):
                setattr(self, k, list(set(v)))
            else:
                setattr(self, k, v)
