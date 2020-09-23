const fetch = require("node-fetch");

const ENDPOINT = "https://nutrio.sb.openfit.com";
const AUTH_USER_TOKEN =
  "Basic OjFmMTY3MDg4LWViZmMtNDUxNy1hZTA3LTJkNDI3MDc2YmI3MQ==";
const getRequest = async path => {
  try {
    const response = await fetch(`${ENDPOINT}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: AUTH_USER_TOKEN
      }
    });
    const body = await response.json();
    if (response.ok) {
      return body;
    }
  } catch (e) {
    console.log(e);
  }
};

const getDashboardFood = async () => {
  return await getRequest("/api/v3/dashboard/food/days");
};

exports.getDashboardFood = getDashboardFood;
