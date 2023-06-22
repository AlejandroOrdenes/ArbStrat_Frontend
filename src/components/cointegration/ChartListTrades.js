import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const ChartListTrades = ({ tradesData }) => {
  const [win, setWin] = useState(0);
  const [lose, setLose] = useState(0);
  const [porcent, setPorcent] = useState(0)

  useEffect(() => {
    // Filtrar trades ganadores y perdedores
    const profit1 = tradesData.map((trade) => trade.profit1);
    const profit2 = tradesData.map((trade) => trade.profit2);

    let winCount = 0;
    let loseCount = 0;

    profit1.forEach((profit) => {
      if (profit >= 0) {
        winCount++;
      } else {
        loseCount++;
      }
    });

    profit2.forEach((profit) => {
      if (profit >= 0) {
        winCount++;
      } else {
        loseCount++;
      }
    });

    setWin(winCount);
    setLose(loseCount);
  }, [tradesData]);

  

  const total = win + lose;
  const winPercentage = total === 0 ? 0 : ((win / total) * 100).toFixed(2);
const losePercentage = total === 0 ? 0 : ((lose / total) * 100).toFixed(2);


  const data = {
    labels: [` Winners (${winPercentage}%)`, `   Losers (${losePercentage}%)`],
    datasets: [
      {
        label: "Trades Results",
        data: [win, lose],
        backgroundColor: ["rgba(173, 255, 47, 0.6)", "rgba(255, 0, 0, 0.6)"],
        borderColor: ["rgb(33, 37, 41, 1)"],
        borderWidth: 5,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 15,
            
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};
