"use client";

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import regression from 'regression';

const MyChartComponent: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Datos para la regresión
    const x: number[] = [0, 1, 2, 6, 8, 17, 18];
    const y: number[] = [1, 2, 3, 4, 5, 6, 7];

    // Regresión lineal
    const linearRegression = regression.linear(x.map((val, i) => [val, y[i]]));

    // Regresión exponencial
    const exponentialRegression = regression.exponential(x.map((val, i) => [val, y[i]]));

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
              label: 'Regresión Exponencial',
              data: exponentialRegression.points.map(point => ({ x: point[0], y: point[1] })),
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
