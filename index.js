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
        // await client.connect();
        const blogCollection = client.db('blogDB').collection('blog');
        const comments = client.db('blogDB').collection('comment');
        const wishlistItems = client.db('blogDB').collection('wishlistItems')

        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/wishlist-items', async (req, res) =>{
            const cursor = wishlistItems.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/comments', async (req, res) => {
            const cursor = comments.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await blogCollection.findOne(query);
            res.send(result)
        })

        app.get('/top-blogs', async (req, res) => {
            try {
                const cursor = blogCollection.find();
                const allBlogs = await cursor.toArray();
        
                // Calculate word count for each blog's long description and sort by word count
                const sortedBlogs = allBlogs.sort((a, b) => {
                    const wordCountA = a.longDescription.split(/\s+/).length;
                    const wordCountB = b.longDescription.split(/\s+/).length;
                    return wordCountB - wordCountA; // Sort in descending order
                });
        
                // Get the top 10 blogs
                const topBlogs = sortedBlogs.slice(0, 10);
        
                res.send(topBlogs);
            } catch (error) {
                console.error("Error fetching top blogs:", error);
                res.status(500).send("Internal Server Error");
            }
        });

        app.delete('/wishlist-items/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await wishlistItems.deleteOne(query);
            res.send(result);
        })

        
        app.post('/blogs', async (req, res) => {
            const newBlog = req.body;
            console.log(newBlog)
            const result = await blogCollection.insertOne(newBlog);
            res.send(result)
        })

        app.post('/comments', async (req, res) => {
            const newComment = req.body;
            console.log(newComment);
            const result = await comments.insertOne(newComment);
            res.send(result)

        })

        app.post('/wishlist-items', async (req, res) => {
            const newWishlist = req.body;
            console.log(newWishlist);
            const result = await wishlistItems.insertOne(newWishlist);
            res.send(result)
        })

        

        app.put('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedBlog = req.body;
            const blog = {
              $set: {
                img: updatedBlog.img,
                title: updatedBlog.title,
                category: updatedBlog.category,
                shortDescription: updatedBlog.shortDescription,
                longDescription: updatedBlog.longDescription,
              }
            }
            const result = await blogCollection.updateOne(filter, blog, options);
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