const axios = require('axios');

const get = (url) => {
    axios({
        method:'get',
        url,
    })
}

const post = (url) => {
    axios({
        method:'post',
        url,
    })
}

module.exports = {
    get,
    post
}