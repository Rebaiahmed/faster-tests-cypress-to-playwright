#!/bin/bash

# 📊 Generate Consolidated Test Report
# This script merges all Mochawesome reports and generates a beautiful HTML report

set -e

echo "🎨 Generating Consolidated Test Report..."
echo ""

# Create reports directory
mkdir -p cypress/reports/consolidated

# Check if any JSON reports exist
if ls cypress/reports/mochawesome/*.json 1> /dev/null 2>&1; then
    echo "📋 Found report files. Merging..."
    
    # Merge all JSON reports
    npx mochawesome-merge "cypress/reports/mochawesome/*.json" > cypress/reports/consolidated/merged-report.json
    
    echo "✅ Reports merged successfully!"
    echo ""
    
    # Generate HTML report
    echo "🎨 Generating HTML report..."
    npx mochawesome-report-generator cypress/reports/consolidated/merged-report.json \
        --reportDir cypress/reports/consolidated/html \
        --reportTitle "E2E Test Results - Cypress to Playwright Migration" \
        --reportPageTitle "Test Execution Report" \
        --inline \
        --charts
    
    echo "✅ HTML report generated successfully!"
    echo ""
    echo "📊 Report location: cypress/reports/consolidated/html/index.html"
    echo ""
    
    # Try to open the report in the default browser
    if command -v open &> /dev/null; then
        echo "🌐 Opening report in browser..."
        open cypress/reports/consolidated/html/index.html
    elif command -v xdg-open &> /dev/null; then
        echo "🌐 Opening report in browser..."
        xdg-open cypress/reports/consolidated/html/index.html
    else
        echo "💡 Open the report manually: cypress/reports/consolidated/html/index.html"
    fi
else
    echo "⚠️  No test reports found!"
    echo "💡 Run tests first: npm run test:report"
    exit 1
fi

echo ""
echo "🎉 Done!"
