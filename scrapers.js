
//Node requires two programs in order for me to scrap the ASA rulings and save them to a file.
//Puppeteer is basically a Chrome web browser. FS is file system, and allows me to take the data and save it.
const puppeteer = require('puppeteer');
const fs = require('fs');

//Here are all the steps for scraping ASA data. 'url' is a variable to represent the ASA
//web address in. That url is at the bottom of this document.
async function scrapeRulings(url) {
  //start the browser
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(url);

  //select the year and type of media I want to filter on. Here I want the social media rulings for 2020.
  const YEAR_DROPDOWN = '#ninja_forms_field_190';
  const MEDIA_SELECTOR = '#ninja_forms_field_192_6';
  const BUTTON_SELECTOR = '#ninja_forms_field_196';

  await page.select(YEAR_DROPDOWN,'2020');
  await page.click(MEDIA_SELECTOR);
  await page.click(BUTTON_SELECTOR);

  //Wait 10 seconds so that the page loads all the rulings
  await page.waitFor(10000);

  //Now that the rulings are on the page, pick all the HTML pieces that are h3's with the class="entry-tile"
  //Please 'export' the title of the ruling the the URL for the ruling's PDF.
  const rulings = await page.evaluate(() => {
      let data = []
      const titles = document.querySelectorAll('h3.entry-title');
      for (const i of titles) {
        data.push({
          'title': i.innerText,
           'url': i.querySelector('a').href
        })
      }
      return data;
    });

    //Show me in my Mac terminal what data is being pulled
    console.log(rulings);

    //close the browser
    await browser.close();

    //take the data we scraped and save it in JSON file.
    fs.writeFile(
      './rulings.json',
      JSON.stringify(rulings),
      (err) => err ? console.error('Data not written!', err) : console.log('Data written!')
    );
}

scrapeRulings('https://www.asa.co.nz/decisions/search-browse-decisions/');
