import uuid
from datetime import datetime
from . import db

# schema public
class Telemetry(db.Model):
    __tablename__ = "telemetry"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    satellite_id = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    altitude = db.Column(db.Float, nullable=False)
    velocity = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
