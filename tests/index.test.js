const ig = require('../src/index');
const path = require('path');
const session = path.resolve(__dirname,'sessions');

const run = async() => {
    await ig.initialize({
        auth: {
            username: '',
            password: '',
            session
        }
    });

    await ig.likeTagsProcess(['love'],10);
    //await ig.likeBioProcess(['danilopastorr'],3,'Cool!!')
    /*await ig.sendMessage({
        username : 'danilopastorr',
        message: 'Opa, blza tudo bem!'
    });*/
}
run()