// Microservice B - Pause & Resume Game
// https://www.toptal.com/developers/keycode  (Spacebard will be pause/resume == 32)

const express = require('express');
const cors = require('cors');
const app = express();
const port = 4500;

let isPaused = false;

app.use(cors());
app.use(express.json());

app.post('/pause-resume', (req, res) => {
    isPaused = !isPaused;
    res.json({ isPaused });
});

app.get('/status', (req, res) => {
    res.json({ isPaused });
});

app.listen(port, () => {
    console.log(`Microservice B for pause/resume is listening on port ${port}`);
});