require("dotenv").config();
let express = require("express");
let sanitizeHTML = require("sanitize-html");
const mongodb = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectId;
let app = express();
let db;

app.use(express.static("public"));
let connectionString = process.env.STRING;
mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    if (err) throw err;
    else {
      db = client.db("mytodoapp");
      const port = process.env.PORT || 4000;
      app.listen(port, (req, res) => {
        console.log(`app is running on port ${port}`);
      });
    }
  }
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function passwordProtected(req, res, next) {
  res.set("WWW-Authenticate", 'Basic realm="Simple todo app"');
  console.log(req.headers.authorization);
  if (req.headers.authorization == "Basic bWVldGE6aGFsZGFy") {
    //meeta haldar
    next();
  } else {
    res.status(401).send("authentication required");
  }
}

// app.use(passwordProtected);

app.get("/", function (req, res) {
  db.collection("products")
    .find()
    .toArray(function (err, products) {
      res.send(
        `<!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  </head>
  <body>
  <div class="container">
  <h1 class="display-6 text-center py-1">To-Do App</h1>
  
  <div class="jumbotron p-3 shadow-sm">
  <form  id="create-form" action="/create-item" method="POST">
  <div class="d-flex align-items-center">
  <input  id ="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
  <button id = "add"class="btn btn-primary">Add New Item</button>
  </div>
  </form>
  </div>
  
  <ul id="item-list" class="list-group pb-5">
  
  </ul>
  
  </div>

<script> 
let items =${JSON.stringify(products)}
</script>

  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

  <script src ="/browser.js"></script>
  </body>
  </html>`
      );
    });
});

app.post("/create-item", function (req, res) {
  if (req.body.text) {
    let safeText = sanitizeHTML(req.body.text, {
      allowedTags: [],
      allowedAttributes: {},
    });
    let date = sanitizeHTML(req.body.date);
    db.collection("products").insertOne(
      { text: safeText, date: date },
      function (err, info) {
        data = { text: safeText, date: date, _id: info.insertedId };
        res.json(data);
      }
    );
  }
});

app.post("/update-item", function (req, res) {
  let safeText = sanitizeHTML(req.body.text, {
    allowedTags: [],
    allowedAttributes: {},
  });
  db.collection("products").findOneAndUpdate(
    { _id: ObjectId(req.body.id) },
    { $set: { text: safeText } },
    function () {
      res.send("success");
    }
  );
});

app.post("/delete-item", function (req, res) {
  db.collection("products").deleteOne(
    { _id: ObjectId(req.body.id) },
    function () {
      res.send("success");
    }
  );
});

module.exports = app;
