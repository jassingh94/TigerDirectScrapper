/**
 * Scrape, internall scraps through the page once loaded and extract review related info
 * @param {*} browser 
 * @param {*} url 
 * @returns Promise
 */
function scrape(browser, url) {
    console.log("Scraping request recieved")
    return new Promise(async (resolve, reject) => {
        try {
            // open new page
            const page = await browser.newPage();
            //final list of all pages
            let allReviews = [];
            let currentPageNext = null;
            //flag to specify if there is any next page
            let nextPage = true;
            try {
                //navigate to url
                await page.goto(url);
            } catch (error) {
                return reject(error)
            }
            //mask consoles if needed
            page.on('console', (msg) => msg && msg instanceof Object && msg.log && console.log(msg.log));

            try {
                //wait for required selector
                await page.waitForSelector(".responsive-tabs")
            } catch (error) {
                //if not available invalid page
                if (error && error instanceof Object && error.name === "TimeoutError")
                    return reject("Invalid item page, please submit request for an item page")
                else
                    return reject(error)
            }



            do {
                currentPageNext = null;
                //gets reviews on current page
                let urls = await getReviews(page);
                //concat
                allReviews = allReviews.concat(urls);
                //identify if next page
                currentPageNext = await page.$$(".reviewPage>dd>a[title='Next']");
                if (currentPageNext
                    && currentPageNext instanceof Array
                    && currentPageNext.length) {
                    let nextPageSelector = ".reviewPage>dd>a[title='Next']"
                    console.log(`Read length ${allReviews.length} in current page`)
                    await page.evaluate(selector => {
                        return document.querySelector(selector).click();
                    }, nextPageSelector)
                    await page.waitForNavigation();
                }
                else {
                    // no next page
                    nextPage = false;
                }
                //loop while there is a next page
            } while (nextPage)

            //return all reviews
            return resolve(allReviews);

        } catch (e) {
            return reject(e);
        }
    })
}


/**
 * Gets review on current page
 * @param {*} page 
 * @returns 
 */
function getReviews(page) {
    return page.evaluate(() => {

        let reviews = []

        //get required selector
        let reviewsInCurrentPage = $('#customerReviews>.review')

        //per review extract
        reviewsInCurrentPage.each(function () {
            let userDetails = {};
            let reviewDetails = {};

            //user and date info
            let userInfo = $('.leftCol>.reviewer', this)

            // get rating element
            let ratingEle = $('.leftCol>.itemReview', this)
            let rating = ratingEle.find('.itemRating')

            // get comment element
            let commentEle = $('.rightCol', this)

            // set comment
            if (commentEle && commentEle instanceof Object && commentEle.length)
                reviewDetails['Review Comment'] = commentEle.text()


            //set rating
            if (rating && rating instanceof Object && rating.length) {
                reviewDetails['Rating'] = rating.text();
            }

            // for user info identify that the structure is correct
            if (userInfo && userInfo instanceof Object && userInfo.children() && userInfo.children().length) {

                let userIndex = null;
                let dateIndex = null;
                //this gets headings only
                userInfo.find('dt').each((index, ele) => {

                    if (ele && ele instanceof Object) {
                        if (!ele.textContent)
                            return null;
                        if (ele.textContent.indexOf('Reviewer'))
                            userIndex = index;
                        else if (ele.textContent.indexOf('Date'))
                            dateIndex = index
                    }
                })

                //extracting data based on header indexes
                let userData = userInfo.find('dd')

                if (userIndex !== null && userData[userIndex] && userData[userIndex] instanceof Object)
                    userDetails['Reviewer Name'] = userData[userIndex].textContent;
                if (dateIndex !== null && userData[dateIndex] && userData[dateIndex] instanceof Object)
                    userDetails['Review Date'] = userData[dateIndex].textContent;


            }

            //add review to list
            reviews.push({ ...userDetails, ...reviewDetails })
        })
        return reviews;
    })
}

module.exports = scrape