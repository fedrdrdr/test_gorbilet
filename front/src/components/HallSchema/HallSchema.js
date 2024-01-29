import React, { useState, useEffect } from 'react';
import style from './style.module.css';

function HallSchema({ svgData }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleSeatClick = (e) => {
      const clickedSeatId = e.target.getAttribute('data-seat-id');
      console.log(clickedSeatId);
      if (clickedSeatId) {
        toggleSeat(clickedSeatId);
      }
    };

    const schemaContainer = document.getElementById('schema-container');

    if (schemaContainer) {
      schemaContainer.addEventListener('click', handleSeatClick);
    }

    return () => {
      if (schemaContainer) {
        schemaContainer.removeEventListener('click', handleSeatClick);
      }
    };
  }, [selectedSeats]);

  const toggleSeat = (id) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(id)) {
        return prevSelectedSeats.filter((seatId) => seatId !== id);
      } else {
        return [...prevSelectedSeats, id];
      }
    });
  };


  const handleIncrease = () => {
    setScale((prevScale) => (prevScale < 2.0 ? prevScale + 0.1 : prevScale));
  };

  const handleDecrease = () => {
    setScale((prevScale) => (prevScale > 0.1 ? prevScale - 0.1 : 0.1));
  };

  return (
    <div className={style.wrap}>
      <div
        id="schema-container"
        className={style.schema}
        style={{ transform: `scale(${scale})` }}
        dangerouslySetInnerHTML={{ __html: svgData }}
      />
      <div className={style.buttons}>
        <button onClick={handleIncrease}>+</button>
        <button onClick={handleDecrease}>-</button>
      </div>
    </div>
  );
}

export default HallSchema;

