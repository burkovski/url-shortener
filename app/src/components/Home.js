import React from "react";


const Home = ({ onShortifyClick, shortUrl }) => {
  const [ttl, setTtl] = React.useState(90);
  const [longUrl, setLongUrl] = React.useState('');

  const onTtlInputChange = (event) => {
    setTtl(event.target.value === '' ? '' : Number(event.target.value));
  };

  const onUrlInputChange = (event) => {
    setLongUrl(event.target.value);
  };

  return (
    <div className="home-component">
      <label>
        <h2>Shortify URL:</h2>
        <br />
        <input type="text" value={longUrl} onChange={onUrlInputChange} />
        <br />
        <input type="range" min="1" max="365" value={ttl} onChange={onTtlInputChange} />
        <input type="number" min="1" max="365" step="1" value={ttl} onChange={onTtlInputChange} />
        <br />
      </label>
      <button onClick={() => onShortifyClick(longUrl, ttl)}>Shortify</button>
      {shortUrl || null}
    </div>
  )
};

export default Home;
