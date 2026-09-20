import json
import os
import sqlite3
from datetime import datetime, timedelta

from prediction import predict_mastitis_risk

DB_PATH = os.path.join(os.path.dirname(__file__), "smartmastitis.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS cows (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cow_id TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                sensor_id TEXT NOT NULL,
                breed TEXT,
                age INTEGER,
                lactation_number INTEGER,
                health_history TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS sensor_readings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cow_id TEXT NOT NULL,
                sensor_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                milk_yield REAL,
                milk_conductivity REAL,
                milk_ph REAL,
                milk_temperature REAL,
                activity INTEGER,
                rumination INTEGER,
                body_temperature REAL,
                farm_temperature REAL,
                humidity REAL,
                somatic_cell_count INTEGER
            )
            """
        )

        reading_columns = {row[1] for row in conn.execute("PRAGMA table_info(sensor_readings)").fetchall()}
        if "milk_ph" not in reading_columns:
            conn.execute("ALTER TABLE sensor_readings ADD COLUMN milk_ph REAL")
        if "somatic_cell_count" not in reading_columns:
            conn.execute("ALTER TABLE sensor_readings ADD COLUMN somatic_cell_count INTEGER")

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cow_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                risk_score REAL,
                risk_category TEXT,
                contributing_factors TEXT,
                recommendation TEXT
            )
            """
        )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cow_id TEXT NOT NULL,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                severity TEXT NOT NULL,
                is_checked INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
            """
        )

        conn.commit()
    finally:
        conn.close()


def seed_demo_data():
    init_db()
    conn = get_connection()
    try:
        cows = [
            {"cow_id": "C001", "name": "Lakshmi", "sensor_id": "S001", "breed": "Holstein Friesian", "age": 4, "lactation_number": 2, "health_history": "Routine monitoring"},
            {"cow_id": "C002", "name": "Ponni", "sensor_id": "S002", "breed": "Holstein Friesian", "age": 5, "lactation_number": 2, "health_history": "Previous mild milk quality fluctuation"},
            {"cow_id": "C003", "name": "Kaveri", "sensor_id": "S003", "breed": "Jersey", "age": 3, "lactation_number": 1, "health_history": "No major issues"},
            {"cow_id": "C004", "name": "Malli", "sensor_id": "S004", "breed": "Crossbreed", "age": 6, "lactation_number": 3, "health_history": "Stress after heavy heat"},
            {"cow_id": "C005", "name": "Selvi", "sensor_id": "S005", "breed": "Gir", "age": 4, "lactation_number": 2, "health_history": "Stable"},
            {"cow_id": "C006", "name": "Kavya", "sensor_id": "S006", "breed": "Jersey", "age": 5, "lactation_number": 3, "health_history": "Recent appetite variation"},
            {"cow_id": "C007", "name": "Meenakshi", "sensor_id": "S007", "breed": "Holstein Friesian", "age": 7, "lactation_number": 4, "health_history": "Low rumination observed"},
            {"cow_id": "C008", "name": "Rani", "sensor_id": "S008", "breed": "Sahiwal", "age": 5, "lactation_number": 2, "health_history": "General health stable"},
            {"cow_id": "C009", "name": "Ganga", "sensor_id": "S009", "breed": "Crossbreed", "age": 4, "lactation_number": 2, "health_history": "Early heat stress"},
            {"cow_id": "C010", "name": "Valli", "sensor_id": "S010", "breed": "Jersey", "age": 6, "lactation_number": 3, "health_history": "No major concerns"},
        ]

        for cow in cows:
            conn.execute(
                """
                INSERT OR IGNORE INTO cows (cow_id, name, sensor_id, breed, age, lactation_number, health_history)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    cow["cow_id"],
                    cow["name"],
                    cow["sensor_id"],
                    cow["breed"],
                    cow["age"],
                    cow["lactation_number"],
                    cow["health_history"],
                ),
            )

        existing = conn.execute("SELECT COUNT(*) as cnt FROM sensor_readings").fetchone()["cnt"]
        if existing == 0:
            base_data = {
                "C001": [10.4, 4.2, 6.7, 38.4, 65, 310, 38.7, 29, 64],
                "C002": [8.2, 6.8, 6.1, 39.6, 45, 180, 39.5, 31, 72],
                "C003": [11.6, 5.0, 6.6, 38.7, 70, 330, 38.9, 28, 68],
                "C004": [9.4, 5.8, 6.4, 39.2, 52, 240, 39.2, 30, 70],
                "C005": [12.1, 4.0, 6.8, 38.6, 68, 340, 38.8, 29, 66],
                "C006": [9.9, 5.6, 6.3, 39.1, 58, 220, 39.1, 32, 71],
                "C007": [8.8, 6.3, 6.2, 39.4, 50, 210, 39.3, 33, 74],
                "C008": [10.8, 4.5, 6.7, 38.9, 62, 300, 39.0, 30, 67],
                "C009": [9.1, 5.7, 6.4, 39.0, 55, 230, 39.1, 32, 70],
                "C010": [11.2, 4.8, 6.6, 38.5, 69, 335, 38.8, 29, 70],
            }

            ssc_values = {
                "C001": 72000, "C002": 520000, "C003": 260000, "C004": 165000,
                "C005": 68000, "C006": 230000, "C007": 430000, "C008": 92000,
                "C009": 185000, "C010": 76000,
            }

            days = [
                (datetime.utcnow() - timedelta(days=6)).strftime("%Y-%m-%d"),
                (datetime.utcnow() - timedelta(days=5)).strftime("%Y-%m-%d"),
                (datetime.utcnow() - timedelta(days=4)).strftime("%Y-%m-%d"),
                (datetime.utcnow() - timedelta(days=3)).strftime("%Y-%m-%d"),
                (datetime.utcnow() - timedelta(days=2)).strftime("%Y-%m-%d"),
                (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d"),
                datetime.utcnow().strftime("%Y-%m-%d"),
            ]

            for cow_id, values in base_data.items():
                sensor_id = conn.execute("SELECT sensor_id FROM cows WHERE cow_id = ?", (cow_id,)).fetchone()["sensor_id"]
                for idx, day in enumerate(days):
                    reading = {
                        "cow_id": cow_id,
                        "sensor_id": sensor_id,
                        "timestamp": day,
                        "milk_yield": round(max(4.0, values[0] - (idx * 0.6)), 2),
                        "milk_conductivity": round(max(3.0, values[1] + (idx * 0.3)), 2),
                        "milk_ph": round(values[2] - (idx * 0.02), 2),
                        "milk_temperature": round(values[3] + (idx * 0.1), 2),
                        "activity": max(30, values[4] - (idx * 4)),
                        "rumination": max(120, values[5] - (idx * 12)),
                        "body_temperature": round(values[6] + (idx * 0.05), 2),
                        "farm_temperature": values[7],
                        "humidity": values[8],
                        "somatic_cell_count": ssc_values[cow_id],
                    }
                    conn.execute(
                        """
                        INSERT INTO sensor_readings (
                            cow_id, sensor_id, timestamp, milk_yield, milk_conductivity,
                            milk_ph, milk_temperature, activity, rumination, body_temperature,
                            farm_temperature, humidity, somatic_cell_count
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            reading["cow_id"],
                            reading["sensor_id"],
                            reading["timestamp"],
                            reading["milk_yield"],
                            reading["milk_conductivity"],
                            reading["milk_ph"],
                            reading["milk_temperature"],
                            reading["activity"],
                            reading["rumination"],
                            reading["body_temperature"],
                            reading["farm_temperature"],
                            reading["humidity"],
                            reading["somatic_cell_count"],
                        ),
                    )

                    prediction = predict_mastitis_risk(
                        reading["milk_yield"],
                        reading["milk_conductivity"],
                        reading["milk_temperature"],
                        reading["activity"],
                        reading["rumination"],
                        reading["body_temperature"],
                        reading["farm_temperature"],
                        reading["humidity"],
                    )
                    conn.execute(
                        """
                        INSERT INTO predictions (cow_id, timestamp, risk_score, risk_category, contributing_factors, recommendation)
                        VALUES (?, ?, ?, ?, ?, ?)
                        """,
                        (
                            cow_id,
                            reading["timestamp"],
                            prediction["risk_score"],
                            prediction["risk_category"],
                            json.dumps(prediction["contributing_factors"]),
                            prediction["recommendation"],
                        ),
                    )

        demo_ph_values = {
            "C001": 6.7, "C002": 6.1, "C003": 6.6, "C004": 6.4, "C005": 6.8,
            "C006": 6.3, "C007": 6.2, "C008": 6.7, "C009": 6.4, "C010": 6.6,
        }
        for cow_id, ph_value in demo_ph_values.items():
            conn.execute(
                "UPDATE sensor_readings SET milk_ph = ? WHERE cow_id = ? AND milk_ph IS NULL",
                (ph_value, cow_id),
            )

        demo_ssc_values = {
            "C001": 72000, "C002": 520000, "C003": 260000, "C004": 165000,
            "C005": 68000, "C006": 230000, "C007": 430000, "C008": 92000,
            "C009": 185000, "C010": 76000,
        }
        for cow_id, ssc_value in demo_ssc_values.items():
            conn.execute(
                "UPDATE sensor_readings SET somatic_cell_count = ? WHERE cow_id = ? AND somatic_cell_count IS NULL",
                (ssc_value, cow_id),
            )

        alerts = [
            ("C002", "HIGH RISK ALERT", "Ponni has elevated conductivity, reduced activity, and a high mastitis risk score.", "HIGH"),
            ("C003", "MODERATE RISK ALERT", "Kaveri requires closer monitoring during this cycle.", "MODERATE"),
            ("C007", "RISK WATCH", "Meenakshi shows reduced rumination and elevated temperature.", "HIGH"),
        ]
        for cow_id, title, message, severity in alerts:
            conn.execute(
                "INSERT OR IGNORE INTO alerts (cow_id, title, message, severity) VALUES (?, ?, ?, ?)",
                (cow_id, title, message, severity),
            )

        conn.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", ("language", "en"))
        conn.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", ("voice_enabled", "true"))
        conn.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", ("auto_read_alerts", "true"))

        conn.commit()
    finally:
        conn.close()


def get_all_cows():
    conn = get_connection()
    try:
        rows = conn.execute("SELECT * FROM cows ORDER BY cow_id").fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def get_cow_by_id(cow_id):
    conn = get_connection()
    try:
        row = conn.execute("SELECT * FROM cows WHERE cow_id = ?", (cow_id,)).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def get_latest_reading(cow_id):
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM sensor_readings WHERE cow_id = ? ORDER BY timestamp DESC, id DESC LIMIT 1",
            (cow_id,),
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def get_latest_prediction(cow_id):
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM predictions WHERE cow_id = ? ORDER BY timestamp DESC LIMIT 1",
            (cow_id,),
        ).fetchone()
        if not row:
            return None
        payload = dict(row)
        payload["contributing_factors"] = json.loads(payload["contributing_factors"] or "[]")
        return payload
    finally:
        conn.close()


def add_cow(payload):
    conn = get_connection()
    try:
        conn.execute(
            """
            INSERT INTO cows (cow_id, name, sensor_id, breed, age, lactation_number, health_history)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload["cow_id"],
                payload["name"],
                payload["sensor_id"],
                payload.get("breed", "Crossbreed"),
                payload.get("age", 3),
                payload.get("lactation_number", 1),
                payload.get("health_history", "Routine monitoring"),
            ),
        )
        conn.commit()
        return get_cow_by_id(payload["cow_id"])
    finally:
        conn.close()


