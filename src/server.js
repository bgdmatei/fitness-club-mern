const express = require("express");
const cors = require("cors");
const app = express();
const UserController = require("./controllers/UserController");

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from express");
});

<<<<<<< HEAD
app.post("/register", UserController.store);

try {
  mongoose.connect(process.env.MONGO_DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");
} catch (error) {
  console.log(error);
}

=======
>>>>>>> parent of 2905129... mongoDB setup
app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});
