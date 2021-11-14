const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shqkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Cycle-World');
        const productsCollection = database.collection('products');

        // GET API (products)
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray() ;
            res.send(products);
        })

        // POST API (products)
        app.post('/products', async (req, res) => {
            const product = req.body ;
            console.log('hit the post api' , product);

            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result) ;
        })
    }
    finally {
        // await client.close() ;
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Riders')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})