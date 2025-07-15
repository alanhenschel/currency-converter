class Currency:
    def __init__(self, code: str, name: str):
        self.code = code
        self.name = name

    def __repr__(self):
        return f"Currency(code='{self.code}', name='{self.name}')"
