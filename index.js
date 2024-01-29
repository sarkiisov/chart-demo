const express = require("express");
const Chart = require("chart.js/auto");
const { createCanvas } = require("canvas");

const app = express();

const PORT = 3001;

app.get("/", function (req, res) {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext("2d");

  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };

  const config = {
    type: "doughnut",
    data: data,
  };

  new Chart(ctx, config);

  res.contentType("image/png");
  res.send(canvas.toBuffer("image/png"));
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
