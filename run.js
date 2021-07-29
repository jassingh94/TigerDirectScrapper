const scrape = require('./src/scrape')
const puppeteer = require('puppeteer');
const { Command } = require('commander');
const program = new Command();

program
    .requiredOption('-u, --url <url>', 'URL to scrape')
program.parse();
let options = program.opts();
puppeteer.launch()
    .then((browser) => {
        scrape(browser, options.url)
            .then(async (result) => {
                await browser.close();
                console.log(result);
            })
            .catch(async (error) => {
                await browser.close();
                console.error('An error occured while scraping the url provided')
                console.error(error);
            });
    }).catch(console.log)
