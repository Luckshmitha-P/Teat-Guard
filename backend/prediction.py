from __future__ import annotations

from typing import Dict, List, Tuple

RISK_THRESHOLDS = {
    "NO_RISK": 19,
    "LOW_RISK": 39,
    "MODERATE_RISK": 69,
}


def classify_risk(score: float) -> str:
    if score <= RISK_THRESHOLDS["NO_RISK"]:
        return "NO RISK"
    if score <= RISK_THRESHOLDS["LOW_RISK"]:
        return "LOW RISK"
    if score <= RISK_THRESHOLDS["MODERATE_RISK"]:
        return "MODERATE RISK"
    return "HIGH RISK"


def _normalize(value: float, low: float, high: float) -> float:
    if high == low:
        return 0.0
    return max(0.0, min(1.0, (value - low) / (high - low)))


def predict_mastitis_risk(
    milk_yield,
    milk_conductivity,
    milk_temperature,
    activity,
    rumination,
    body_temperature,
    farm_temperature,
    humidity,
):
    """Prototype transparent risk model for early mastitis monitoring.

    This is intentionally explainable and deliberately not presented as a clinical
    diagnosis. It is structured to allow a trained scikit-learn model to replace
    this logic later without changing the public contract.
    """
    score = 0.0
    factors: List[Dict[str, object]] = []

    if milk_conductivity > 6.0:
        score += 24
        factors.append({
            "label": "Milk conductivity",
            "detail": "Elevated conductivity suggests abnormal milk conditions.",
            "impact": "high",
        })

    if milk_yield < 9.0:
        score += 18
        factors.append({
            "label": "Milk yield",
            "detail": "Milk yield is lower than expected.",
            "impact": "medium",
        })

    if milk_temperature > 39.0:
        score += 15
        factors.append({
            "label": "Milk temperature",
            "detail": "Milk temperature is elevated.",
            "impact": "medium",
        })

    if activity < 50:
        score += 14
        factors.append({
            "label": "Activity",
            "detail": "Activity is reduced relative to normal behaviour.",
            "impact": "medium",
        })

    if rumination < 260:
        score += 14
        factors.append({
            "label": "Rumination",
            "detail": "Rumination is reduced, which can reflect stress or discomfort.",
            "impact": "medium",
        })

    if body_temperature > 39.0:
        score += 17
        factors.append({
            "label": "Body temperature",
            "detail": "Body temperature is above the expected range.",
            "impact": "high",
        })

    if farm_temperature > 32:
        score += 8
        factors.append({
            "label": "Farm temperature",
            "detail": "Environmental heat may contribute to stress and elevated risk.",
            "impact": "low",
        })

    if humidity > 78:
        score += 7
        factors.append({
            "label": "Humidity",
            "detail": "High humidity can create a less comfortable shed environment.",
            "impact": "low",
        })

    score = max(0.0, min(100.0, score))
    risk_category = classify_risk(score)

    if risk_category == "NO RISK":
        recommendation = "Continue routine monitoring."
    elif risk_category == "LOW RISK":
        recommendation = "Continue regular monitoring of milk and animal activity."
    elif risk_category == "MODERATE RISK":
        recommendation = "Monitor the cow closely and review the observed changes with appropriate veterinary guidance."
    else:
        recommendation = "Attention required. Review the abnormal indicators and seek appropriate veterinary evaluation."

    # Keep a clean API for future ML replacement.
    return {
        "risk_score": round(score, 2),
        "risk_category": risk_category,
        "contributing_factors": factors,
        "recommendation": recommendation,
    }
