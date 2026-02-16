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
        {"satellite_id": "SAT-ALPHA", "timestamp": datetime.utcnow() - timedelta(hours=29), "altitude": 400, "velocity": 27600, "status": "healthy"},
        {"satellite_id": "SAT-BETA", "timestamp": datetime.utcnow() - timedelta(hours=28), "altitude": 410, "velocity": 27500, "status": "critical"},
        {"satellite_id": "SAT-GAMMA", "timestamp": datetime.utcnow() - timedelta(hours=27), "altitude": 395, "velocity": 27800, "status": "healthy"},
        {"satellite_id": "SAT-DELTA", "timestamp": datetime.utcnow() - timedelta(hours=26), "altitude": 420, "velocity": 27400, "status": "healthy"},
        {"satellite_id": "SAT-EPSILON", "timestamp": datetime.utcnow() - timedelta(hours=25), "altitude": 405, "velocity": 27650, "status": "critical"},
        {"satellite_id": "SAT-ZETA", "timestamp": datetime.utcnow() - timedelta(hours=24), "altitude": 398, "velocity": 27720, "status": "healthy"},
        {"satellite_id": "SAT-ETA", "timestamp": datetime.utcnow() - timedelta(hours=23), "altitude": 415, "velocity": 27380, "status": "critical"},
        {"satellite_id": "SAT-THETA", "timestamp": datetime.utcnow() - timedelta(hours=22), "altitude": 402, "velocity": 27610, "status": "healthy"},
        {"satellite_id": "SAT-IOTA", "timestamp": datetime.utcnow() - timedelta(hours=21), "altitude": 399, "velocity": 27700, "status": "healthy"},
        {"satellite_id": "SAT-KAPPA", "timestamp": datetime.utcnow() - timedelta(hours=20), "altitude": 418, "velocity": 27450, "status": "critical"},
        {"satellite_id": "SAT-LAMBDA", "timestamp": datetime.utcnow() - timedelta(hours=19), "altitude": 407, "velocity": 27680, "status": "healthy"},
        {"satellite_id": "SAT-MU", "timestamp": datetime.utcnow() - timedelta(hours=18), "altitude": 392, "velocity": 27850, "status": "healthy"},
        {"satellite_id": "SAT-NU", "timestamp": datetime.utcnow() - timedelta(hours=17), "altitude": 421, "velocity": 27390, "status": "critical"},
        {"satellite_id": "SAT-XI", "timestamp": datetime.utcnow() - timedelta(hours=16), "altitude": 403, "velocity": 27640, "status": "healthy"},
        {"satellite_id": "SAT-OMICRON", "timestamp": datetime.utcnow() - timedelta(hours=15), "altitude": 396, "velocity": 27790, "status": "healthy"},
        {"satellite_id": "SAT-PI", "timestamp": datetime.utcnow() - timedelta(hours=14), "altitude": 412, "velocity": 27520, "status": "critical"},
        {"satellite_id": "SAT-RHO", "timestamp": datetime.utcnow() - timedelta(hours=13), "altitude": 401, "velocity": 27630, "status": "healthy"},
        {"satellite_id": "SAT-SIGMA", "timestamp": datetime.utcnow() - timedelta(hours=12), "altitude": 419, "velocity": 27410, "status": "critical"},
        {"satellite_id": "SAT-TAU", "timestamp": datetime.utcnow() - timedelta(hours=11), "altitude": 397, "velocity": 27760, "status": "healthy"},
        {"satellite_id": "SAT-UPSILON", "timestamp": datetime.utcnow() - timedelta(hours=10), "altitude": 406, "velocity": 27690, "status": "healthy"},
        {"satellite_id": "SAT-PHI", "timestamp": datetime.utcnow() - timedelta(hours=9), "altitude": 414, "velocity": 27470, "status": "critical"},
        {"satellite_id": "SAT-CHI", "timestamp": datetime.utcnow() - timedelta(hours=8), "altitude": 393, "velocity": 27820, "status": "healthy"},
        {"satellite_id": "SAT-PSI", "timestamp": datetime.utcnow() - timedelta(hours=7), "altitude": 408, "velocity": 27590, "status": "healthy"},
        {"satellite_id": "SAT-OMEGA", "timestamp": datetime.utcnow() - timedelta(hours=6), "altitude": 422, "velocity": 27360, "status": "critical"},
        {"satellite_id": "SAT-A1", "timestamp": datetime.utcnow() - timedelta(hours=5), "altitude": 404, "velocity": 27620, "status": "healthy"},
        {"satellite_id": "SAT-B1", "timestamp": datetime.utcnow() - timedelta(hours=4), "altitude": 399, "velocity": 27740, "status": "critical"},
        {"satellite_id": "SAT-C1", "timestamp": datetime.utcnow() - timedelta(hours=3), "altitude": 417, "velocity": 27480, "status": "healthy"},
        {"satellite_id": "SAT-D1", "timestamp": datetime.utcnow() - timedelta(hours=2), "altitude": 395, "velocity": 27810, "status": "healthy"},
        {"satellite_id": "SAT-E1", "timestamp": datetime.utcnow() - timedelta(hours=1), "altitude": 410, "velocity": 27530, "status": "critical"},
        {"satellite_id": "SAT-F1", "timestamp": datetime.utcnow(), "altitude": 405, "velocity": 27670, "status": "healthy"},
    ]


    for entry in sample_data:
        telemetry = Telemetry(**entry)
        db.session.add(telemetry)

    db.session.commit()
    print("Seeding complete.")
