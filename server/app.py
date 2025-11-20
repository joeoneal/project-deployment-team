from flask import Flask, request, jsonify
from db import DB
from werkzeug.security import generate_password_hash, check_password_hash
from session_store import SessionStore


app = Flask(__name__, static_folder='../client', static_url_path='')

session_store = SessionStore()

@app.route('/tickets/<int:id>', methods=['OPTIONS'])
def do_preflight():
    return '', 204, {'Access-Control-Allow-Origin':'*', 
                     'Access-Control-Allow-Methods':'PUT, DELETE, POST, OPTIONS',
                     'Access-Control-Allow-Headers':'Content-Type, Authorization'}

@app.route('/')
def index():
    return app.send_static_file('index.html')

## authentication ##

@app.route('/users', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return "Missing email or password", 400

    hashed_pw = generate_password_hash(data['password'])
    db = DB('tickets.db')
    user_id = db.createUser(data['first_name'], data['last_name'], data['email'], hashed_pw)
    
    if user_id:
        return f"User created: {user_id}", 201
    else:
        return "Email already exists", 409

@app.route('/sessions', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return "Missing credentials", 400
        
    db = DB('tickets.db')
    user = db.get_user_by_email(data['email'])
    
    if user and check_password_hash(user['password'], data['password']):
        session_id = session_store.create_session(user['id'])
        return f"Login successful:{session_id}:{user['first_name']}", 200
    else:
        return "Invalid email or password", 401
    
@app.route('/sessions', methods=['DELETE'])
def logout():
    auth_header = request.headers.get('Authorization')
    
    if auth_header:
        try:
            token = auth_header.split(" ")[1]
            session_store.delete_session(token)
            return "Session deleted", 200
        except IndexError:
            return "Invalid token format", 400
    else:
        return "No session provided", 400
    
## TIX ENDPOINTS below ##


@app.route('/tickets', methods=['GET'])
def get_tickets():
    db = DB("tickets.db")
    tickets = db.readAllRecords()
    return tickets, 200, {'Access-Control-Allow-Origin':'*'}

@app.route('/tickets', methods=['POST'])
def add_ticket():
    ticket = request.get_json()
    print(ticket)
    db = DB("tickets.db")
    db.saveRecord(ticket)
    return "Created", 201, {'Access-Control-Allow-Origin':'*'}

@app.route('/tickets/<int:id>', methods=['DELETE'])
def delete_ticket(id):
    print('Deleting ticket', id)
    db = DB("tickets.db")
    ticket = db.getRecord(id)
    if ticket:
        db.deleteRecord(id)
        print('here')
        return f"deleted", 200, {'Access-Control-Allow-Origin':'*'}
    else:
        return f"Cannot delete with id of {id}", 404, {'Access-Control-Allow-Origin':'*'}

@app.route('/tickets/<int:id>', methods=['PUT'])
def edit_ticket(id):
    print('Editing ticket')
    db = DB("tickets.db")
    ticket = db.getRecord(id)
    if ticket:
        data = request.get_json()
        db.editRecord(id, data)
        print("ticket successfully updated")
        return 'edited', 200, {'Access-Control-Allow-Origin':'*'}
    else:
        return f"Cannot edit with id of {id}", 404, {'Access-Control-Allow-Origin':'*'}










def main():
    app.run()

main()