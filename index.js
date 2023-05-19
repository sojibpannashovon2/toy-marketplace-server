const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
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



const uri = `mongodb+srv://${process.env.GAME_user}:${process.env.GAME_pass}@cluster0.yaanftr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const gamezoneCollection = client.db("toyShop").collection("allToys");
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        //post single data to mongodb

        app.post("/toyshops", async (req, res) => {
            const shopping = req.body;
            const result = await gamezoneCollection.insertOne(shopping)
            res.send(result)
        })

        //get data from mongodb

        app.get("/toyshops", async (req, res) => {
            const cursor = gamezoneCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`The gamezone is running at port: ${port}`);
})