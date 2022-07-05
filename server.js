const exp = require('express');
const bd = require('body-parser');
const mongoose = require("mongoose");
const path = __dirname + "/view/"
const Post = require("./model/BlogSchema");

const port = 5000;
const app = exp()
app.set('view engine', 'ejs')


app.use(bd.urlencoded({ extended: true }))
app.use(bd.json())

app.use(exp.static('public'));
//monogoDB connections
mongoose.connect('mongodb+srv://an786:Nsawa783.@cluster0.c1km1ao.mongodb.net/?retryWrites=true&w=majority', (err, client) => {
console.log("databse connect")

  //insert data in monogoDB
  app.post("/quotes", (req, res) => {
    var post = new Post({
      title: req.body.title,
      description: req.body.descriptions,
      author: req.body.author,
      image: req.body.photo,
      createdDate: req.body.date,
      category: req.body.category
    })
    post.save(() => {
      console.log("Data Insersted")
      res.redirect('/create')
    })
  })
  // routes for css
  app.get('/', (req, res) => {
    Post.find({}, ((err, result) => {
     // console.log(result)
     res.render(path + 'index.ejs', { quotes: result })

    }))
  })//indexpage

  //blog  routes
  app.get('/blog', (req, res) => {
    Post.find({}, ((err, result) => {

      res.render(path + 'Blogs.ejs', { quotes: result })

    }))
  })

  // details routes
  app.get('/details/:id', (req, res) => {
    Post.findById(req.params.id, ((err, result) => {
    res.render(path + "details.ejs", { quotes: result })
    }))

  })

  // create post routes
  app.get('/create', (req, res) => {
    res.render(path + "createpost.ejs")

  })

  // edit post routes
  app.get('/details/edit/:id', (req, res) => {
    Post.findById(req.params.id, ((err, result) => {
     res.render(path + "Edit.ejs", { quotes: result })
    }))

  })
  //  delete post routes
  app.get('/details/delete/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/blog')

  })

  // update routes
  app.post('/update/:id',async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id,req.body);
    res.redirect('/blog')
    //console.log(req.params.id)

  })


  // search routes
  app.get('/search', async (req, res) => {
    var userSearch = req.query.search;
    let data = await Post.find(
      {
        "$or": [
          { "category": { $regex: req.query.search } },
          { "title": { $regex: req.query.search } }
        ]

      }
    )
  res.render(path + "search.ejs", { quotes: data, searchData: userSearch })
     
  })
  //  browser port ruuning localhost:5000
  app.listen(port, function () {
    console.log("server running")
  })

})



