const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
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
    app.post("/addtask",async(req,res)=>{
        const task = req.body;
        console.log(task)
        const insertConfirmation = await taskCollection.insertOne(task);
        res.send(insertConfirmation)
    })
    //delete task
    app.delete('/delete/:id',async(req,res)=>{
        const id= req.params
        console.log("delete this", id)
        const query = { _id: ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result)
    })

    app.put('/done/:id',async(req,res)=>{
        const id= req.params
        console.log("update", id)
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              status:"done"
            },
          };
          const result = await taskCollection.updateOne(filter, updateDoc, options);
        res.send(result)
    })
   
   
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
