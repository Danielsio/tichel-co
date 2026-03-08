#!/usr/bin/env bash
#
# Sets up Google Cloud Monitoring uptime checks for tichel-co.
#
# Prerequisites:
#   - gcloud CLI authenticated with the tichel-co project
#   - Monitoring API enabled: gcloud services enable monitoring.googleapis.com --project=tichel-co
#
# Usage:
#   bash scripts/setup-uptime-monitoring.sh

set -euo pipefail

PROJECT="tichel-co"
SITE="tichel-co--tichel-co.europe-west4.hosted.app"

echo "==> Enabling Monitoring API..."
gcloud services enable monitoring.googleapis.com --project="$PROJECT" 2>/dev/null || true

echo ""
echo "==> Creating uptime check: Health Endpoint"
gcloud monitoring uptime create "tichel-co-health" \
  --project="$PROJECT" \
  --display-name="Tichel Co — Health Endpoint" \
  --resource-type="uptime-url" \
  --hostname="$SITE" \
  --path="/api/health" \
  --protocol="https" \
  --period=5 \
  --timeout=15 \
  --matcher-content="healthy" \
  --matcher-type="CONTAINS_STRING" 2>/dev/null && echo "  ✓ Created" || echo "  ⚠ May already exist"

echo ""
echo "==> Creating uptime check: Homepage"
gcloud monitoring uptime create "tichel-co-homepage" \
  --project="$PROJECT" \
  --display-name="Tichel Co — Homepage" \
  --resource-type="uptime-url" \
  --hostname="$SITE" \
  --path="/he" \
  --protocol="https" \
  --period=5 \
  --timeout=15 2>/dev/null && echo "  ✓ Created" || echo "  ⚠ May already exist"

echo ""
echo "==> Done!"
echo ""
echo "Next steps:"
echo "  1. Go to https://console.cloud.google.com/monitoring/uptime?project=$PROJECT"
echo "  2. Click on each check and add a Notification Channel (email, Slack, etc.)"
echo "  3. Recommended: create an alert policy that notifies on 2+ consecutive failures"
echo ""
echo "The checks will run every 5 minutes from multiple global locations."
echo "If the site is down, you'll see it within 5-10 minutes."
