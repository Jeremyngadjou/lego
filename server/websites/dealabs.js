const fetch = require('node-fetch');
const cheerio = require('cheerio');

const puppeteer = require('puppeteer');

module.exports.scrape = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  );

  await page.goto(url, { waitUntil: 'load', timeout: 0 });

  const content = await page.content(); // Récupère le HTML rendu
  await browser.close();

  return parse(content);
};



/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} deal
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('div.content-list article')
    .map((i, element) => {
      /*const price = parseFloat(
        $(element)
          .find('span.prodl-prix span')
          .text()
      );
*/
      const discount = Math.abs(parseInt(
        $(element)
          .find('textBadge--green')
          .text()
      ));

      const title = $(element)
      .find("strong.thread-title a").attr(title);

      /*const image = $(element).find("span.imgFrame imgFrame--noBorder imgFrame--darken-new")
      .find('img')
      .attr('src');

      const ref = $(element)
      .find('span.prodl-ref')
      .text();
*/

      return {
        discount,
       // price,
       // image,
        //ref,
        title,
      };
    })
    .get();
};

/**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @returns 
 */
module.exports.scrape = async url => {
  const response = await fetch(url);

  if (response.ok) {
    const body = await response.text();

    return parse(body);
  }

  console.error(response);

  return null;
};