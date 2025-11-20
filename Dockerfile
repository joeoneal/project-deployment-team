FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir Flask Werkzeug

COPY server/ ./server
COPY client/ ./client

EXPOSE 80

ENV FLASK_APP=server/app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=80

CMD ["flask", "run"]

