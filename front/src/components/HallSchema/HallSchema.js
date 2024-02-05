import React, { useState, useEffect } from 'react';
import style from './style.module.css';


function HallSchema({ svgData }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleSeatClick = (e) => {
      const rectElement = e.target.closest('rect');

      if (rectElement) {
        const clickedSeatId = rectElement.getAttribute('id');
        // const seatNumber = rectElement.getAttribute('seat');
        const updatedSelectedSeats = [...selectedSeats];

        // if (updatedSelectedSeats.includes(clickedSeatId)) {
        //   removeSeatNumber(seatNumber);
        //   const index = updatedSelectedSeats.indexOf(clickedSeatId);
        //   updatedSelectedSeats.splice(index, 1);
        // } else {
        //   updatedSelectedSeats.push(clickedSeatId);
        //   showSeatNumber(seatNumber, e.clientX, e.clientY);
        // }


        setSelectedSeats(updatedSelectedSeats);
        toggleSeatColor(clickedSeatId);
      }
    };

    // const showSeatNumber = (seatNumber, x, y) => {
    //   const existingElement = document.querySelector(`${style.seatNumber}`);
    //   if (existingElement) {
    //     existingElement.style.display = 'none';
    //   }

    //   const seatNumberElement = document.createElement('div');
    //   seatNumberElement.className = style.seatNumber;
    //   seatNumberElement.textContent = seatNumber;
    //   seatNumberElement.style.left = `${x - 6}px`;
    //   seatNumberElement.style.top = `${y - 6}px`;
    //   seatNumberElement.addEventListener('click', handleSeatClick);
    //   document.body.appendChild(seatNumberElement);
    // };

    // const removeSeatNumber = (seatNumber) => {
    //   const seatNumberElements = document.querySelectorAll(`.${style.seatNumber}`);
    //   seatNumberElements.forEach((element) => {
    //     if (element.textContent === seatNumber) {
    //       element.style.display = 'none'; 
    //     }
    //   });
    // };

    const schemaContainer = document.getElementById('schema-container');

    const clickHandler = (e) => {
      handleSeatClick(e);
    };

    if (schemaContainer) {
      schemaContainer.addEventListener('click', clickHandler);
    }

    return () => {
      if (schemaContainer) {
        schemaContainer.removeEventListener('click', clickHandler);
      }
    };
  }, [selectedSeats]);

  const wrapRectsWithGroup = (svgString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const rects = xmlDoc.querySelectorAll('rect');


    rects.forEach((rect) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.textContent = rect.getAttribute('seat'); // Пример, предполагается, что 'seat' - это атрибут места в <rect>
      text.setAttribute('x', rect.getAttribute('x')); // Устанавливаем атрибуты text, например, x, y, font-size и т. д.
      text.setAttribute('y', rect.getAttribute('y') - 6); // Пример, уменьшаем y на 6 единиц, чтобы text был выше rect
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      rect.parentNode.insertBefore(group, rect);
      group.appendChild(rect);
      group.appendChild(text);
    });

    return new XMLSerializer().serializeToString(xmlDoc);
  };

  const wrappedSvgData = wrapRectsWithGroup(svgData);
  const toggleSeatColor = (id) => {
    const clickedRect = document.getElementById(id);

    if (clickedRect) {
      const currentStroke = clickedRect.getAttribute('stroke');

      if (currentStroke) {
        clickedRect.removeAttribute('stroke');
      } else {
        clickedRect.setAttribute('stroke', 'rgb(158, 88, 225)');
      }
    }
  };

  const handleIncrease = () => {
    setScale((prevScale) => (prevScale < 2.0 ? prevScale + 0.1 : prevScale));
  };

  const handleDecrease = () => {
    setScale((prevScale) => (prevScale > 0.1 ? prevScale - 0.1 : 0.1));
  };

  return (
    <div className={style.wrap}>
      <div>
        <div
          id="schema-container"
          className={style.schema}
          style={{ transform: `scale(${scale})` }}
          dangerouslySetInnerHTML={{ __html: wrappedSvgData }}
        />
      </div>
      
      <div className={style.selectedSeatsContainer}>
        {selectedSeats.map((id) => (
          <div key={id} className={style.selectedSeat} />
        ))}
      </div>
      <div className={style.buttons}>
        <button onClick={handleIncrease}>+</button>
        <button onClick={handleDecrease}>-</button>
      </div>
    </div>
  );
}

export default HallSchema;
