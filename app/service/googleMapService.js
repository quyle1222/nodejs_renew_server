const Api = require("./api");
const config = require("../config/utils");

const calculatorDirections = async (origin, destination) => {
  // const response = await Api.get(
  //   `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&avoid=highways&key=${config.GOOGLE_MAP_KEY}`,
  // );
   const response = await Api.get(
    `https://rsapi.goong.io/Direction?origin=${origin}&destination=${destination}&api_key=${config.GOOGLE_MAP_KEY}`,
  );
  return response.data || {};
};

const getAddress =  async (lat,lng) => {
  const response = await Api.get(
    `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${config.GOOGLE_MAP_KEY}`,
  );
  return response.data || {};
}

module.exports = {
  calculatorDirections,
  getAddress
};
