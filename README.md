# 🐳 Flask + Express + Docker

A small containerized full-stack assignment demonstrating how a **Node.js/Express frontend service** can communicate with a **Flask backend service** through **Docker Compose networking**.

## 🎯 Overview

The application has two services:

```text
Browser
   │
   │ http://localhost:3000
   ▼
Express Frontend
   │
   │ HTTP request to http://backend:5000/submit
   ▼
Flask Backend
   │
   └── Returns JSON response
```

The project demonstrates:

- Flask REST-style endpoint creation
- Express form handling
- Axios-based service-to-service communication
- Docker image creation
- Docker Compose multi-container orchestration
- Container-to-container DNS/service discovery

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Backend | Python + Flask |
| Frontend service | Node.js + Express |
| HTTP client | Axios |
| Backend container | Python 3.10 |
| Frontend container | Node.js 18 |
| Containerization | Docker |
| Orchestration | Docker Compose |

## 📁 Project Structure

```text
flask-express-docker/
├── backend/
│   ├── Dockerfile
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🔌 Backend — Flask

The Flask service runs on port **5000** and exposes one endpoint:

| Method | Route | Purpose |
|---|---|---|
| POST | `/submit` | Receives `name` and `email` JSON data and returns a JSON confirmation |

Example request:

```json
{
  "name": "Harshit Garg",
  "email": "harshit@example.com"
}
```

Example response:

```json
{
  "message": "Data received successfully",
  "name": "Harshit Garg",
  "email": "harshit@example.com"
}
```

The Flask application binds to `0.0.0.0:5000`, allowing it to accept requests from other containers.

## 🌐 Frontend — Express

The Express service runs on port **3000**.

### GET `/`

Displays a small HTML form with required:

- Name
- Email

### POST `/submit`

When the form is submitted, Express forwards the request to:

```text
http://backend:5000/submit
```

`backend` is not `localhost`; it is the Docker Compose **service name**. Docker's internal network resolves `backend` to the Flask container.

The response returned by Flask is then sent back to the browser.

## 🐳 Docker Configuration

### Backend Dockerfile

The backend image uses Python 3.10:

```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app.py .
CMD ["python", "app.py"]
```

### Frontend Dockerfile

The frontend image uses Node.js 18:

```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY server.js .
CMD ["node", "server.js"]
```

## 🔗 Docker Compose Architecture

`docker-compose.yml` defines two services:

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

### Service communication

| Service | Container Port | Host Port |
|---|---:|---:|
| backend | 5000 | 5000 |
| frontend | 3000 | 3000 |

From your browser:

```text
http://localhost:3000
```

From the frontend container:

```text
http://backend:5000/submit
```

## 🚀 Run with Docker Compose

### Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose

From the repository root:

```bash
docker compose up --build
```

On older Docker installations, the equivalent command may be:

```bash
docker-compose up --build
```

Then open:

```text
http://localhost:3000
```

Submit the form and the request should travel:

```text
Browser → Express → Flask → Express → Browser
```

### Stop the application

```bash
docker compose down
```

## ▶️ Run Without Docker

### Start the Flask backend

Create/activate a Python environment and install Flask:

```bash
cd backend
python -m pip install -r requirements.txt
python app.py
```

The backend will run at:

```text
http://localhost:5000
```

### Start the Express frontend

In another terminal:

```bash
cd frontend
npm install
node server.js
```

The Express service listens on:

```text
http://localhost:3000
```

### Local networking note

When running outside Docker, the frontend currently calls `http://backend:5000/submit`, which depends on Docker's service-name DNS.

For a non-containerized run, change the Axios target to:

```text
http://localhost:5000/submit
```

Alternatively, make the backend URL configurable through an environment variable so the same code works in both environments.

## 🧪 API Test

Once the Flask backend is running, you can test it directly:

```bash
curl -X POST http://localhost:5000/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Harshit Garg","email":"harshit@example.com"}'
```

Expected response:

```json
{
  "message": "Data received successfully",
  "name": "Harshit Garg",
  "email": "harshit@example.com"
}
```

## 🔄 Request Flow

1. User opens the Express frontend on port 3000.
2. Express renders the HTML form.
3. User submits a name and email.
4. Express parses the form body.
5. Axios sends the data to the Flask container.
6. Flask reads `request.json`.
7. Flask returns a JSON confirmation.
8. Express forwards the response to the browser.

## ⚠️ Current Limitations

This is a learning/demo application rather than a production service.

- The frontend URL for the Flask service is hard-coded.
- There is no persistent database.
- There is no authentication or authorization.
- Server-side email validation is minimal.
- Flask is run directly with the development server.
- Express returns a simple string when backend communication fails.
- `depends_on` controls startup ordering but does not guarantee the backend is ready to serve requests.
- Docker images do not pin dependency versions beyond the major runtime versions.

## 🔐 Production Improvements

For a production-style implementation, consider:

- Use environment variables for service URLs.
- Add health checks to Docker Compose.
- Add retry logic when the frontend starts before the backend is ready.
- Add structured error responses.
- Validate request payloads on the Flask side.
- Add centralized logging.
- Run Flask behind a production WSGI server such as Gunicorn.
- Add security headers and HTTPS at the edge.
- Pin Python and Node dependencies.
- Add automated tests and CI.

## 📚 Learning Outcomes

This project demonstrates practical DevOps and backend concepts:

- Microservice-style service separation
- REST endpoint basics
- HTTP request forwarding
- Docker image construction
- Docker Compose orchestration
- Internal Docker networking
- Port mapping
- Service discovery by container name
- Environment-aware application configuration

## 📄 License

No `LICENSE` file is currently present in the repository, so no formal open-source license should be assumed.

## 👨‍💻 Author

**Harshit Garg**

GitHub: [@Harshit765G4](https://github.com/Harshit765G4)

---

🐳 A compact Docker assignment demonstrating Flask ↔ Express communication in a multi-container application.