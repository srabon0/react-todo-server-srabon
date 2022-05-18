const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");


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
