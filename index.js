const fs = require("fs");
const express = require("express");
const Chart = require("chart.js/auto");
const { createCanvas, loadImage } = require("canvas");

const app = express();

const PORT = 3001;

const COLORS = {
  red: "rgb(255, 99, 132)",
  blue: "rgb(54, 162, 235)",
  yellow: "rgb(255, 205, 86)",
};

app.get("/merge", async function (req, res) {
  const images = ["image.png", "image.copy.png"];

  let width = 0;
  let height = 0;
  for (let image of images) {
    const { width: w, height: h } = await loadImage(image);
    width += w;
    height = Math.max(height, h);
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  let x = 0;
  for (let image of images) {
    const img = await loadImage(image);
    ctx.drawImage(img, x, 0);
    x += img.width;
  }

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("output.png", buffer);

  res.contentType("image/png");
  res.send(buffer);
});

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

  const spacing = 0.2;

  const data = {
    datasets: [
      {
        label: "Red",
        data: [12],
        backgroundColor: [COLORS.red],
        circumference,
      },
      { weight: spacing },
      {
        label: "Blue",
        data: [20],
        backgroundColor: [COLORS.blue],
        circumference,
      },
      { weight: spacing },
      {
        label: "Yellow",
        data: [8],
        backgroundColor: [COLORS.yellow],
        circumference,
      },
    ],
  };

  const options = { layout: { padding: 20 } };

  Chart.defaults.elements.arc.borderRadius = 10000;
  Chart.defaults.elements.arc.borderWidth = 0;

  new Chart(ctx, { type: "doughnut", data, options });

  fs.writeFileSync("./image.png", Buffer(canvas.toBuffer("image/png")));

  res.contentType("image/png");
  res.send(canvas.toBuffer("image/png"));
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
