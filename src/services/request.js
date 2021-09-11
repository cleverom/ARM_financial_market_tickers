import axios from 'axios';

const baseUrl = 'https://api.marketaux.com/v1';

const token = process.env.API_TOKEN;

console.log(token);

const setHeader = () => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return config;
};

const getRequest = async (url, data, base = baseUrl) => {
  try {
    const r = await axios.get(`${base}/${url}`, data, setHeader());

    console.log(r, 'res');
    return r;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

export { getRequest };
