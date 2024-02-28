const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// const uri = "mongodb+srv://paginationdb:jonnYoUvVEV4qm3r@cluster0.swu9d.mongodb.net/emaJohnDB?retryWrites=true&w=majority";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ifoquc5.mongodb.net/?retryWrites=true&w=majority`;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const productCollection = client.db('biplobbd').collection('productsbiplob');

    app.get('/products', async (req, res) => {
      try {
        const page=parseInt(req.query.page)
        const size=parseInt(req.query.size)
        const result = await productCollection.find()
        .skip(page * size)
        .limit(size)
        .toArray();
       
        console.log(page ,size)
        res.send(result);
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.post("/productIds", async(req, res)=>{
         const ids=req.body
        
         const idWithNewObjectId=ids.map(id=> new ObjectId(id))
         console.log(idWithNewObjectId)
         const find={
          _id : {
            $in : idWithNewObjectId
          }
         }
         const result= await productCollection.find(find).toArray()
         console.log( "result is : ",result)
         res.send(result)
        
    }
    
    )

    app.get("/productCount", async (req, res)=>{
      
      const count=await productCollection.estimatedDocumentCount();
      res.send({count})
    })

    await client.db('admin').command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('John is busy shopping');
});

app.listen(port, () => {
  console.log(`Ema John server is running on port: ${port}`);
});
