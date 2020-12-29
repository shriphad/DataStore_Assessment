const express = require('express');
const app = express();
const port = 3000;
const CRD = require('./CRD/CRD');

const args = process.argv[2];
const Default_path = './Database/db.json';

app.get(['/read', '/read/:key'], function (req, res) {
    if (!req.params.key && !req.query.key) {
        res.send("Please mention key!<br><br>Your request should be in this format =>  http://localhost:3000/read/The_Key_You_Want_To_Read")
    }
    else {
        const key = req.params.key || req.query.key;
        res.send(CRD.Read(key, args || Default_path));
    }
});

app.delete(['/delete', '/delete/:key'], function (req, res) {
    if (!req.params.key && !req.query.key) {
        res.send("Please mention key!<br><br>Your request should be in this format =>  http://localhost:3000/read/The_Key_You_Want_To_Delete")
    }
    else {
        const key = req.params.key || req.query.key;
        res.send(CRD.Delete(key, args || Default_path));
    }
});

app.all(['/', '/help', '*'], function (req, res) {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});