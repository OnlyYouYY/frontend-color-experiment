"use client";

import { useContext, useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import regression from 'regression';
import { getPredicted } from '../api/api';

interface Data {
    x: number[];
    y: number[];
}

const MyChartComponentPredicted: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {

        async function predicted() {
            try {
                const { datosEntrenamiento, prediccionesBasadasEnY } = await getPredicted();

                // Combina los datos de entrenamiento y las predicciones
                const combinedData = [...datosEntrenamiento, ...prediccionesBasadasEnY];

                // Ordena los datos por el valor de x (si es necesario)
                combinedData.sort((a, b) => a.x - b.x);

                // Extrae los valores de x e y en arreglos separados
                const x = combinedData.map(data => data.x);
                const y = combinedData.map(data => data.y);

                // Ahora, x y y contienen todos los datos combinados
                setData({ x, y });

                // Datos para la regresión

                // Regresión lineal
                const linearRegression = regression.linear(x.map((val, i) => [val, y[i]]));

                // Regresión logarítmica
                const logarithmicRegression = regression.logarithmic(x.map((val, i) => [val, y[i]]));

                // Regresión polinómica
                const polynomialRegression = regression.polynomial(x.map((val, i) => [val, y[i]]), { order: 2 });

                // Configuración del gráfico
                const ctx = chartRef.current?.getContext('2d');

                if (ctx) {
                    new Chart(ctx, {
                        type: 'scatter',
                        data: {
                            datasets: [
                                {
                                    label: 'Datos',
                                    data: x.map((val, i) => ({ x: val, y: y[i] })),
                                    borderColor: 'blue',
                                    backgroundColor: 'blue',
                                    showLine: false,
                                },
                                {
                                    label: 'Regresión Lineal',
                                    data: linearRegression.points.map(point => ({ x: point[0], y: point[1] })),
                                    borderColor: 'red',
                                    backgroundColor: 'transparent',
                                    showLine: true,
                                },
                                {
                                    label: 'Regresión Logarítmica',
                                    data: logarithmicRegression.points.map(point => ({ x: point[0], y: point[1] })),
                                    borderColor: 'green',
                                    backgroundColor: 'transparent',
                                    showLine: true,
                                },
                                {
                                    label: 'Regresión Polinómica',
                                    data: polynomialRegression.points.map(point => ({ x: point[0], y: point[1] })),
                                    borderColor: 'orange',
                                    backgroundColor: 'transparent',
                                    showLine: true,
                                },
                            ],
                        },
                        options: {
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'X',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Y',
                                    },
                                },
                            },
                        },
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }

        predicted();



    }, []);

    return <canvas ref={chartRef} />;
};

export default MyChartComponentPredicted;
