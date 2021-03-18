const express = require('express')
const morgan = require('morgan');
const userRouter = require('./routers/user')

const port = process.env.PORT
require('./db/db')




const app = express()

app.use(express.json())
app.use(morgan("dev"));
app.use(express.static('public')); // to serve static files
app.use(express.urlencoded({ extended: true }));
app.use(userRouter, (req, res, next) => {
    console.log("Hello world");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})