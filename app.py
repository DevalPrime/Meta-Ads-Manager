from flask import Flask, jsonify, request
from flask_cors import CORS

from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.campaign import Campaign
from facebook_business.adobjects.adset import AdSet

app = Flask(__name__)
CORS(app)

# ---- Meta setup ----
FacebookAdsApi.init(
    app_id="YOUR_APP_ID",
    app_secret="YOUR_APP_SECRET",
    access_token="YOUR_ACCESS_TOKEN"
)

AD_ACCOUNT_ID = "YOUR_ACCOUNT_ID"
account = AdAccount(f"act_{AD_ACCOUNT_ID}")

# ---- Helpers ----
def fetch_campaigns():
    return [
        {
            "id": c["id"],
            "name": c["name"],
            "status": c["status"]
        }
        for c in account.get_campaigns(fields=["id", "name", "status"])
    ]

def fetch_adsets():
    adsets = account.get_ad_sets(
        fields=[
            "id",
            "name",
            "status",
            "campaign_id",
            "daily_budget",
            "lifetime_budget",
            "budget_remaining"
        ]
    )

    return [
        {
            "id": a["id"],
            "name": a["name"],
            "status": a["status"],
            "campaign_id": a["campaign_id"],
            "daily_budget": int(a.get("daily_budget", 0)) / 100,
            "lifetime_budget": int(a.get("lifetime_budget", 0)) / 100,
            "budget_remaining": int(a.get("budget_remaining", 0)) / 100
        }
        for a in adsets
    ]

def extract_metric(items, action_type):
    if not items:
        return 0
    for item in items:
        if item.get("action_type") == action_type:
            return float(item.get("value", 0))
    return 0

def fetch_adset_insights():
    insights = account.get_insights(
        fields=[
            "adset_id",
            "spend",
            "actions",
            "action_values",
            "purchase_roas"
        ],
        params={
            "level": "adset",
            "date_preset": "today"
        }
    )

    results = []

    for row in insights:
        spend = float(row.get("spend", 0))
        purchases = extract_metric(row.get("actions"), "purchase")
        revenue = extract_metric(row.get("action_values"), "purchase")

        roas = 0
        if spend > 0:
            roas = revenue / spend

        results.append({
            "adset_id": row.get("adset_id"),
            "spend": round(spend, 2),
            "purchases": int(purchases),
            "revenue": round(revenue, 2),
            "roas": round(roas, 2),
        })

    return results

# ---- API Endpoints ----
@app.route("/campaigns")
def get_campaigns():
    return jsonify(fetch_campaigns())

@app.route("/adsets")
def get_adsets():
    return jsonify(fetch_adsets())

@app.route("/adsets/insights", methods=["GET"])
def get_adset_insights():
    return jsonify(fetch_adset_insights())

@app.route("/campaigns/<id>/pause", methods=["POST"])
def pause_campaign(id):
    Campaign(id).api_update(params={"status": "PAUSED"})
    return jsonify({"success": True})

@app.route("/campaigns/<id>/resume", methods=["POST"])
def resume_campaign(id):
    Campaign(id).api_update(params={"status": "ACTIVE"})
    return jsonify({"success": True})

@app.route("/adsets/<id>/pause", methods=["POST"])
def pause_adset(id):
    AdSet(id).api_update(params={"status": "PAUSED"})
    return jsonify({"success": True})

@app.route("/adsets/<id>/resume", methods=["POST"])
def resume_adset(id):
    AdSet(id).api_update(params={"status": "ACTIVE"})
    return jsonify({"success": True})

@app.route("/campaigns/<cid>/status", methods=["POST"])
def update_campaign_status(cid):
    data = request.json
    Campaign(cid).api_update(params={"status": data["status"]})
    return jsonify({"ok": True})

@app.route("/adsets/<aid>/status", methods=["POST"])
def update_adset_status(aid):
    data = request.json
    AdSet(aid).api_update(params={"status": data["status"]})
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(debug=True)
