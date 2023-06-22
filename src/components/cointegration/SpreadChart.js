import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export function SpreadChart({ rowData }) {

  const mostRecentSpread = rowData.Spread[rowData.Spread.length - 1];
  const spreadText = `Spread ${mostRecentSpread.toFixed(4)}`;

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      grid: {
        drawBorder: false, // Oculta la línea de borde de la grilla
        color: (context) => {
          if (context.tick.value === 0) {
            return 'rgba(255, 255, 255, 0.5)'; // Cambia el color de la línea del valor cero
          } else {
            return 'rgba(255, 255, 255, 0.1)'; // Cambia el color de las líneas de la grilla
          }
        },
        lineWidth: (context) => {
          if (context.tick.value === 0) {
            return 1; // Cambia el ancho de la línea del valor cero
          } else {
            return 1; // Cambia el ancho de las líneas de la grilla
          }
        },
        z: -1, // Coloca las líneas de la grilla detrás de las líneas de datos
      },
    },
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: 'white', // Cambia el color del texto de las etiquetas de la leyenda
        font: {
          size: 16, // Cambia el tamaño del texto de las etiquetas de la leyenda
        },
      },
    },
    title: {
      display: true,
      text: spreadText,
      color: 'white', // Cambia el color del texto del título
      font: {
        size: 24, // Cambia el tamaño del texto del título
      },
    },
  },
};

const datos = rowData.Spread.slice(-200);

const labels = Array.from({ length: datos.length }, (_, i) => i);

const data = {
  labels,
  datasets: [
    {
      label: `${rowData.Crypto1_ID} - ${rowData.Crypto2_ID}`,
      data: datos,
      borderColor: 'yellowgreen',
      backgroundColor: 'yellowgreen',
      borderWidth: 1, // Establecer el ancho de la línea
      pointRadius: 0, // Ocultar los puntos
    }
  ],
};


  return <Line options={options} data={data} />;
}