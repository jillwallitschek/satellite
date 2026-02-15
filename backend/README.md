# Backend

This is is a flask using with a postgres database.

## Setup Instructions

1. If doing a lot of backend development, open `backend` dir as root directory
1. run `python3 -m venv venv`
1. run `source venv/bin/activate`
1. run `pip install -r requirements.txt`

## Serve/Demo Instructions

See the root directory README.md. This project is mean to be run with docker-compose.

## Debugging tips

To manually enter/query the database run `docker compose exec postgres psql -U postgres -d telemetry`

To delete the database volume run `docker volume rm satellite_postgres_data`

## Architecture

```text
backend/
│
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── routes.py
│   ├── schemas.py
│   └── config.py
│
├── requirements.txt
├── run.py
├── Dockerfile
└── .dockerignore
```
