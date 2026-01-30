#!/usr/bin/env node
/**
 * Cypress to Playwright Migration Helper
 * Converts Cypress test syntax to Playwright format
 */

const fs = require('fs');
const path = require('path');

function convertCypressToPlaywright(cypressContent, testName) {
  let playwrightContent = cypressContent;

  // Remove Cypress reference
  playwrightContent = playwrightContent.replace(/\/\/\/ <reference types="cypress" \/>\n/g, '');
  playwrightContent = playwrightContent.replace(/\/\/\/ <reference types='cypress' \/>\n/g, '');

  // Convert imports
  playwrightContent = playwrightContent.replace(
    /import\s+(\w+)\s+from\s+['"]\.\.\/pageObjects\/(\w+)\.js['"]/g,
    "const { $1 } = require('../../page-objects/$2');"
  );
  playwrightContent = playwrightContent.replace(
    /import\s+(\w+)\s+from\s+['"]\.\.\/\.\.\/pageObjects\/(\w+)\.js['"]/g,
    "const { $1 } = require('../../page-objects/$2');"
  );
  
  // Add Playwright imports at the top
  if (!playwrightContent.includes("require('@playwright/test')")) {
    playwrightContent = "const { test, expect } = require('@playwright/test');\n" + playwrightContent;
  }

  // Convert describe
  playwrightContent = playwrightContent.replace(/describe\(/g, 'test.describe(');

  // Convert it
  playwrightContent = playwrightContent.replace(/\bit\(/g, 'test(');

  // Convert beforeEach
  playwrightContent = playwrightContent.replace(/beforeEach\(\(\)\s*=>\s*\{/g, 'test.beforeEach(async ({ page }) => {');
  playwrightContent = playwrightContent.replace(/beforeEach\(function\(\)\s*\{/g, 'test.beforeEach(async ({ page }) => {');

  return playwrightContent;
}

// Example usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node migrate-helper.js <cypress-file> <playwright-file>');
    process.exit(1);
  }

  const cypressFile = args[0];
  const playwrightFile = args[1];

  const cypressContent = fs.readFileSync(cypressFile, 'utf8');
  const testName = path.basename(cypressFile, '.js');
  const playwrightContent = convertCypressToPlaywright(cypressContent, testName);

  fs.writeFileSync(playwrightFile, playwrightContent);
  console.log(`✅ Migrated: ${cypressFile} → ${playwrightFile}`);
}

module.exports = { convertCypressToPlaywright };
