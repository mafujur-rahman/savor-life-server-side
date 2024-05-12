const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zjwopdy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const blogCollection = client.db('blogDB').collection('blog');
        const commentCollection = client.db('blogDB').collection('comment');

        app.get('/blogs', async (req, res) =>{
            const cursor = blogCollection.find();
            const result =await cursor.toArray();
            res.send(result)
        })

        app.get('/comments', async(req, res) =>{
            const cursor = commentCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/blogs/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await blogCollection.findOne(query);
            res.send(result)
        })

        app.post('/blogs', async (req, res) => {
            const newBlog = req.body;
            console.log(newBlog)
            const result = await blogCollection.insertOne(newBlog);
            res.send(result)
        })

        app.post('/comments', async(req,res) =>{
            const newComment = req.body;
            console.log(newComment);
            const result = await commentCollection.insertOne(newComment);
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


app.get('/', (req, res) => {
    res.send("savor life server is running")
})

app.listen(port, () => {
    console.log(`server connected: ${port}`);
})