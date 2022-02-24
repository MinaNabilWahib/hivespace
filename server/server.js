const express = require("express");
// const morgan = require('morgan');
// const cors = require("cors");
// const body_parser = require("body-parser");
// const mongoose = require("mongoose");



//create server
const app = express();

//listen on port number
app.listen(process.env.PORT || 8080, () => {
    console.log("I am live and listening...");
    // console.log(process.env.NODE_MODE);
});


//todo middlewares 