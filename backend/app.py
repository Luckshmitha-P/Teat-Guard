import json
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS

from database import (
    add_cow,
    add_sensor_reading,
    get_alerts,
    get_all_cows,
    get_cow_by_id,
    get_cow_trend,
    get_herd_summary,
    get_latest_prediction,
    get_latest_reading,
    get_sensor_readings,
    get_setting,
    init_db,
    seed_demo_data,
    set_setting,
)
from mastitis_ai import (
    generate_demo_summary,
    get_cow_detail,
    get_herd_summary as get_mastitis_herd_summary,
    get_trend_detail,
    process_uploaded_dataset,
    train_or_simulate_model,
)
from prediction import predict_mastitis_risk

app = Flask(__name__)
CORS(app)

init_db()
seed_demo_data()


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "app": "Smart Mastitis Demo"})


@app.route("/api/cows", methods=["GET"])
def cows():
    cows_list = get_all_cows()
    response = []
    for cow in cows_list:
        latest_prediction = get_latest_prediction(cow["cow_id"])
        latest_reading = get_latest_reading(cow["cow_id"])
        response.append({
            **cow,
            "risk_score": latest_prediction["risk_score"] if latest_prediction else 0,
            "risk_category": latest_prediction["risk_category"] if latest_prediction else "NO RISK",
            "recommendation": latest_prediction["recommendation"] if latest_prediction else "Continue routine monitoring.",
            "last_updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "milk_ph": latest_reading.get("milk_ph") if latest_reading else None,
            "latest_reading": latest_reading or {},
        })
    return jsonify({"cows": response})


@app.route("/api/cows/<cow_id>", methods=["GET"])
def get_single_cow(cow_id):
    cow = get_cow_by_id(cow_id)
    if not cow:
        return jsonify({"error": "Cow not found"}), 404
    latest_prediction = get_latest_prediction(cow_id)
    latest_reading = get_latest_reading(cow_id)
    return jsonify({
        **cow,
        "risk_score": latest_prediction["risk_score"] if latest_prediction else 0,
        "risk_category": latest_prediction["risk_category"] if latest_prediction else "NO RISK",
        "recommendation": latest_prediction["recommendation"] if latest_prediction else "Continue routine monitoring.",
        "contributing_factors": latest_prediction["contributing_factors"] if latest_prediction else [],
        "milk_ph": latest_reading.get("milk_ph") if latest_reading else None,
        "latest_reading": latest_reading or {},
    })


@app.route("/api/cows", methods=["POST"])
def create_cow():
    payload = request.get_json(force=True)
    if not payload or not payload.get("cow_id") or not payload.get("name"):
        return jsonify({"error": "Cow ID and name are required"}), 400

    try:
        cow = add_cow(payload)
        return jsonify({"message": "Cow added successfully", "cow": cow}), 201
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@app.route("/api/cows/<cow_id>/readings", methods=["GET"])
def get_cow_readings(cow_id):
    readings = get_sensor_readings(cow_id)
    return jsonify({"readings": readings})


@app.route("/api/sensor-reading", methods=["POST"])
def sensor_reading():
    payload = request.get_json(force=True)
    required_fields = [
        "cow_id",
        "sensor_id",
        "milk_yield",
        "milk_conductivity",
        "milk_ph",
        "milk_temperature",
        "activity",
        "rumination",
        "body_temperature",
        "farm_temperature",
        "humidity",
        "somatic_cell_count",
    ]
    missing = [field for field in required_fields if field not in payload]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    result = add_sensor_reading(payload)
    result["milk_ph"] = payload.get("milk_ph")
    return jsonify({
        "message": "Demo sensor data processed successfully",
        "result": result,
        "warning": "Demo / Simulated Sensor Data",
    })


