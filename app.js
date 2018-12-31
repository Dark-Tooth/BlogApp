
//App Configuration
var express=require("express");
var app=express();
var mongoose=require("mongoose");
var body_parser=require("body-parser");
var expressSanitizer = require("express-sanitizer");
var method_override = require("method-override")
//mongoose.connect("mongodb://localhost/blog_app", {useNewUrlParser: true});
mongoose.connect("mongodb://amir:admin101@ds145704.mlab.com:45704/blog_app",{useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(body_parser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(method_override("_method"));

//Mongoose/model configuration
var blog_schema=new mongoose.Schema({
    title:String,
    image:{type:String},
    body:String,
    created:{type:Date,default:Date.now()}
});
var Blog=mongoose.model("Blog",blog_schema);

/*Blog.create({
    title:'test2 Blog',
    image:'https://www.holidify.com/blog/wp-content/uploads/2016/08/Banjara-camp.jpg',
    body:"Posted"
},function(err,blogf)
{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("Data Successfully entered");
    }
});*/
//Routes
app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

//index route
app.get("/blogs",function(req,res)
{
 
    Blog.find({},function(err,blogs)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(blogs);
            res.render("index",{blogs:blogs});
        }
    })
    
})

//new route

app.get("/blogs/new",function(req,res)
{
    console.log("up");
    res.render("new");
})

//create route
app.post("/blogs", function(req, res){
    // create blog
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("===========")
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});
//Show Route
app.get("/blogs/:id",function(req,res)
{
   Blog.findById(req.params.id,function(err,found_blog)
   {
       if(err)
       {
           res.redirect("/blogs");
       }
       else
       {
           res.render("show",{blog:found_blog});
       }
   })
    
})
//Edit route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
})

//update route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

//delete route
app.delete("/blogs/:id", function(req, res){

  Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   });
});

app.listen(process.env.PORT,process.env.IP,function()
{
    console.log("Server has Started");
})