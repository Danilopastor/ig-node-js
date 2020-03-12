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

    await ig.likeTagsProcess(['podosfera'],10);
    //await ig.likeBioProcess(['sararocha5444'],3,'Cool!!')
    /*await ig.sendMessage({
        username : 'danilopastorr',
        message: 'Opa, blza tudo bem!'
    });*/
}
run()