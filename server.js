// Necessary imports
const app = require('./app.js');
const mongoose = require('mongoose')

let DB;
const PORT = process.env.PORT

// Setting DB varaible based on environment
if (process.env.ENV === "development") {
    DB = process.env.DB_DEV
} else {
    DB = process.env.DB_PROD
}

// DB conection
mongoose.connect(DB).then(()=>{
    console.log("DB connection successful!")
}).catch((err)=>{
    console.log("An error occured while connecting to the DB-", err)
});

// Running the server
app.listen(PORT, ()=>{
    console.log(`App running on port ${PORT}`)
});