def add_sensor_reading(payload):
    conn = get_connection()
    try:
        timestamp = payload.get("timestamp") or datetime.utcnow().strftime("%Y-%m-%d")
        conn.execute(
            """
            INSERT INTO sensor_readings (
                cow_id, sensor_id, timestamp, milk_yield, milk_conductivity,
                milk_ph, milk_temperature, activity, rumination, body_temperature,
                farm_temperature, humidity, somatic_cell_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload["cow_id"],
                payload["sensor_id"],
                timestamp,
                payload.get("milk_yield"),
                payload.get("milk_conductivity"),
                payload.get("milk_ph"),
                payload.get("milk_temperature"),
                payload.get("activity"),
                payload.get("rumination"),
                payload.get("body_temperature"),
                payload.get("farm_temperature"),
                payload.get("humidity"),
                payload.get("somatic_cell_count"),
            ),
        )
        prediction = predict_mastitis_risk(
            payload.get("milk_yield"),
            payload.get("milk_conductivity"),
            payload.get("milk_temperature"),
            payload.get("activity"),
            payload.get("rumination"),
            payload.get("body_temperature"),
            payload.get("farm_temperature"),
            payload.get("humidity"),
        )
        conn.execute(
            """
            INSERT INTO predictions (cow_id, timestamp, risk_score, risk_category, contributing_factors, recommendation)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                payload["cow_id"],
                timestamp,
                prediction["risk_score"],
                prediction["risk_category"],
                json.dumps(prediction["contributing_factors"]),
                prediction["recommendation"],
            ),
        )
        conn.commit()
        return prediction
    finally:
        conn.close()


