// testing scraping the farnell site
// run with: node headless-farnell-test.js

const puppeteer = require('puppeteer')

// This is where we'll put the code to get around the tests.
const preparePageForTests = async page => {
  // below are tricks taken from  https://intoli.com/blog/not-possible-to-block-chrome-headless/

  // Pass the User-Agent Test.
  const userAgent =
    'Mozilla/5.0 (X11; Linux x86_64)' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36'
  await page.setUserAgent(userAgent)

  // below we have tricks that didn't seem to help or be needed

  // Pass the Webdriver Test.
  //await page.evaluateOnNewDocument(() => {
  //  Object.defineProperty(navigator, 'webdriver', {
  //    get: () => false,
  //  });
  //});

  //// Pass the Chrome Test.
  //await page.evaluateOnNewDocument(() => {
  //  // We can mock this in as much depth as we need for the test.
  //  window.navigator.chrome = {
  //    runtime: {},
  //    // etc.
  //  };
  //});

  //// Pass the Permissions Test.
  //await page.evaluateOnNewDocument(() => {
  //  const originalQuery = window.navigator.permissions.query;
  //  return (window.navigator.permissions.query = parameters =>
  //    parameters.name === 'notifications'
  //      ? Promise.resolve({state: Notification.permission})
  //      : originalQuery(parameters));
  //});

  //// Pass the Plugins Length Test.
  //await page.evaluateOnNewDocument(() => {
  //  // Overwrite the `plugins` property to use a custom getter.
  //  Object.defineProperty(navigator, 'plugins', {
  //    // This just needs to have `length > 0` for the current test,
  //    // but we could mock the plugins too if necessary.
  //    get: () => [1, 2, 3, 4, 5],
  //  });
  //});

  // Pass the Languages Test.
  //await page.evaluateOnNewDocument(() => {
  //  // Overwrite the `plugins` property to use a custom getter.
  //  Object.defineProperty(navigator, 'languages', {
  //    get: () => ['en-US', 'en'],
  //  });
  //});
}

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await preparePageForTests(page)

  const part = process.argv[2] || '9589899'
  console.log('scraping part', part)
  const testUrl = `https://uk.farnell.com/${part}`
  await page.goto(testUrl)

  await page.waitForSelector('dd')

  console.log(page.url())
  const headings = await page.$$eval('.availabilitySubHeading', nodes =>
    nodes.map(n => n.innerText),
  )
  const avail = await page.$eval('.availabilityHeading.available', n => n.innerText)
  console.log('stock', parseInt(avail, 10))

  await browser.close()
})()
