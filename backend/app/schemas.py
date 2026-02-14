from marshmallow import Schema, fields, validates, ValidationError
from datetime import datetime

class TelemetrySchema(Schema):
    id = fields.UUID(dump_only=True)
    satellite_id = fields.String(required=True, data_key="satelliteId") # change key for json dump to satelliteId
    timestamp = fields.DateTime(required=True, format="iso") # explicitly strict iso 8601
    altitude = fields.Float(required=True)
    velocity = fields.Float(required=True)
    status = fields.String(required=True)

    @validates("altitude")
    def validate_altitude(self, value):
        if value <= 0:
            raise ValidationError("Altitude must be positive")

    @validates("velocity")
    def validate_velocity(self, value):
        if value <= 0:
            raise ValidationError("Velocity must be positive")

    @validates("status")
    def validate_status(self, value):
        if value not in ["healthy", "critical"]:
            raise ValidationError("Status must be 'healthy' or 'critical'")

    @validates("timestamp")
    def validate_timestamp(self, value):
        if value.tzinfo is None:
            raise ValidationError("Timestamp must include timezone (ISO 8601)")