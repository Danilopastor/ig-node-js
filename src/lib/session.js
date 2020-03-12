const fs = require('fs');
const devices = require('puppeteer/DeviceDescriptors');
const iPhonex = devices['iPhone X'];
const login = require('./login')
const session = {
    exists : async (instagram) =>{
        console.log('> Checking Session')
        const previousSession = fs.existsSync(instagram.cookiePATH)
            if (previousSession) {
                console.log('> Session Exists')
                await instagram.page.emulate(iPhonex);
            const content = fs.readFileSync(instagram.cookiePATH);
            const cookiesArr = JSON.parse(content);
            if (cookiesArr.length !== 0) {
                for (let cookie of cookiesArr) {
                await instagram.page.setCookie(cookie)
                
                }
            console.log('> Set the Session')
            await instagram.page.waitFor(1000);
            console.log('> Session Loaded')
            await instagram.page.goto(instagram.BASE_URL, { waitUntil: 'networkidle2' });
            }
        }else{
            console.log('Logging In')
            await login.exe(instagram);
        }
    }
}
module.exports = session