class Meta:
    def __init__(self, main: str, description: str, language: str, libraries: list):
        self.main = main
        self.description = description
        self.language = language
        self.libraries = libraries

    def to_json(self):
        return {
            "main": self.main,
            "description": self.description,
            "language": self.language,
            "libraries": self.libraries,
        }


class Error:
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message

    def __repr__(self) -> str:
        return f"<Error: ${self.message}>"

    def __str__(self) -> str:
        return f"<Error: ${self.message}>"

    def to_json(self):
        return {
            "field": self.field,
            "message": self.message,
        }
