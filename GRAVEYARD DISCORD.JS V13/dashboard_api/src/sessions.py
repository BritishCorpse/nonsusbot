# Sessions manager

import json
import os
import uuid


# TODO: deal with creating the file or fixing it if it contains invalid JSON

class Sessions:
    def __init__(self, file_path):
        self.file_path = file_path

        self.sessions = {}
        self._read_from_file()

    def create_session(self, data):
        # creates a session and returns the session id

        while True:
            # loop until the session id is unique (probably only runs once)
            session_id = str(uuid.UUID(bytes=os.urandom(16)))

            if session_id not in self.sessions:
                break

        self.sessions[session_id] = data

        self._write_to_file()

        return session_id

    def get_session(self, session_id):
        if session_id in self.sessions:
            return self.sessions[session_id]

        return None

    def _read_from_file(self):
        with open(self.file_path, 'r') as f:
            self.sessions = json.load(f)
    
    def _write_to_file(self):
        with open(self.file_path, 'w') as f:
            json.dump(self.sessions, f, indent=2)
