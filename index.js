const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;
const jwt = require("jsonwebtoken");
//middleware
app.use(cors());
app.use(express.json());

//mongodb
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vrlyepl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const userCollection = client.db("gadgetShop").collection("users");
const productCollection = client.db("gadgetShop").collection("products");

const dbConnect = async () => {
  try {
    client.connect();
    console.log("DB Connected");

    //get user

    app.get("/user", async (req, res) => {
      const query = { email: req.body.email };
      const user = await userCollection.findOne(query);

      if (user) {
        return res.send({ message: "No User Found" });
      }
      res.send(result);
    });

    //insert user

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);

      //checking if user already exist or not

      if (existingUser) {
        return res.send({ message: "User Already Exists" });
      }
      //inserting user in User collection
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

//api
app.get("/", (req, res) => {
  res.send("server is running");
});

//jwt
app.post("/authentication", async (req, res) => {
  const userEmail = req.body;
  const token = jwt.sign(userEmail, process.env.ACCESS_KEY_TOKEN, {
    expiresIn: "3d",
  });
  res.send({ token });
});

app.listen(port, () => {
  console.log(`server is running on port, ${port}`);
});
