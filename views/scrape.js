const puppeteer = require('puppeteer');
var express = require('express');
const scrape = require('..//src/scrape')

module.exports.register = (app) => {
    
    app.use(express.json());

    app.post('/scrape', (req, res) => {
        // launch scraper
        puppeteer.launch()
            .then((browser) => {
                scrape(browser, req.body.url)
                    .then(async (result) => {
                        //return result
                        await browser.close();
                        return res.json(result)
                    })
                    .catch(async (error) => {
                        //return err
                        await browser.close();
                        console.error('An error occured while scraping the url provided')
                        res.status(500).send({ error });
                    });
            }).catch(err => {
                //return err
                res.status(500).send(err);
            })
    })

    return app;
}