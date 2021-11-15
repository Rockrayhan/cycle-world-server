const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const { query } = require('express');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId ;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shqkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Cycle-World');
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');

      /*   // Admin ( Orders for admin )
        app.get('/orders', async(req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders) ;
        }) */



        // GET (Orders)
        app.get('/orders', async(req, res) => {
            const email = req. query.email ;
            const query = {email:email} 
            console.log(query);
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders) ;
        })

        // POST (orders)
        app.post('/orders', async(req, res) => {
            const order = req.body ;
            const result = await ordersCollection.insertOne(order)
            console.log(result);
            res.json(result)
        });


        // GET API (products)
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });


        // GET single Products
        app.get('/products/:id', async(req, res) => {
            const id = req.params.id ;
            console.log('getting id',id);
            const query = {_id: ObjectId(id)} ;
            const product = await productsCollection.findOne(query);
            res.json(product) ;
        })

        // POST API (products)
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('hit the post api', product);

            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result);
        });

        // DELETE (Product)
        app.delete('/products/:id', async (req , res) => {
            const id = req.params.id ;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query) ;
        });

        app.post('/users',async(req, res) => {
            const user = req.body ;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        })

        app.get('/users/:email', async (req , res) => {
            const email = req.params.email ;
            const query = {email : email};
            const user = await usersCollection.findOne(query);
            let isAdmin = false ;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({admin: isAdmin}) ;
        })

        // For Admin
        app.put ('/users/admin' , async (req, res) => {
            const user = req.body ;
            console.log('put' ,user);
            const filter = {email: user.email} ;
            const updateDoc = {$set: {role:'admin'}} ;
            const result = await usersCollection.updateOne(filter , updateDoc) ;
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