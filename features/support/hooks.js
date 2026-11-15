const { After, AfterAll, Before, BeforeAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4300';
let browser;

setDefaultTimeout(10_000);

BeforeAll(async function () {
  browser = await chromium.launch({ headless: true });
});

Before(async function () {
  this.baseUrl = baseUrl;
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});
