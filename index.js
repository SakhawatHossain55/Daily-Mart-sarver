const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID; 
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0hcik.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("dailyMart").collection("products");
  
  app.get('/products', (req, res) => {
    productsCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
  })
  app.get('/product/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    // console.log('product', id);
    productsCollection.find({_id: id})
        .toArray((err, items) => {
            res.send(items)
        })
  })

  app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      productsCollection.insertOne(newProduct)
      .then(result => {
          // console.log("inserted count", result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    
    const id = ObjectID(req.params.id);
    // console.log('delte this', id)
    productsCollection.findOneAndDelete({_id: id})
    .then((result) => {
        res.send(!!result.value)
    })

  })

});


app.listen(port)






// productsCollection.deleteOne({_id: ObjectId(req.params.id)})
//       .then((result) => {
//           res.send(result.deletedCount > 0)
//       })
