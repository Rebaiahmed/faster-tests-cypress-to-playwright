const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx,feature}",
    video: true,
    videosFolder: "cypress/videos",
    screenshotsFolder: "cypress/screenshots",
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      configFile: "cypress-reporter-config.json",
    },
  },
});
