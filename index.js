const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mq0mae1.mongodb.net/?retryWrites=true&w=majority`

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3besjfn.mongodb.net/?retryWrites=true&w=majority`;

const uri = "mongodb+srv://makeUser:user1234@cluster0.3besjfn.mongodb.net/?retryWrites=true&w=majority";



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    const usersCollection = client.db('testUser').collection('testUser1234')
    


    app.get('/users',async(req,res)=>{
      const result = await usersCollection.find().toArray()
      res.send(result)
      })
      // app.get('/users/:id', async (req, res) => {
      //   const id = req.params.id;
      //   const query = { _id: ObjectId(id) }; // Use "_id" instead of "id" for ObjectId
      //   const result = await usersCollection.findOne(query);
      //   res.send(result);
      // });


      app.get("/users/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await usersCollection.findOne(query);
        res.send(result);
      });
      

app.post('/newUser',async(req,res)=>{
 const user= req.body;
  const result = await usersCollection.insertOne(user);
  res.send(result);
})

app.put("/user/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const option = { upsert: true };
  const update = req.body;
  const newUser = {
    $set: {
     id: update.id,
     name: update.name,
     email: update.email,
     number: update.number,
    },
  };
  const result = await usersCollection.updateOne(filter, newUser, option);
  res.send(result);
});




app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id)};
  const result = await usersCollection.deleteOne(query);
  res.send(result);
});









    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Users State Server is running..')
})




app.listen(port, () => {
  console.log(`Users State is running on port ${port}`)
})
