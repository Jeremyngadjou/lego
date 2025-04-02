const fetch = require('node-fetch');
const cheerio = require('cheerio');

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