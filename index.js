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

// Require uuid package which helps to create new IDs for every user;
const { v4: uuidv4 } = require("uuid");

// require method override which helps the client to send other types of requesr insted of post and get;
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

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
    id: uuidv4(),
  },
  {
    username: "Adam",
    content: "Own your own",
    img: "/Image/image-4.jpg",
    id: uuidv4(),
  },
  {
    username: "Bob",
    content: "Hey i am bob and this is my first blog",
    img: "/Image/image-3.jpg",
    id: uuidv4(),
  },
  {
    username: "Eve",
    content: "i just randomly upload!",
    img: "/Image/image-2.jpg",
    id: uuidv4(),
  },
];

// handle get request;
app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

// Second route where user add new blog and create new post ;
//! Step-1; where user add there details
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});
app.post("/posts", upload.single("image"), (req, res) => {
  let { username, content } = req.body;
  let id = uuidv4();
  //   Both line for user add image
  let img = "/Image/" + req.file.filename;
  let user = posts.unshift({ username, content, img, id });
  res.redirect("/posts");
});

//! Show routes Where other users check posts using IDs;
app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  if (!id) {
    res.render("error.ejs");
  } else {
    res.render("show.ejs", { post });
  }
});

//! Patch request where user edit there exist post and update new data;
app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let newContent = req.body.content;
  let post = posts.find((p) => id === p.id);
  post.content = newContent;
  res.redirect("/posts");
});

//! Edit route;
app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id == p.id);
  res.render("edit.ejs", { post });
});

//! Delete route;
app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => id !== p.id);
  res.redirect("/posts");
});
