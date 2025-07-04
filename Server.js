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
const CategoryRouters = require("./Routers/CategoryRouters");
const BrandRouters = require("./Routers/BrandRouters");
const SubBrandRouters = require("./Routers/SubBrandRouters");
const SubCategoryRouters = require("./Routers/SubCategoryRouters");
const BatchRouters = require("./Routers/BatchRouters");
const ProductRouters = require("./Routers/ProductRouters");
const OrderRouters = require("./Routers/OrderRouters");
const CourierRouters = require("./Routers/CourierRouters");
const ProfileRouters = require("./Routers/ProfileRouters");
const ExpenseRouters = require("./Routers/ExpenseRouters");
const ImageSliderRouters = require("./Routers/ImageSliderRouters");
const FileRouters = require("./Routers/FileRouters");
const EventRouters = require("./Routers/EventRouters");
const PromoRouters = require("./Routers/PromoRouters");
const cron = require("node-cron");
const axios = require("axios");

// ------------ Configuration ------------  //

dotenv.config();
const app = express();
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.options("*", cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(compression());

// Local DB
// mongoose.connect(process.env.MONGODB_LOCAL + '/Pals')
//   .then(data => console.log('Successfully connected to PALS MongoDB Local Server.'))
//   .catch(data => {
//     console.log(data);
//     console.log('Something went wrong with MongoDB Local Server')
//   })

// console.log(`Database: ${data.connections[0].name}. \n Host: ${data.connections[0].host}. \n Port: ${data.connections[0].port}. \n URI: ${data.connections[0].host}:${data.connections[0].port}/${data.connections[0].name}. \n Models:`, data.models, `\n Successfully connected to PALS MongoDB Local Server.`)

// ------------ Database ------------  //
const DB = process.env.MONGODB_DATABASE;
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

app.use("/api/uploads/:name", (req, res) => {
    res.sendFile(path.resolve("./uploads/" + req.params.name));
});

app.use("/api/auth", AuthRouters);
app.use("/api/department", DepartmentRouters);
app.use("/api/category", CategoryRouters);
app.use("/api/brand", BrandRouters);
app.use("/api/sub-brand", SubBrandRouters);
app.use("/api/sub-category", SubCategoryRouters);
app.use("/api/batch", BatchRouters);
app.use("/api/product", ProductRouters);
app.use("/api/order", OrderRouters);
app.use("/api/courier", CourierRouters);
app.use("/api/profile", ProfileRouters);
app.use("/api/expense", ExpenseRouters);
app.use("/api/files", FileRouters);
app.use("/api/slider", ImageSliderRouters);
app.use("/api/event", EventRouters);
app.use("/api/promo", PromoRouters);

app.get("/", (req, res) => res.sendFile(path.resolve("./Server.html")));

// Express async error handlers
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// ------------ Server ------------ //

const port = 4444;

cron.schedule("*/13 * * * *", async () => {
    try {
        const response = await axios.get("https://pals-backend.onrender.com");
        console.log("Server is up and running:");
    } catch (error) {
        console.error("Error hitting server:", error.message);
    }
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
