require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// rover manifest info
app.get('/rovers', async (req, res) => {
  try {
    let rovers = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`)
      .then(res => res.json());
    res.send(rovers);
  } catch (err) {
    console.log('error:', err);
  }
});

app.get('/:name/:earth_date', async (req, res) => {
  try {
    const name = req.params.name;
    const date = req.params.earth_date;

    let images = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`)
      .then(res => res.json());
    res.send({ images });
  } catch (err) {
    console.log('error:', err);
  }
});

// astronomy photo of the day API call
app.get('/apod', async (req, res) => {
  try {
    let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
      .then(res => res.json());
    res.send({ image });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
