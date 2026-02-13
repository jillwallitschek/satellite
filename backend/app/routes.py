from flask import Blueprint, request, jsonify
from .models import Telemetry
from .schemas import TelemetrySchema
from . import db
from sqlalchemy import desc

telemetry_bp = Blueprint("telemetry", __name__, url_prefix="/telemetry")

schema = TelemetrySchema()
many_schema = TelemetrySchema(many=True)


@telemetry_bp.route("", methods=["GET"])
def get_telemetry():
    query = Telemetry.query

    satellite_id = request.args.get("satelliteId")
    status = request.args.get("status")
    page = request.args.get("page", type=int)
    limit = request.args.get("limit", type=int)

    if satellite_id:
        query = query.filter_by(satellite_id=satellite_id)

    if status:
        query = query.filter_by(status=status)

    query = query.order_by(desc(Telemetry.timestamp))

    if page and limit:
        paginated = query.paginate(page=page, per_page=limit)
        return jsonify({
            "items": many_schema.dump(paginated.items),
            "total": paginated.total,
            "page": paginated.page,
            "pages": paginated.pages
        })

    return jsonify(many_schema.dump(query.all()))


@telemetry_bp.route("", methods=["POST"])
def add_telemetry():
    data = request.get_json()

    errors = schema.validate(data)
    if errors:
        return jsonify(errors), 400

    telemetry = Telemetry(
        satellite_id=data["satelliteId"],
        timestamp=data["timestamp"],
        altitude=data["altitude"],
        velocity=data["velocity"],
        status=data["status"],
    )

    db.session.add(telemetry)
    db.session.commit()

    return schema.dump(telemetry), 201


@telemetry_bp.route("/<uuid:id>", methods=["GET"])
def get_telemetry_by_id(id):
    telemetry = Telemetry.query.get_or_404(id)
    return schema.dump(telemetry)


@telemetry_bp.route("/<uuid:id>", methods=["DELETE"])
def delete_telemetry(id):
    telemetry = Telemetry.query.get_or_404(id)
    db.session.delete(telemetry)
    db.session.commit()
    return "", 204
