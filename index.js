const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/blogsDB').then(()=>{console.log("connected to mongoose")});

let Blog = mongoose.model("blog",{
    author : String,
    source : String,
    title : String,
    content : String,
    topic : String,
    date : String
});

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/blogs.html");
});

app.post("/blog",function(req,res){
    let query = req.body.query;
    Blog.find({topic:query}).then((blogData)=>{
         res.send(blogData);
    });
});


app.post("/adminlogin",function(req,res){
    let email = req.body.email;
    let password = req.body.password;

    if((email === "blogpostadmin@gmail.com") && (password === "blogpost") ){
        res.redirect("/addblogs");
    }else{
        res.sendFile(__dirname + "/loginfail.html");
    }
});

app.get("/adminlogin",function(req,res){
    res.sendFile(__dirname + "/adminlogin.html");
});

app.get("/addblogs",function(req,res){
    res.sendFile(__dirname + "/addblogs.html");
});

app.post("/blogauth",function(req,res){
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let blogDate = day + "-" + month + "-" + year;


    let newBlog = new Blog({
    author : req.body.author_name,
    title : req.body.title,
    source : req.body.source,
    content : req.body.content,
    topic : req.body.selectTopic,
    date : blogDate
    });


    newBlog.save().then(()=>{
            console.log("saved successfully");
    });
});

app.listen(3000,function(){
    console.log("Connected to port 3000.");
});