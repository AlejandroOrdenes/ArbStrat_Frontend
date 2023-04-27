// LineChartComponent.js
import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import styles from "../components/CointegrationChart.module.css";
import { RingLoader } from "react-spinners";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const CointegrationChart = ({ market1, market2 }) => {
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const minPrice1 =
    apiData.length > 0
      ? Math.min(...apiData[0].datasets[0].data.map(parseFloat))
      : null;
  const maxPrice1 =
    apiData.length > 0
      ? Math.max(...apiData[0].datasets[0].data.map(parseFloat))
      : null;
  const minPrice2 =
    apiData.length > 1
      ? Math.min(...apiData[1].datasets[0].data.map(parseFloat))
      : null;
  const maxPrice2 =
    apiData.length > 1
      ? Math.max(...apiData[1].datasets[0].data.map(parseFloat))
      : null;

  const minPrice =
    minPrice1 !== null && minPrice2 !== null
      ? Math.min(minPrice1, minPrice2)
      : null;
  const maxPrice =
    maxPrice1 !== null && maxPrice2 !== null
      ? Math.max(maxPrice1, maxPrice2)
      : null;

  const formatDateLabels = (labels) => {
    return labels.map((label) => {
      return label.substring(5, 10);
    });
  };

  const normalize = (value, min, max) => {
    return (value - min) / (max - min);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response1 = await axios.get(
          `http://127.0.0.1:8000/price/${market1.Crypto1_ID}`
        );
        const response2 = await axios.get(
          `http://127.0.0.1:8000/price/${market1.Crypto2_ID}`
        );

        if (
          response1.data &&
          response1.data.length > 0 &&
          response2.data &&
          response2.data.length > 0
        ) {
          const data1 = response1.data[0];
          const data2 = response2.data[0];

          setApiData([data1, data2]);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [market1, market2]);

  const data = {
    labels: apiData.length > 0 ? formatDateLabels(apiData[0].labels) : [],
    datasets: [
      {
        label: market1.Crypto1_ID,
        data:
          apiData.length > 0
            ? apiData[0].datasets[0].data.map((value) =>
                normalize(parseFloat(value), minPrice1, maxPrice1)
              )
            : [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 2, // Establecer el ancho de la línea
        pointRadius: 0, // Ocultar los puntos
      },
      {
        label: market2.Crypto2_ID,
        data:
          apiData.length > 1
            ? apiData[1].datasets[0].data.map((value) =>
                normalize(parseFloat(value), minPrice2, maxPrice2)
              )
            : [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderWidth: 2, // Establecer el ancho de la línea
        pointRadius: 0, // Ocultar los puntos
      },
    ],
  };

  const spinnerStyle = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  return (
    <div className={styles.chartContainer}>
      {isLoading ? (
        <RingLoader
        color="#36d7b7"
          loading={isLoading}
          css={spinnerStyle}
          size={150}
        />
      ) : (
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "white", // Cambia el color del texto de las etiquetas de la leyenda
                  font: {
                    size: 16, // Cambia el tamaño del texto de las etiquetas de la leyenda
                  },
                },
              },
              title: {
                display: true,
                text: "Cointegrated Pairs",
                color: "white", // Cambia el color del texto del título
                font: {
                  size: 24, // Cambia el tamaño del texto del título
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const dataset = data.datasets[context.datasetIndex];
                    const realPrice = parseFloat(
                      dataset.data[context.dataIndex]
                    );
                    return `${dataset.label}: ${realPrice.toFixed(2)}`;
                  },
                },
              },
              scales: {
                x: {
                  type: "time",
                  time: {
                    minUnit: "hour", // O cualquier otra unidad de tiempo que desees
                    stepSize: 10, // Ajusta este valor para cambiar la separación entre las etiquetas
                  },
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};
