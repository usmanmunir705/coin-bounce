const express = require('express')
const dbConnect = require('./database/index')
const {PORT} =  require('./config/index')
const router = require('./routes/index');
const errorHandler=require('./middleware/errorHandler')
const cookieParser=require('cookie-parser')
const app =express();
const cors = require('cors')

const corsOption={
    credentials:true,
    origin:['http://localhost:3000']
}

dbConnect();

app.use(express.urlencoded({extended:false}));

app.use(express.json({limit:'50mb'}));

app.use(cookieParser());

app.use(cors(corsOption)); // to attach frontend with backend

app.use(router);

app.use('/storage' , express.static('storage'));

app.use(errorHandler);

app.listen(PORT , console.log(`server started at port : ${PORT}`));