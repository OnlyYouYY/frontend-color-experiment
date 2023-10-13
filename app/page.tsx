'use client'

import React, { use, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';

import { fetchColors, fetchMessage, postReaction, getIpAddress } from './api/api';

interface Color {
  code: string,
  name: string
}
interface Message {
  message: string;
}


export default function Home() {

  const [ip, setIp] = useState('');
  const [date, setDate] = useState('');
  const [reaction, setReaction] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [randomMessage, setRandomMessage] = useState([0]);
  const [colors, setColors] = useState<Color[]>([]);
  const [randomColorIndexes, setRandomColorIndexes] = useState([0, 0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {

    async function fetchData() {
      try {
        const colores = await fetchColors();
        const frases = await fetchMessage();
        const ipAddress = await getIpAddress();
        const boliviaDateTime = DateTime.now().setZone('America/La_Paz').toFormat('yyyy-MM-dd HH:mm:ss');

        setDate(boliviaDateTime);
        setColors(colores);
        setMessages(frases);
        setIp(ipAddress);

        if (colores.length > 0) {
          const firstIndex = Math.floor(Math.random() * colores.length);
          let secondIndex;
          do {
            secondIndex = Math.floor(Math.random() * colores.length);
          } while (secondIndex === firstIndex);
          setRandomColorIndexes([firstIndex, secondIndex]);

        }

        if (frases.length > 0) {
          const randomMessageIndex = Math.floor(Math.random() * frases.length);
          setRandomMessage([randomMessageIndex]);
        }

      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);


  function getCurrentColorCode(index: any) {
    if (colors.length > 0 && randomColorIndexes[index] !== null) {
      return colors[randomColorIndexes[index]].code;
    }
    return '';
  }

  function getCurrentMessage(index: any) {
    if (messages.length > 0 && randomMessage[index] !== null) {
      return messages[randomMessage[index]].message;
    }
    return '';
  }

  const handleLike = () => {
    setReaction(1);
    handleSubmit();
  };

  const handleDislike = () => {
    setReaction(0);
    handleSubmit();
  };

  const backgroundColorIndex = getCurrentColorCode(0);
  const textColorIndex = getCurrentColorCode(1);
  const messageRandom = getCurrentMessage(0);

  const handleSubmit = async () => {

    const data = {
      ip: ip,
      date: date,
      textColor: textColorIndex,
      textBackground: backgroundColorIndex,
      message: messageRandom,
      reaction: reaction,
    };

    try {
      const response = await postReaction(data);
      console.log('Datos enviados con éxito:', response);
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof Error) {
        const errorObj = JSON.parse(error.message);
        if (errorObj && errorObj.error) {
          setErrorMessage(errorObj.error);
        } else {
          setErrorMessage('Error desconocido');
        }
        console.error('Error al enviar datos:', error);
      } else {
        console.error('Error desconocido:', error);
      }
    }
  };



  return (
    <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: backgroundColorIndex }}>
      <main>
        {errorMessage ? (
          <div className="error-message">
            <h1 className="text-center text-xl bg-blue-500 text-white font-light p-10 rounded-full m-2">{errorMessage}</h1>
          </div>
        ) : (
          <h1 className="text-center text-4xl font-semibold p-10" style={{ color: textColorIndex }}>{messageRandom}</h1>
        )}
        <div className="flex justify-center items-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-7 rounded-full m-2 transition duration-300 ease-in-out transform hover:scale-105" onClick={handleLike}>
            <FontAwesomeIcon icon={faThumbsUp} className="fa-lg" />
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-7 rounded-full m-2 transition duration-300 ease-in-out transform hover:scale-105" onClick={handleDislike}>
            <FontAwesomeIcon icon={faThumbsDown} className="fa-lg" />
          </button>
        </div>
      </main>
    </div>
  );
}