@app.route("/api/predict", methods=["POST"])
def predict_endpoint():
    payload = request.get_json(force=True)
    result = predict_mastitis_risk(
        payload.get("milk_yield"),
        payload.get("milk_conductivity"),
        payload.get("milk_temperature"),
        payload.get("activity"),
        payload.get("rumination"),
        payload.get("body_temperature"),
        payload.get("farm_temperature"),
        payload.get("humidity"),
    )
    return jsonify({"result": result})


@app.route("/api/alerts", methods=["GET"])
def alerts():
    return jsonify({"alerts": get_alerts()})


@app.route("/api/herd-summary", methods=["GET"])
def herd_summary():
    return jsonify(get_herd_summary())


@app.route("/api/cows/<cow_id>/trend", methods=["GET"])
def cow_trend(cow_id):
    trend = get_cow_trend(cow_id)
    return jsonify({"trend": trend})


@app.route("/api/settings", methods=["GET"])
def get_settings():
    settings = {
        "language": get_setting("language", "en"),
        "voice_enabled": get_setting("voice_enabled", "true"),
        "auto_read_alerts": get_setting("auto_read_alerts", "true"),
    }
    return jsonify(settings)


@app.route("/api/settings", methods=["POST"])
def save_settings():
    payload = request.get_json(force=True)
    for key, value in payload.items():
        set_setting(key, str(value))
    return jsonify({"message": "Settings saved"})


@app.route("/api/mastitis/demo", methods=["GET"])
def mastitis_demo():
    result = generate_demo_summary()
    return jsonify(result)


@app.route("/api/mastitis/upload-dataset", methods=["POST"])
def upload_dataset():
    if "file" not in request.files:
        return jsonify({"error": "CSV file is required."}), 400

    file_obj = request.files["file"]
    if file_obj.filename == "":
        return jsonify({"error": "No file selected."}), 400

    try:
        result = process_uploaded_dataset(file_obj)
        return jsonify(result)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@app.route("/api/mastitis/train-model", methods=["POST"])
def train_model():
    payload = request.get_json(silent=True) or {}
    try:
        source = payload.get("source") or "demo"
        if source == "demo":
            dataset_result = generate_demo_summary()
        else:
            dataset_result = generate_demo_summary()
        train_info = train_or_simulate_model(dataset_result.get("cows", []))
        return jsonify({
            "message": "Model checked successfully.",
            "model_status": train_info["metadata"]["model_status"],
            "source": source,
            "metadata": train_info["metadata"],
        })
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@app.route("/api/mastitis/predict", methods=["POST"])
def mastitis_predict():
    payload = request.get_json(silent=True) or {}
    if not payload:
        return jsonify({"error": "Prediction payload is required."}), 400

    if payload.get("dataset"):
        try:
            dataframe_like = payload["dataset"]
            if isinstance(dataframe_like, list):
                from pandas import DataFrame
                frame = DataFrame(dataframe_like)
            else:
                frame = None
            result = process_uploaded_dataset(frame)
            return jsonify(result)
        except Exception as exc:
            return jsonify({"error": str(exc)}), 400

    result = generate_demo_summary()
    cow_id = payload.get("cow_id")
    if cow_id:
        selected = [cow for cow in result.get("cows", []) if str(cow.get("cow_id")).upper() == str(cow_id).upper()]
        if selected:
            return jsonify(selected[0])
    return jsonify({"message": "AI demonstration prediction completed.", "result": result})


@app.route("/api/mastitis/herd-summary", methods=["GET"])
def mastitis_herd_summary():
    return jsonify(get_mastitis_herd_summary())


@app.route("/api/mastitis/cow/<cow_id>", methods=["GET"])
def mastitis_cow(cow_id):
    result = get_cow_detail(cow_id)
    if not result:
        return jsonify({"error": "Cow not found in mastitis dataset."}), 404
    return jsonify(result)


@app.route("/api/mastitis/risk-trend/<cow_id>", methods=["GET"])
def mastitis_trend(cow_id):
    trend = get_trend_detail(cow_id)
    if trend is None:
        return jsonify({"trend": []})
    return jsonify({"trend": trend})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
