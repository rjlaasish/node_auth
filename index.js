const express = require("express");
const cors = require("cors");
const bp = require("body-parser");
const { success, error } = require("consola");
const passport=require('passport');


// Importing the constants
const { DB, PORT } = require("./config");
const { connect } = require("mongoose");

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());

require('./middlewares/passport')(passport);

// User router middleware
app.use('/api/users',require('./routes/users'));


const startApp=async ()=>{
try{
    // Connection to db
    await connect(DB, { useNewUrlParser: true, useUnifiedTopology: true });
   
    success({ message: "Mongodb connected", badge: true });
     
    // Start listening to server
    app.listen(PORT, () => {
        success({ message: `Server started on PORT ${PORT}`, badge: true });
      });
}catch(err){
    error({ message: "Error occured connecting to db" });
//    If error occured again start the app
    startApp();
}
  
}

startApp();



    