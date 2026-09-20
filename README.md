# Smart Mastitis

Smart Mastitis is a full-stack college prototype for AI-based early mastitis risk prediction and cow health monitoring for Indian dairy farms.

## Overview

This project demonstrates an offline-first architecture:

- ESP32 / smart collar sensors
- Raspberry Pi local edge processing
- Flask backend with SQLite
- AI prediction engine in Python
- React dashboard for farmers
- multilingual support for English, Tamil, Hindi, and Malayalam
- voice playback and optional browser speech recognition

## Important

- This is a prototype for academic demonstration only.
- This does not provide a confirmed medical diagnosis.
- AI predictions are explainable prototype scores, not clinically validated outcomes.
- Recommendations are monitoring and prevention oriented.

## Local architecture

- Sensors -> ESP32 gateway -> Raspberry Pi -> Flask API -> SQLite -> React app
- Prediction logic runs locally; internet is not required for the main workflow
- Internet may later enable cloud sync, SMS, remote analysis, and model updates

## Project structure

```text
SmartMastitis/
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── prediction.py
│   ├── requirements.txt
│   └── smartmastitis.db
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── data/
│   │   └── translations/
│   └── public/
├── README.md
└── .gitignore
```

## Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

## Default URLs

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## API endpoints

- GET /api/health
- GET /api/cows
- GET /api/cows/<cow_id>
- POST /api/cows
- GET /api/cows/<cow_id>/readings
- POST /api/sensor-reading
- POST /api/predict
- GET /api/alerts
- GET /api/herd-summary
- GET /api/cows/<cow_id>/trend
- GET /api/settings
- POST /api/settings

## Demo data

The database includes 10 sample cows and simulated sensor readings with mixed risk levels.

## Voice support

The UI uses browser Speech Synthesis and optional Speech Recognition.

## Future ESP32 integration

The backend accepts sensor JSON in this shape:

```json
{
  "cow_id": "C002",
  "sensor_id": "S002",
  "milk_yield": 8.2,
  "milk_conductivity": 6.8,
  "milk_temperature": 39.6,
  "activity": 45,
  "rumination": 55,
  "body_temperature": 39.5,
  "farm_temperature": 31,
  "humidity": 72
}
```

## AI model future upgrade

The prediction module is structured so a trained scikit-learn model can replace the demo logic without changing the backend API contract.

## College review demo flow

1. Open the dashboard.
2. View summary cards and alerts.
3. Open a cow profile.
4. Use the sensor simulator.
5. Trigger a prediction and explain factors.
6. Use language switching and voice playback.
7. Show mobile responsiveness.

## Notes

This project is a prototype for demonstration and educational use.
