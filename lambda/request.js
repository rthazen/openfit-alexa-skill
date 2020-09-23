const fetch = require('node-fetch');

const GIXO_BASE_URL = 'https://of-rest-service.qa.openfit.com/rest';
const AUTH_USER_TOKEN = 'mtn82gmcakknj584tu5m';

const getRequest = async (path) => {
  try {
    const response = await fetch(`${GIXO_BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTH_USER_TOKEN,
      },
    });
    const body = await response.json();
    if (response.ok) {
      return body;
    }
  } catch (e) {
    console.log(e);
  }
}

const getUserInfo = async () => {
  return await getRequest('/me/user');
}

const getUserSchedule = async () => {
  return await getRequest('/me/schedule?type=upcoming');
}

const getAvailableClasses = async () => {
  return await getRequest('/sessions?live=true&query_type=all');
}

exports.getUserSchedule = getUserSchedule;
exports.getUserInfo = getUserInfo;
exports.getAvailableClasses = getAvailableClasses;