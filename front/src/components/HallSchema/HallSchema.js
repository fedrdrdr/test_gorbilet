import React, { useState, useEffect } from 'react';
import style from './style.module.css';


function HallSchema({ svgData }) {
  // Состояния для хранения выбранных мест и масштаба
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [scale, setScale] = useState(1);

  // Эффект для обработки кликов по местам
  useEffect(() => {
    // Функция обработки клика по месту
    const handleSeatClick = (e) => {
      // Получаем элемент rect, на который кликнули
      const rectElement = e.target.closest('rect');

      if (rectElement) {
        // Получаем id выбранного места
        const clickedSeatId = rectElement.getAttribute('id');
        // Получаем соответствующий текстовый элемент
        const textElement = document.getElementById(`text-${clickedSeatId}`);

        if (textElement) {
          // Получаем текущий статус отображения текста
          const currentDisplay = textElement.style.display;

          // Если текст скрыт, отображаем его и применяем стили
          if (currentDisplay === 'none') {
            textElement.style.display = 'block';
            rectElement.setAttribute('class', style.activeRect);
            rectElement.setAttribute('transform', 'translate(-2, -2)');
          } else {
            // Если текст виден, скрываем его и убираем стили
            textElement.style.display = 'none';
            rectElement.removeAttribute('class', style.activeRect);
            rectElement.removeAttribute('transform');
          }
        }

        // Обновляем массив выбранных мест
        const updatedSelectedSeats = [...selectedSeats];
        setSelectedSeats(updatedSelectedSeats);
      }
    };

    // Получаем контейнер схемы по id
    const schemaContainer = document.getElementById('schema-container');

    // Функция-обработчик клика на схеме
    const clickHandler = (e) => {
      handleSeatClick(e);
    };

    // Добавляем слушателя событий при монтировании компонента
    if (schemaContainer) {
      schemaContainer.addEventListener('click', clickHandler);
    }

    // Убираем слушателя событий при размонтировании компонента
    return () => {
      if (schemaContainer) {
        schemaContainer.removeEventListener('click', clickHandler);
      }
    };
  }, [selectedSeats]);

  // Функция для оборачивания элементов rect и text в группы g 
  // для того чтобы разметка была <g><rect></rect><text></text></g>
  const wrapRectsWithGroup = (svgString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const placesGroups = xmlDoc.querySelectorAll('g.places');

    placesGroups.forEach((placesGroup) => {
      const rects = placesGroup.querySelectorAll('rect');

      rects.forEach((rect) => {
        rect.setAttribute('class', style.rect);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const textId = `text-${rect.getAttribute('id')}`;
        text.setAttribute('id', textId);
        text.textContent = rect.getAttribute('seat');
        text.setAttribute('x', parseInt(rect.getAttribute('x'), 10));
        text.setAttribute('y', parseInt(rect.getAttribute('y'), 10) + 14);
        text.setAttribute('class', style.text);
        text.style.display = 'none';

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        rect.parentNode.insertBefore(group, rect);
        group.appendChild(rect);
        group.appendChild(text);
      });
    });

    return new XMLSerializer().serializeToString(xmlDoc);
  };

  // Получаем SVG-данные с оберткой
  const wrappedSvgData = wrapRectsWithGroup(svgData);

  // Обработчики для увеличения и уменьшения масштаба
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
          style={{ 
            transform: `scale(${scale})`,
            overflow: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: wrappedSvgData }}
        />
      </div>

 
      <div className={style.buttons}>
        {/* Кнопки увеличения и уменьшения масштаба */}
        <button onClick={handleIncrease}>+</button>
        <button onClick={handleDecrease}>-</button>
      </div>
    </div>
  );
}

export default HallSchema;
