from flask import Flask, request
from db import DB

app = Flask(__name__, static_folder='../client', static_url_path='')

@app.route('/projects/<int:id>', methods=['OPTIONS'])
def do_preflight():
    return '', 204, {'Access-Control-Allow-Origin':'*', 
                     'Access-Control-Allow-Methods':'PUT, DELETE',
                     'Access-Contrl-Allow-Headers':'Content-Type'}

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/projects', methods=['GET'])
def get_projects():
    db = DB("projects.db")
    projects = db.readAllRecords()
    return projects, 200, {'Access-Control-Allow-Origin':'*'}

@app.route('/projects', methods=['POST'])
def add_project():
    project = request.get_json()
    print(project)
    db = DB("projects.db")
    db.saveRecord(project)
    return "Created", 201, {'Access-Control-Allow-Origin':'*'}

@app.route('/projects/<int:id>', methods=['DELETE'])
def delete_project(id):
    print('Deleting project', id)
    db = DB("projects.db")
    project = db.getRecord(id)
    if project:
        db.deleteRecord(id)
        print('here')
        return f"deleted", 200, {'Access-Control-Allow-Origin':'*'}
    else:
        return f"Cannot delete with id of {id}", 404, {'Access-Control-Allow-Origin':'*'}

@app.route('/projects/<int:id>', methods=['PUT'])
def edit_project(id):
    print('Editing proj')
    db = DB("projects.db")
    project = db.getRecord(id)
    if project:
        data = request.get_json()
        db.editRecord(id, data)
        print("project successfully updated")
        return 'edited', 200, {'Access-Control-Allow-Origin':'*'}
    else:
        return f"Cannot edit with id of {id}", 404, {'Access-Control-Allow-Origin':'*'}


def main():
    app.run()

main()