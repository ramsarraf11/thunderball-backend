const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = 3000;


app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Replace with your actual origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});


app.post('/api/data', (req, res) => {
    let { numbers, timeStamp, date, user } = req.body;
    console.log(numbers);
    const dbFilePath = path.join(__dirname, './db.json');
    const dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));

    const newData = {
        numbers,
        timeStamp,
        date,
        user: user === undefined || user === '' ? '' : user
    };

    dbData.data.push(newData);
    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2));
    res.json({ message: 'Data stored successfully' });
});

app.post('/api/admin', (req, res) => {
    let { numbers, timeStamp, date, user } = req.body;
    // console.log(numbers);
    const dbFilePath = path.join(__dirname, './data.json');
    const dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));

    const newData = {
        numbers,
        timeStamp,
        date,
        user: user === undefined || user === '' ? '' : user
    };

    dbData.data.push(newData);
    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2));
    res.json({ message: 'Data stored successfully' });
})

app.get('/api/data', (req, res) => {
    let param = req.query.latest;
    if (param === "admin") {
        const dbFilePath = path.join(__dirname, 'db.json');
        const dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
        if (dbData.data.length === 0) {
            res.status(404).json({ error: 'No data found in the database' });
            return;
        }
        const latestData = dbData.data[dbData.data.length - 1];
        res.json(latestData);
    } else {
        const dbFilePath = path.join(__dirname, 'db.json');
        const dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
        res.json(dbData.data);
    }
});

app.get('/api/admin', (req, res) => {
    let param = req.query.latest;
    if (param === "admin") {
        const dbFilePath = path.join(__dirname, 'db.json');
        const dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
        if (dbData.data.length === 0) {
            res.status(404).json({ error: 'No data found in the database' });
            return;
        }
        const latestData = dbData.data[dbData.data.length - 1];
        res.json(latestData);
    } else {
        const dbFilePath = path.join(__dirname, 'data.json');
        const dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
        res.json(dbData.data);
    }
});


let timeStamp = Date.now();
let formattedTime = formatTime(timeStamp);

function formatTime(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes}${ampm}`;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
