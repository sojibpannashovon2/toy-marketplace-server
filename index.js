const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // get specefic user data from mongodb
        app.get('/mytoys', async (req, res) => {
            // console.log(req.query.email);
            let query2 = {};
            if (req.query?.email) {
                query2 = { email: req.query.email }
            }

            const result = await gamezoneCollection.find(query2).toArray();
            res.send(result)
        })

        //get a single data from mongodb

        app.get("/toyshops/:id", async (req, res) => {
            const Id = req.params.id;
            const query = { _id: new ObjectId(Id) }
            const result = await gamezoneCollection.findOne(query)
            res.send(result)

        })


        //delete an single data from mongodb

        app.delete("/mytoys/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await gamezoneCollection.deleteOne(query)
            res.send(result)

        })

        //find a spechific  data from mongodb

        app.get("/mytoys/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await gamezoneCollection.findOne(query)
            res.send(result)

        })
        //Update a spechific  data from mongodb

        app.put("/mytoys/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const data = req.body;

            const updateData = {
                $set: {
                    name: data.name,
                    sellerName: data.sellerName,
                    email: data.email,
                    quantity: data.quantity,
                    price: data.price,
                    rate: data.rate,
                    catagory: data.catagory,
                    details: data.details,
                    photo: data.photo
                }
            }

            const result = await gamezoneCollection.updateOne(filter, updateData, options)
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