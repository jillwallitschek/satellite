from datetime import datetime, timedelta
from .models import Telemetry
from . import db


def seed_data():
    # Prevent duplicate seeding
    if Telemetry.query.first():
        print("Database already seeded.")
        return

    print("Seeding database...")

    sample_data = [
        {
            "satellite_id": "SAT-ALPHA",
            "timestamp": datetime.utcnow() - timedelta(hours=3),
            "altitude": 400,
            "velocity": 27600,
            "status": "healthy",
        },
        {
            "satellite_id": "SAT-BETA",
            "timestamp": datetime.utcnow() - timedelta(hours=2),
            "altitude": 410,
            "velocity": 27500,
            "status": "critical",
        },
        {
            "satellite_id": "SAT-GAMMA",
            "timestamp": datetime.utcnow() - timedelta(hours=1),
            "altitude": 395,
            "velocity": 27800,
            "status": "healthy",
        },
        {
            "satellite_id": "SAT-DELTA",
            "timestamp": datetime.utcnow(),
            "altitude": 420,
            "velocity": 27400,
            "status": "healthy",
        },
    ]

    for entry in sample_data:
        telemetry = Telemetry(**entry)
        db.session.add(telemetry)

    db.session.commit()
    print("Seeding complete.")
