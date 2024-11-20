const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.js",
  },
  env: {
    backend: "http://localhost:3003/api",
  },
});
