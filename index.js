const fs = require("fs");
const express = require("express");
const Chart = require("chart.js/auto");
const { createCanvas } = require("canvas");

const app = express();

const PORT = 3001;

const COLORS = {
  red: "rgb(255, 99, 132)",
  blue: "rgb(54, 162, 235)",
  yellow: "rgb(255, 205, 86)",
};

app.get("/", function (req, res) {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext("2d");

  const circumference = (ctx) => {
    const maxDegree = 270;

    const sum = (arr) => arr.reduce((acc, value) => acc + value, 0);
    const max = (arr) => Math.max(...arr);

    const maxValue = max(ctx.chart.data.datasets.map(({ data }) => sum(data)));

    return (sum(ctx.dataset.data) / maxValue) * maxDegree;
  };

  const data = {
    datasets: [
      {
        label: "Red",
        data: [12],
        backgroundColor: [COLORS.red],
        circumference,
      },
      {
        label: "Blue",
        data: [20],
        backgroundColor: [COLORS.blue],
        circumference,
      },
      {
        label: "Yellow",
        data: [8],
        backgroundColor: [COLORS.yellow],
        circumference,
      },
    ],
  };

  Chart.defaults.elements.arc.borderRadius = 10000;

  new Chart(ctx, { type: "doughnut", data });

  fs.writeFileSync("./image.png", Buffer(canvas.toBuffer("image/png")));

  res.contentType("image/png");
  res.send(canvas.toBuffer("image/png"));
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
