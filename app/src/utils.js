import React from "react";
import { Link } from "react-router-dom";

const PROTOCOL    = "http";
const HOST        = "localhost";
const ROOT_URL    = `${PROTOCOL}://${HOST}/api`;


async function myFetch(url, method, body, additionalHeaders) {
  async function getDataFromResponse(response) {
    let key;
    let val;
    try {
      if (!response.ok) {
        throw response.statusText;
      }
      key = "data";
      val = await response.json();
    } catch (e) {
      key = "error";
      val = e;
    }

    return {
      "isSuccess": response.ok,
      "status": response.status,
      [key]: val
    };
  }

  const initRequest = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...additionalHeaders
    }
  };

  if (method !== "GET" && body) {
    initRequest.body = JSON.stringify(body);
  }

  const response = await fetch(url, initRequest);
  return await getDataFromResponse(response)
}


function shouldRefreshTokens(accessToken) {
  if (!accessToken) {
    return false;
  }
  let payload = atob(accessToken.split('.')[1]);
  let expireAt = payload.exp;
  let utcNow = Math.round(Date.now() / 1000);
  return expireAt <= utcNow;
}


const dataInProcessing = (storage) => {
  return storage.inProcessing;
};


const AdapterLink = React.forwardRef((props, ref) => {
  return <Link innerRef={ref} {...props} />;
});



export {
  myFetch,
  ROOT_URL,
  dataInProcessing,
  shouldRefreshTokens,
  AdapterLink
};



