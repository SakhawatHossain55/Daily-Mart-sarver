const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID; 
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0hcik.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("dailyMart").collection("products");
  const ordersCollection = client.db("dailyMart").collection("orders");
  
  app.get('/products', (req, res) => {
    productsCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
  })
  app.get('/product/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    productsCollection.find({_id: id})
        .toArray((err, items) => {
            res.send(items)
        })
  })

  app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      productsCollection.insertOne(newProduct)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    
    const id = ObjectID(req.params.id);
    productsCollection.findOneAndDelete({_id: id})
    .then((result) => {
        res.send(!!result.value)
    })
  })

  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
    console.log(newOrder);
  })

  app.get('/orders', (req, res) => {
    // console.log(req.query.email);
    ordersCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      console.log(err);
      res.send(documents)
    })
  })

});


app.listen(port)


