const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Model = require('./models');
const bcrypt = require('bcrypt');
require('dotenv/config');


app.use(express.json());


// static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))

app.set('view-engine', 'ejs')

// to read input from forms
app.use(express.urlencoded({ extended: false}))


app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/hello', (req, res) => {
    res.render('hello.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/login', async(req, res) => {

    const valmodel = await Model.findOne({email: req.body.email});
    if(!valmodel) return res.status(400).json({
        error: 'invalid email id'
    });
    const valpass = await bcrypt.compare(req.body.password, valmodel.password);
    if(!valpass) return res.status(400).json({
        error: 'invalid password'
    });

    res.end('{"success" : "Updated Successfully", "status" : 200}');
      
});    

app.post('/register', async(req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    Model.find({email: req.body.email})
      .exec()
      .then(model => {
          if (model.length >= 1){

              return res.status(409).json({
                  error: 'Email id already in use'
              });

            }else {

                const model = new Model({
                
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword
                });

                try{
                    const savedModel = model.save();
                    res.json(savedModel);
                }catch (err) {
                    res.json({ message: err });
                }
            }    
        })   
});



// Connect to DB

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
  } = process.env;
  
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
    //reconnectTries: Number.MAX_VALUE,
    //reconnectInterval: 500,
    //connectTimeoutMS: 10000,
  };
  
  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
  
  mongoose.connect(url, options).then( function() {
    console.log('MongoDB is connected');
  })
    .catch( function(err) {
    console.log(err);
  });


/*mongoose.connect(process.env.DB_CONNECTION, 
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log('connect to DB!'))*/


// start listening to server
app.listen(3000);