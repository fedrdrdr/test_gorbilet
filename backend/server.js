import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(cors());

app.get('/load-image', async (req, res) => {
  try {
    const response = await fetch('http://tsnext.ru/test/frontend/resources/dkl-tsn.svg');
    const svgData = await response.text();
    res.send(svgData);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
