const puppetter = require('puppeteer');
const path = require('path');
const session = require('./session');
const BASE_URL = 'https://instagram.com/';
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`;
const BIO_URL = (bio) => `https://www.instagram.com/${bio}`;

let instagram = {
    cookiePATH: null,
    BASE_URL,
    auth: null,
    browser: null,
    page: null,

    initialize: async (params) => {
        instagram.browser = await puppetter.launch({
            headless : false,
            args: ['--window-size=376,813','--lang=en'],
        });
        instagram.auth = params.auth
        instagram.cookiePATH = (instagram.auth.session ) ? path.resolve(instagram.auth.session,`${params.auth.username}.txt`) : null;

        instagram.page = await instagram.browser.newPage();
        await instagram.page.setDefaultNavigationTimeout(0);

        await session.exists(instagram);

        await instagram.page.waitFor(5000);
        let modalnotify = await instagram.page.$x('//h2[contains(text(),"Add Instagram to your Home screen?")]');
        if(modalnotify.length){
            modalnotify = await instagram.page.$x('//button[contains(text(),"Cancel")]');
            await instagram.page.waitFor(1000);
            await modalnotify[0].click();
            console.log('> Clicked Modal : " Cancel "');
            await instagram.page.waitFor(1000);
        }
        console.log('> Wait User Actions...');

    },
    likeTagsProcess: async (tags = [],limit, coment = null) => {

        console.log('> Searching for tags...');
        for(let tag of tags){
            await instagram.page.goto(TAG_URL(tag),{ waitUntil: 'networkidle2' });
            console.log(`> Fetching tag ${tag}`);
            await instagram.page.waitFor(1000);
            let posts = await instagram.page.$$('article > div:nth-child(3) img[decoding="auto"]');
            let links = await instagram.page.$$eval('article > div:nth-child(3) a', elements=> elements.map(item=>item.getAttribute('href')) )

            for(let i = 0; i < limit; i++){
                let post = posts[i];
                let POST_URL = BASE_URL.substr(0,BASE_URL.length -1) + links[i]
                await instagram.page.goto(`${POST_URL}`,{ waitUntil: 'networkidle2' });
                await instagram.page.waitFor(3000);
                await instagram.page.waitFor('svg[aria-label="Back"]');
                const userPost = await instagram.page.$$eval('div[data-testid="post-comment-root"] a', elements=> elements.map(item=>item.textContent) )
                await instagram.page.waitFor(3000);
                let isLikable = await instagram.page.$('svg[aria-label="Like"]');
                if(isLikable){
                    await isLikable.click();
                    console.log(`> ${i+1}/ ${limit} > Like the Post > ${userPost[0]}`);
                    await instagram.page.waitFor(1000);
                    if(coment) {
                        await instagram.page.goto(`${POST_URL}comments/`,{ waitUntil: 'networkidle2' });
                        await instagram.page.waitFor('textarea[aria-label="Add a comment…"]');
                        await instagram.page.waitFor(1000);
                        await instagram.page.type('textarea[aria-label="Add a comment…"]',coment, { delay: 400 });
                        await instagram.page.waitFor(3000);
                        let publish = await instagram.page.$x('//button[contains(text(),"Post")]');
                        await publish[0].click();
                    }
                }
                console.log(`> Awaiting...`);
                if(i+1 == limit) {
                    console.log(`> Processo finalizado...`);
                    process.on('exit', function() { process.exit(1); });
                }
                await instagram.page.waitFor(10000);
            }
            await instagram.page.waitFor(25000);
        }
    },
    likeBioProcess: async (bios = [],limit, coment = null) => {

        console.log('> user profile...');

        for(let bio of bios){
            await instagram.page.goto(BIO_URL(bio),{ waitUntil: 'networkidle2' });
            console.log('> Fetching bio ' + bio);
            await instagram.page.waitFor(1000);

            let posts = await instagram.page.$$('article > div:nth-child(1) img[decoding="auto"]');

            for(let i = 0; i < limit; i++){
                let post = posts[i];

                await post.click();

                console.log('> Click the Post...');
                await instagram.page.waitFor('button[aria-hidden="true"]');
                await instagram.page.waitFor(3000);

                let isLikable = await instagram.page.$('svg[aria-label="Curtir"]');
                if(isLikable){
                    await isLikable.click();
                    console.log('> Like the Post...');
                    await instagram.page.waitFor(1000);
                    if(coment) {
                        console.log('> Wait for Coment...');
                        await instagram.page.type('textarea[aria-label="Adicione um comentário..."]',coment, { delay: 400 });
                        await instagram.page.waitFor(4000);
                        let publish = await instagram.page.$x('//button[contains(text(),"Publicar")]');
                        await publish[0].click()
                        console.log('> Posted Comment...');
                    }
                    await instagram.page.waitFor(4000);
                }
                await instagram.page.click('svg[aria-label="Fechar"]')
                console.log('> Awaiting...');
                await instagram.page.waitFor(15000);
            }
            await instagram.page.waitFor(60000);
        }
    },
    directProcess: async () => {
        console.log('> Initialize Direct Process...');

        await instagram.page.waitFor('svg[aria-label="Direct"]');
        await instagram.page.click('svg[aria-label="Direct"]');

        await instagram.page.waitFor(3000);

        let modalnotify = await instagram.page.$x('//h2[contains(text(),"Ativar notificações")]');
        if(modalnotify.length){
            modalnotify = await instagram.page.$x('//button[contains(text(),"Agora não")]');
            await instagram.page.waitFor(1000);
            await modalnotify[0].click();
            console.log('> Clicked Modal : " No "');
        }

        let messages = await instagram.page.$$('section > div:nth-child(2) > div > div > div:nth-child(2) > div > div');

        for(let i = 0; i < 12; i++){
            let message = messages[i]

            let user = await message.$$eval('a div:nth-child(2) > div', elements=> elements.map(item=>item.textContent) )
        }
        
    },
    sendMessage: async (params) =>{
        console.log('> Initialize SendMessage...');

        await instagram.page.waitFor('svg[aria-label="Direct"]');
        await instagram.page.click('svg[aria-label="Direct"]');

        await instagram.page.waitFor(3000);

        let modalnotify = await instagram.page.$x('//h2[contains(text(),"Ativar notificações")]');
        if(modalnotify.length){
            modalnotify = await instagram.page.$x('//button[contains(text(),"Agora não")]');
            await instagram.page.waitFor(1000);
            await modalnotify[0].click();
            console.log('> Clicked Modal : " No "');
        }

        let selectUser = await instagram.page.$x(`//div[contains(text(),"${params.username}")]`);
        await selectUser[0].click()
        await instagram.page.waitFor(2000);
        await instagram.page.type('textarea[placeholder="Mensagem..."]',params.message, { delay: 400 });
        await instagram.page.waitFor(4000);
        let send = await instagram.page.$x('//button[contains(text(),"Enviar")]');
        await send[0].click()
        await instagram.page.waitFor(1000);

        await instagram.page.click('svg[aria-label="Voltar"]');

        console.log('> Sended!')
    }
}

module.exports = instagram;