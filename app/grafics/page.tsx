"use client";

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import regression from 'regression';

const MyChartComponent: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Datos para la regresión
    const x: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const y: number[] = [18, 2, 0, 8, 1, 6 ,17, 7, 8, 12];

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
  }, []);

  return <canvas ref={chartRef} />;
};

export default MyChartComponent;
