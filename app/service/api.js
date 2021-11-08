const axios = require("axios");

const get = async (url) => {
  return await axios({
    method: "get",
    url,
  });
};

const post = async (url, data) => {
  return await axios({
    method: "post",
    url,
    data,
  });
};

module.exports = {
  get,
  post,
};
