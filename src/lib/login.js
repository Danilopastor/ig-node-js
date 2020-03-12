const fs = require('fs');

const Login = {
    exe : async (instagram)=>{
        await instagram.page.goto(instagram.BASE_URL, { waitUntil: 'networkidle2' });
        await instagram.page.setDefaultNavigationTimeout(0);
        await instagram.page.waitFor('//button[contains(text(),"Log In")]').then(async ()=>{
            let loginButton = await instagram.page.$x('//button[contains(text(),"Log In")]');
            await instagram.page.waitFor(3000);
            await loginButton[0].click();
        }).catch(err => {
            console.log('> passed!')
        });
        
        await instagram.page.waitFor(1000);
        await instagram.page.type('input[name="username"]',instagram.auth.username, { delay: 100 });
        await instagram.page.type('input[name="password"]',instagram.auth.password, { delay: 100 });

        loginButton = await instagram.page.$x('//button[contains(.,"Log In")]');
        await loginButton[0].click();
        
        let saveloginBrowser = await instagram.page.$x('//div[contains(text(),"Save Your Login Info?")]');
        if(saveloginBrowser.length){
            saveloginBrowser = await instagram.page.$x('//button[contains(text(),"Save Info")]');
            await instagram.page.waitFor(1000);
            await saveloginBrowser[0].click();
            console.log('> Clicked Save infos : "Save"');
            await instagram.page.waitFor(1000);
        }
        await instagram.page.waitFor('.logged-in').then(async()=>{
            console.log('> Login Sucess!')
            await instagram.page.waitFor(3000);

            if(instagram.cookiePATH){
            const cookiesObject = await instagram.page.cookies()
            fs.writeFileSync(instagram.cookiePATH, JSON.stringify(cookiesObject));
            console.log('> Session has been saved to ' + instagram.cookiePATH);
            }

        }).catch(err => {
            console.log('> No login!')
        });
    }
}

module.exports = Login