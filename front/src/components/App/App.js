// App.js
import React, { useState, useEffect } from 'react';
import { fetchHallData } from '../../api/ApiService';
import HallSchema from '../HallSchema/HallSchema';

function App() {
  const [svgData, setSvgData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchHallData();
        setSvgData(response.svgData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {svgData && <HallSchema svgData={svgData} />}
      </header>
    </div>
  );
}

export default App;
