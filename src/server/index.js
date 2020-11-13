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

/**
 * @description NASA API call to get photos based on supplied rover name and earth date
 * @param {object} - Request object
 * @param {object} - Response object
 */
app.get('/:name/:earth_date', async (req, res) => {
  try {
    const name = req.params.name;
    const date = req.params.earth_date;

    const images = await fetch(`${process.env.ROVERS_PATH}/rovers/${name}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`)
      .then(res => res.json());
    res.send({ images });
  } catch (err) {
    console.log('error:', err);
  }
});

/**
 * @description NASA API call to get photos based on supplied rover name and earth date
 * @param {object} - Request object
 * @param {object} - Response object
 */
app.get('/:name/', async (req, res) => {
  try {
    const name = req.params.name;

    const manifest = await fetch(`${process.env.ROVERS_PATH}/rovers/${name}?api_key=${process.env.API_KEY}`)
      .then(res => res.json());
    res.send({ manifest });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
