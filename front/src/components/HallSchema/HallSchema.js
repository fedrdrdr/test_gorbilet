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
        const textElement = document.getElementById(`text-${clickedSeatId}`);
    
        if (textElement) {
          const currentDisplay = textElement.style.display;
    
          if (currentDisplay === 'none') {
            textElement.style.display = 'block';
            rectElement.setAttribute('class', style.activeRect);
            rectElement.setAttribute('transform', 'translate(-2, -2)'); 
          } else {
            textElement.style.display = 'none';
            rectElement.removeAttribute('class', style.activeRect);
            rectElement.removeAttribute('transform');
          }
        }
    
        const updatedSelectedSeats = [...selectedSeats];
        setSelectedSeats(updatedSelectedSeats);
        // toggleSeatColor(clickedSeatId);
      }
    };


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
      rect.setAttribute('class', style.rect);
    
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const textId = `text-${rect.getAttribute('id')}`;
      text.setAttribute('id', textId);
      text.textContent = rect.getAttribute('seat');
      text.setAttribute('x', parseInt(rect.getAttribute('x'), 10) );
      text.setAttribute('y', parseInt(rect.getAttribute('y'), 10) + 14);
      text.setAttribute('class', style.text);
      text.style.display = 'none'; // Устанавливаем изначально в display: none
    
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      rect.parentNode.insertBefore(group, rect);
      group.appendChild(rect);
      group.appendChild(text);
    });
    

    return new XMLSerializer().serializeToString(xmlDoc);
  };

  const wrappedSvgData = wrapRectsWithGroup(svgData);

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