def get_sensor_readings(cow_id):
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM sensor_readings WHERE cow_id = ? ORDER BY timestamp DESC, id DESC LIMIT 30",
            (cow_id,),
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def get_alerts():
    conn = get_connection()
    try:
        rows = conn.execute("SELECT * FROM alerts ORDER BY created_at DESC").fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def get_herd_summary():
    conn = get_connection()
    try:
        total = conn.execute("SELECT COUNT(*) as count FROM cows").fetchone()["count"]
        high = conn.execute("SELECT COUNT(*) as count FROM predictions WHERE risk_category = 'HIGH RISK'").fetchone()["count"]
        moderate = conn.execute("SELECT COUNT(*) as count FROM predictions WHERE risk_category = 'MODERATE RISK'").fetchone()["count"]
        low = conn.execute("SELECT COUNT(*) as count FROM predictions WHERE risk_category = 'LOW RISK'").fetchone()["count"]
        no_risk = conn.execute("SELECT COUNT(*) as count FROM predictions WHERE risk_category = 'NO RISK'").fetchone()["count"]
        return {
            "total_cows": total,
            "high_risk": high,
            "moderate_risk": moderate,
            "low_risk": low,
            "no_risk": no_risk,
            "healthy": no_risk + low,
        }
    finally:
        conn.close()


def get_cow_trend(cow_id):
    conn = get_connection()
    try:
        rows = conn.execute(
            """
            SELECT date(timestamp) as day, AVG(risk_score) as avg_risk
            FROM predictions
            WHERE cow_id = ?
            GROUP BY date(timestamp)
            ORDER BY day DESC LIMIT 7
            """,
            (cow_id,),
        ).fetchall()
        trend = []
        for row in rows:
            trend.append({"day": row["day"], "risk": round(float(row["avg_risk"]), 2)})
        trend.reverse()
        return trend
    finally:
        conn.close()


def get_setting(key, default=None):
    conn = get_connection()
    try:
        row = conn.execute("SELECT value FROM settings WHERE key = ?", (key,)).fetchone()
        if row is None:
            return default
        return row["value"]
    finally:
        conn.close()


def set_setting(key, value):
    conn = get_connection()
    try:
        conn.execute(
            "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            (key, value),
        )
        conn.commit()
    finally:
        conn.close()


if __name__ == "__main__":
    seed_demo_data()
    print("Database initialized with sample data.")
