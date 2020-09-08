let express = require('express');
let mongodb = require('mongodb');


let app = express();
let db;
app.use(express.static('public')); //makes public folder usable as a static folder(no dynamic data creation)
let connectionString = 'mongodb+srv://todoappuser:27572757@cluster0.a8exk.mongodb.net/todoapp?retryWrites=true&w=majority'; // our mongodb account with password and database name

mongodb.connect(connectionString, {  //1. parameter connection string, 3. is callback which be called after the mongodb connection
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {
    db = client.db();
    app.listen(3000);
});

app.use(express.urlencoded({
    extended: false
}));


app.get('/', (req, res) => {
    //we can add a callback in toarray method so that can be loaded after db request.
    db.collection('items').find().toArray((err, items) => {
        //mongodb find method  to build a query. with blank value, it finds everthing
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id = "create-form" action="/create-item" method ="POST">
            <div class="d-flex align-items-center">
              <input id = "create-field" name = "item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
    ${items.map( item => {
        return `  <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
          <button data-id = ${item._id} class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
          <button data-id = ${item._id}  class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
      </li>`
    }).join('')}
        </ul>
        
      </div>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src = '/browser.js'></script>
    </body>
    </html>`)
})
});

app.post('/create-item', (req, res) => {
  console.log(req.body)
    db.collection('items').insertOne({
        text: req.body.item
    }, function () {
      console.log(req.body.item);
        res.redirect('/');
    });
});

app.post('/update-item', (req, res) => { //3 argument: first what to look for, 2. what to  update, what to do after 
  console.log(req.body);
  db.collection('items').findOneAndUpdate({_id: '5f2060df42983c37300d8f52'}, {$set: {text: req.body.text}}, function() {
    console.log(new mongodb.ObjectId(req.body.id));
    console.log(req.body);
    res.send("Success");
  })
})

app.post('/delete-item', (req, res) => {
  db.collection('items').deleteOne({_id: new require('mongodb').ObjectId(req.body.id)}, ()=> {
    console.log(req.body);
    res.send("Success");
  });
});