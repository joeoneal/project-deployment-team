console.log('session file connected')
// Helper to format the header: "Bearer <random_string>"
function authorizationHeader() {
    let sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
        return "Bearer " + sessionID;
    }
    return null;
}

// Save the session ID (Helper for Login)
function createSession(sessionID) {
    localStorage.setItem("sessionID", sessionID);
}

// Logout: Tell server to delete, then clear local storage
function delete_session() {
    let auth = authorizationHeader();
    if (!auth) {
        // If no session, just clear local and reload
        localStorage.removeItem("sessionID");
        location.reload();
        return;
    }

    fetch("/sessions", {
        method: "DELETE",
        headers: {
            "Authorization": auth
        }
    })
    .then(function (response) {
        console.log("Session deleted from server");
        // Clear local memory
        localStorage.removeItem("sessionID");
        // Reload the app to show login screen
        location.reload();
    })
}