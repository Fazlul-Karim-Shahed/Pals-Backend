


const express = require("express");
require("express-async-errors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const _ = require("lodash");
const path = require("path");
const AuthRouters = require("./Routers/AuthRouters");
const DepartmentRouters = require("./Routers/DepartmentRouters");

// ------------ Configuration ------------  //


dotenv.config();
const app = express();
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }))
app.options("*", cors({ origin: '*', optionsSuccessStatus: 200 }))
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(compression());


// Local DB
// mongoose.connect(process.env.MONGODB_LOCAL + '/Pals')
//     .then(data => console.log('Successfully connected to PALS MongoDB Local Server'))
//     .catch(data => {
//         console.log(data);
//         console.log('Something went wrong with MongoDB Local Server')
//     })


// ------------ Database ------------  //
const DB = process.env.MONGODB_DATABASE
mongoose.set("strictQuery", false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => console.log("Successfully connected to PALS MongoDB Remote Server!"))
  .catch((data) => {
    console.log("Something went wrong with MongoDB Server");
    console.log(data);
  });


// ------------ All Routers ------------ //




app.use('/api/uploads/:name', (req, res) => {
    res.sendFile(path.resolve('./uploads/' + req.params.name))
});

app.use('/api/auth', AuthRouters)
app.use('/api/department', DepartmentRouters)

app.get('/', (req, res) => res.sendFile(path.resolve('./Server.html')))


// Express async error handlers
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// ------------ Server ------------ //

const port = 4444
app.listen(port, () => {
    console.log('Server is running on port ' + port);
})

