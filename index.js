const express = require('express');
const app = express();
const port = 3000;
const CRD = require('./CRD/CRD');


app.get('/', function (req, res) {
    res.send('Hello World!')
});

CRD.Read('abc', './Database/db.JSON');
CRD.Delete('abc', './Database/db.JSON');


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});