from marshmallow import Schema, fields, validates, ValidationError, post_dump
from datetime import datetime, timezone

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

    @post_dump
    def force_iso_z(self, data, **kwargs):
        """
        Convert timestamp to strict ISO 8601 UTC with Z suffix.
        Marshmallow may have already converted datetime to string,
        so handle both datetime and string types.
        """
        ts = data.get("timestamp")
        if isinstance(ts, datetime):
            ts_utc = ts.astimezone(timezone.utc)
            data["timestamp"] = ts_utc.isoformat(timespec="microseconds").replace("+00:00", "Z")
        elif isinstance(ts, str):
            # parse back and force Z
            try:
                dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                dt_utc = dt.astimezone(timezone.utc)
                data["timestamp"] = dt_utc.isoformat(timespec="microseconds").replace("+00:00", "Z")
            except Exception:
                # fallback: leave as-is
                pass
        return data