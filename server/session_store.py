import os
import base64

class SessionStore:
    def __init__(self):
        # Dictionary to hold session data
        # Structure: { "session_id_string": { "user_id": 123 } }
        self.sessions = {}

    def generate_session_id(self):
        # Generate a secure, random 32-byte string
        r_num = os.urandom(32)
        r_str = base64.b64encode(r_num).decode("utf-8")
        return r_str

    def create_session(self, user_id):
        """Creates a new session for the user and returns the Session ID."""
        session_id = self.generate_session_id()
        self.sessions[session_id] = {
            "user_id": user_id
        }
        return session_id

    def get_session_data(self, session_id):
        """Retrieves user data for a valid session ID, or None if invalid."""
        if session_id in self.sessions:
            return self.sessions[session_id]
        return None

    def delete_session(self, session_id):
        """Removes a session from the store (Logout)."""
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False