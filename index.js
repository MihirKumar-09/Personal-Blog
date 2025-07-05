// Require express;
const express = require("express");
// Store it in n variable;
const app = express();
// Create a port;
const port = 8080;
// Require path for safe path;
const path = require("path");
// Handle HTTP Request;
app.use(express.urlencoded({ extended: true }));
// Set View Engine;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Serve static file;
app.use(express.static(path.join(__dirname, "public")));
// Use listen method to handle incoming request on server;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

// Require for handle teh images which user upload
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/Image"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });
// Currently we don't have database so we use array and store basic info;
let posts = [
  {
    username: "Mihir",
    content: "Smile add value in any outfits :)",
    img: "/Image/image-1.jpg",
    id: "mihir",
  },
  {
    username: "Adam",
    content: "Own your own",
    img: "/Image/image-4.jpg",
    id: "adam",
  },
  {
    username: "Bob",
    content: "Hey i am bob and this is my first blog",
    img: "/Image/image-3.jpg",
    id: "bob",
  },
  {
    username: "Eve",
    content: "i just randomly upload!",
    img: "/Image/image-2.jpg",
    id: "eve",
  },
];

// handle get request;
app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

// Second route where user add new blog ;
//! Step-1; where user add there details
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});
app.post("/posts", upload.single("image"), (req, res) => {
  let { username, content } = req.body;
  //   Both line for user add image
  let img = "/Image/" + req.file.filename;
  posts.unshift({ username, content, img });
  res.redirect("/posts");
});
