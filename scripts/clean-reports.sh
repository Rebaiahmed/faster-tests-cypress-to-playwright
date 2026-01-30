#!/bin/bash

# 🧹 Clean Test Reports and Artifacts
# This script removes all generated test artifacts

echo "🧹 Cleaning test reports and artifacts..."
echo ""

# Remove reports
if [ -d "cypress/reports" ]; then
    echo "📊 Removing test reports..."
    rm -rf cypress/reports
    echo "✅ Reports removed"
fi

# Remove screenshots
if [ -d "cypress/screenshots" ]; then
    echo "📸 Removing screenshots..."
    rm -rf cypress/screenshots
    echo "✅ Screenshots removed"
fi

# Remove videos
if [ -d "cypress/videos" ]; then
    echo "🎥 Removing videos..."
    rm -rf cypress/videos
    echo "✅ Videos removed"
fi

# Recreate directories
echo ""
echo "📁 Recreating clean directories..."
mkdir -p cypress/reports/mochawesome
mkdir -p cypress/screenshots
mkdir -p cypress/videos

echo ""
echo "✨ All clean! Ready for fresh test run."
