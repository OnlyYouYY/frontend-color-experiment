"use client";

import React, { use, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";

import {
  fetchColors,
  fetchMessage,
  postReaction,
  getIpAddress,
} from "./api/api";

interface Color {
  code: string;
  name: string;
}
interface Message {
  message: string;
}

export default function Home() {
  const [isCouple, setIsCouple] = useState(null);
  const [gender, setGender] = useState(null);
  const [ip, setIp] = useState("");
  const [date, setDate] = useState("");
  const [reaction, setReaction] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [randomMessage, setRandomMessage] = useState([0]);
  const [colors, setColors] = useState<Color[]>([]);
  const [randomColorIndexes, setRandomColorIndexes] = useState([0, 0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [thankYouMessage, setThankYouMessage] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {

        const colores = await fetchColors();
        const frases = await fetchMessage();
        const ipAddress = await getIpAddress();
        const now = new Date();

        // Asegúrate de que la fecha esté en tu zona horaria
        const timeZoneOffset = now.getTimezoneOffset(); // Obtiene la diferencia en minutos
        const timeZoneOffsetMilliseconds = timeZoneOffset * 60 * 1000; // Convierte a milisegundos
        const localTime = new Date(
          now.getTime() - timeZoneOffsetMilliseconds
        );

        // Formatea la fecha y hora en el formato deseado
        const formattedDate = localTime.toISOString();

        setDate(formattedDate);
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
          const randomMessageIndex = Math.floor(
            Math.random() * frases.length
          );
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
    return "";
  }

  function getCurrentMessage(index: any) {
    if (messages.length > 0 && randomMessage[index] !== null) {
      return messages[randomMessage[index]].message;
    }
    return "";
  }

  const handlePareja = (value: any) => {
    setIsCouple(value);
  };

  const handleGenero = (value: any) => {
    setGender(value);
  };

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
      couple: isCouple,
      gender: gender,
    };

    try {
      const response = await postReaction(data);
      console.log("Datos enviados con éxito:", response);
      setErrorMessage(null);
      setThankYouMessage(true);
      setTimeout(() => {
        window.location.reload();
      }, 5000);

    } catch (error) {
      if (error instanceof Error) {
        const errorObj = JSON.parse(error.message);
        if (errorObj && errorObj.error) {
          setErrorMessage(errorObj.error);
        } else {
          setErrorMessage("Error desconocido");
        }
        console.error("Error al enviar datos:", error);
      } else {
        console.error("Error desconocido:", error);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center"
      style={isCouple !== null ? { backgroundColor: backgroundColorIndex } : {}}
    >
      <main>
        {errorMessage ? (
          <div className="error-message">
            <h1 className="text-center text-xl bg-red-500 text-white font-light p-10 rounded-full m-2">
              {errorMessage}
            </h1>
          </div>
        ) : thankYouMessage ? (
          <div className="thank-you-message">
            <h1 className="text-center text-xl bg-green-500 text-white font-light p-10 rounded-full m-2">
              Gracias por responder
            </h1>
          </div>
        ) : (
          <div className="text-center p-10">
            <h1
              className="text-4xl font-semibold"
              style={isCouple !== null ? { color: textColorIndex } : {}}
            >
              {isCouple === null
                ? "¿Tiene pareja?"
                : gender === null
                  ? "¿Con qué género se identifica?"
                  : messageRandom}
            </h1>

            <div className="flex justify-center items-center">
              {isCouple === null ? (
                <>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-7 rounded-full m-2 transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => handlePareja(true)}
                  >
                    Sí
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-7 rounded-full m-2 transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => handlePareja(false)}
                  >
                    No
                  </button>
                </>
              ) : (
                <>
                  {gender === null && (
                    <>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-7 rounded-full m-2 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => handleGenero("Hombre")}
                      >
                        Hombre
                      </button>
                      <button
                        className="bg-blue-500 hover-bg-blue-600 text-white font-semibold p-7 rounded-full m-2 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => handleGenero("Mujer")}
                      >
                        Mujer
                      </button>
                    </>
                  )}
                  {gender !== null && (
                    <>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-7 rounded-full m-2 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={handleLike}
                      >
                        <FontAwesomeIcon icon={faThumbsUp} className="fa-lg" />
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-7 rounded-full m-2 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={handleDislike}
                      >
                        <FontAwesomeIcon icon={faThumbsDown} className="fa-lg" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );

}
