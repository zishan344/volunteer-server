const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  ObjectID,
} = require("mongodb");
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gsosg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const volunteerCollection = client
      .db("volunteerInfo")
      .collection("volunteer");

    //post api
    app.post("/volunteer", async (req, res) => {
      const volunteer = req.body;
      console.log(volunteer);
      const result = await volunteerCollection.insertOne(volunteer);
      res.send(result);
    });
    //get api all object
    app.get("/volunteers", async (req, res) => {
      const query = {};
      const cursor = volunteerCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //get api single one
    app.get("/volunteer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await volunteerCollection.findOne(query);
      res.send(cursor);
    });

    //update api
    app.put("/volunteer/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const updateVolunteer = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          image: updateVolunteer.image,
          description: updateVolunteer.description,
        },
      };
      const result = await volunteerCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Delete api
    app.delete("/volunteer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await volunteerCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// volunteerInfo
// volunteer
