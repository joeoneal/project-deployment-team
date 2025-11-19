# Project Pal

Project Pal is a simple project management application. It consists of a Python Flask server that provides a REST API to create, read, update, and delete projects, and a client-side JavaScript application to consume the API.

## Resource: Project

The primary resource for this application is a **Project**.

### Attributes

* **`id`** (Integer): The unique identifier for the project.
* **`name`** (Text): The name or title of the project.
* **`client`** (Text): The name of the client the project is for.
* **`due_date`** (Text): The project's due date, stored as text (e.g., "MM/DD/YYYY").
* **`description`** (Text): A brief description of the project.

## Database Schema

The application uses an SQLite database named `projects.db` with a single table, `projects`.

```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    client TEXT NOT NULL,
    due_date TEXT NOT NULL,
    description TEXT NOT NULL
);
```

## REST Endpoints

| Name | HTTP Method | Path | Description |
| :--- | :--- | :--- | :--- |
| **Get All Projects** | `GET` | `/projects` | Retrieves a JSON list of all projects. |
| **Serve Frontend** | `GET` | `/` | Serves the main `index.html` application. |
| **Add New Project** | `POST` | `/projects` | Creates a new project from a JSON object in the request body. |
| **Edit Project** | `PUT` | `/projects/<id>` | Updates the project matching the specified `id` with data from the JSON request body. |
| **Delete Project** | `DELETE` | `/projects/<id>` | Deletes the project matching the specified `id`. |
| **CORS Preflight** | `OPTIONS`| `/projects/<id>` | Handles CORS preflight requests for `PUT` and `DELETE` methods. |


## Docker Build & Push
docker build -t <dockerhub-username>/project-pal:latest .
docker push <dockerhub-username>/project-pal:latest

## Kubernetes Deployment
kubectl apply -f k8s/deploy.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
