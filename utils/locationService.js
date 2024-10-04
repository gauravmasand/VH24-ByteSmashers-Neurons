const axios = require('axios');

// Fetch location from IP
exports.getLocation = async (ipAddress) => {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    const { city, regionName: state, country } = response.data;
    return { city, state, country };
  } catch (err) {
    throw new Error('Error fetching location');
  }
};