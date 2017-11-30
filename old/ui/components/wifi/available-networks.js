import React from 'react';
import Networks from './networks';

const AvailableNetworks = ({ networks, loading, selectNetwork }) => (
  <div className="container col-9">
    <div className="m-2">
      <h3>Redes WiFi Disponibles</h3>
      <div className="divider m-1" />
    </div>
    {
      !loading ?
        <Networks networks={networks} selectNetwork={selectNetwork} /> :
        <div className="loading loading-lg" />
    }
  </div>
);

export default AvailableNetworks;
