# Sessions manager

import json
import os
import time
import uuid


# TODO: deal with creating the file or fixing it if it contains invalid JSON

class Sessions:
    def __init__(self, file_path):
        self.file_path = file_path

        self.sessions = {}
        self._read_from_file()

    def create_session(self, data):
        # creates a session and returns the session access token which can be
        # used once to get the session id

        while True:
            # loop until the session id is unique (probably only runs once)
            session_id = str(uuid.UUID(bytes=os.urandom(16)))

            if session_id not in self.sessions:
                break

        # TODO: check if the session_access_token is unique
        session_access_token = str(uuid.UUID(bytes=os.urandom(16)))

        self.sessions[session_id] = {
            'data': data,
            # meta data to be used by this class only
            'meta': {
                'created_time': round(time.time()),
                'session_access_token': session_access_token,
                'session_access_token_used': False,
            }
        }

        self._write_to_file()

        return session_access_token

    def get_session(self, session_id):
        if session_id in self.sessions:
            return self.sessions[session_id]

        return None

    def get_session_id_by_session_access_token(self, session_access_token):
        # get a session_id by a session_access_token, and set the token as used

        for session_id in self.sessions:
            metadata = self.get_session(session_id)['meta']

            # don't give the session if the session_access_token was used
            if 'session_access_token' in metadata \
               and not metadata['session_access_token_used'] \
               and metadata['session_access_token'] == session_access_token:

                # set it as used (edit the self.sessions, not the copy of meta)
                self.sessions[session_id]['meta']['session_access_token_used'] = True
                self._write_to_file()

                return session_id

        return None

    def _read_from_file(self):
        with open(self.file_path, 'r') as f:
            self.sessions = json.load(f)
    
    def _write_to_file(self):
        with open(self.file_path, 'w') as f:
            json.dump(self.sessions, f, indent=2)
