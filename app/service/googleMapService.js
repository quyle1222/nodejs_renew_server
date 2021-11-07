const Api = require("./api");
const config = require("../config/utils")

const calculatorDirections = async (origin,destination) => {
  const response = await Api.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&avoid=highways&key=${config.GOOGLE_MAP_KEY}`);
  return response.data || {}
};

module.exports = {
  calculatorDirections
}
