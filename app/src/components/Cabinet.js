import React, { useState } from "react";


const UrlDescription = ({ url_long: urlLong, url_short: urlShort, redirects }) => {
  return (
    <li>
      {`Long URL: ${urlLong}`}
      <br/>
      {`Short ULR: ${urlShort}`}
      <br/>
      {`Redirects: ${redirects}`}
      <br/>
    </li>
  );
};


const Cabinet = ({ urlsList, refreshClick }) => {
  let formattedUrlsList;
  if (!urlsList) {
    formattedUrlsList = (
      <div className="cabinet-component">
        You haven't urls yet
      </div>
    );
  } else {
    formattedUrlsList = (
      <ul className="url-list">
        {urlsList.map((url) => <UrlDescription {...url} />)}
      </ul>
    );
  }
  return (
    <div className="cabinet-component">
      <button onClick={refreshClick}>Refresh</button>
      {formattedUrlsList}
    </div>
  );
};


export default Cabinet;

