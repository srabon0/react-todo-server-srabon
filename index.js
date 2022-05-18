const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eeau4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyAuthToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.ACCESS_TOKEN_ENC_KEY, function (err, decoded) {
      if (err) {
        return res.status(403).send({ message: 'Forbidden access' })
      }
      req.decoded = decoded;
      next();
    });
  }


async function run() {
  try {
    await client.connect();
    const database = client.db("mytodo");
    const taskCollection = database.collection("task");
   
    console.log("DB is connected");

    //get all the task
    app.get('/tasks',async(req,res)=>{
        const query = {};
        const tasks = await taskCollection.find(query).toArray()
        res.send(tasks)

    })

    //addTask
    app.post("/addtask",verifyAuthToken, async(req,res)=>{
        const task = req.body;
      
        const insertConfirmation = await taskCollection.insertOne(task);
        res.send(insertConfirmation)
    })
    //delete task
    app.delete('/delete/:id', verifyAuthToken ,async(req,res)=>{
        const id= req.params
        
        const query = { _id: ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result)
    })

    app.put('/done/:id', verifyAuthToken , async(req,res)=>{
        const id= req.params
       
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              status:"done"
            },
          };
          const result = await taskCollection.updateOne(filter, updateDoc, options);
        res.send(result)
    });

    app.post('/login', async (req, res) => {
        const email = req.body;
        const token = jwt.sign(email, process.env.ACCESS_TOKEN_ENC_KEY);
        res.send({ token });
      });
   
   
  } finally {
    //
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("It is srabons todo app server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
