const puppeteer = require('puppeteer');

async function scrape() {
    let browser;
    try{
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);
        await page.goto('https://www.youtube.com/feed/trending');
        
        const selector = '#meta';
        
        await page.waitForSelector(selector);
        const elements = await page.$$(selector);

        const videos = [];

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const titleElement = await element.$('#video-title');
            const channelElement = await element.$('#channel-name');
            
            const title = titleElement? await titleElement.evaluate(el => el.innerText.trim()) : '';
            const channel = channelElement? await channelElement.evaluate(el => el.innerText.trim()) : '';
        
            videos.push({title, channel});
        }
        console.log(videos)
    } catch(err) {
        console.error('Run Failed' ,err);
    } finally {
        if(browser) {
            await browser.close();
        }
    }  
}

scrape();