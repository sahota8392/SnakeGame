//Microservice C Highest Score updates
//source: https://www.youtube.com/watch?v=svWqEkzrRlI

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3500;

let highscore = 0;  //starting high score at 0

app.use(cors());
app.use(express.json());

//Endpoint to update the high score
app.post('/highscore', (req, res) => {
    const { score } = req.body;
    if (score > highscore) {
        highscore = score;
    }
    res.json({ highscore });
});

//Endpoint to retrieve the current high score
app.get('/highscore', (req, res) => {
    res.json({ highscore });
});

app.get('/status', (req, res) => {
    res.json({ highscore });
});

app.listen(port, () => {
    console.log(`Microservice C for highest score is listening on port ${port}`);
});