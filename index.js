const express = require('express');
const app = express();

const cors = require('cors');

const port = process.env.PORT || 2000;

// middleware

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("GameZone Toy Shop is running")
})

app.listen(port, () => {
    console.log(`The gamezone is running at port: ${port}`);
})