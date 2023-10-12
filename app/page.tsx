'use client'

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import { fetchColors } from './api/api';

export default function Home() {

  const [colors, setColors] = useState([]);
  const [randomColorIndexes, setRandomColorIndexes] = useState([0, 0]);

  useEffect(() => {
    async function obtenerColores() {
      try {
        const colores = await fetchColors();
        console.log(colores);

        setColors(colores);
      } catch (error) {
        console.log(error);
      }
    }
    obtenerColores();
  }, []);

  const getRandomColors = () => {
    if (colors.length > 0) {
      const firstIndex = Math.floor(Math.random() * colors.length);
      let secondIndex;
      do {
        secondIndex = Math.floor(Math.random() * colors.length);
      } while (secondIndex === firstIndex);
      setRandomColorIndexes([firstIndex, secondIndex]);
    }
  };

  useEffect(() => {
    getRandomColors();
  });


  function getCurrentColorCode(index:any) {
    if (colors.length > 0 && randomColorIndexes[index] !== null) {
      return colors[randomColorIndexes[index]].code;
    }
    return '';
  }

  const backgroundColor = getCurrentColorCode(0);
  const textColor = getCurrentColorCode(1);


  return (
    <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: backgroundColor }}>
      <main>
        <h1 className="text-center text-4xl font-semibold" style={{ color: textColor }}>Hola mundo</h1>
        <div className="flex justify-center items-center pt-20">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-7 rounded-full m-2 transition duration-300 ease-in-out transform hover:scale-105">
            <FontAwesomeIcon icon={faThumbsUp} className="fa-lg w-10" />
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-7 rounded-full m-2 transition duration-300 ease-in-out transform hover:scale-105">
            <FontAwesomeIcon icon={faThumbsDown} className="fa-lg w-10" />
          </button>
        </div>
      </main>
    </div>
  );
}
