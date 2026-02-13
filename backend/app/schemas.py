from marshmallow import Schema, fields, validates, ValidationError
from datetime import datetime

class TelemetrySchema(Schema):
    id = fields.UUID(dump_only=True)
    satelliteId = fields.String(required=True)
    timestamp = fields.DateTime(required=True)
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
