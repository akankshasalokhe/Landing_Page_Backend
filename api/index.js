const dotenv=require('dotenv')
const express = require('express')
const connectDB=require('../config/db.js')
const serverless = require('serverless-http'); 

const itemRoutes=require('../routes/itemRoutes.js')
const staticPageRoutes=require('../routes/staticPageRoutes.js')
const servicePageRoutes=require('../routes/servicePageRoute.js')
const testimonialRoutes=require('../routes/testimonialRoutes.js')
const contentSectionRoutes=require('../routes/contentSectionRoutes.js')

const cors=require('cors')
dotenv.config()
connectDB()

const app=express()
app.use(cors())
app.use(express.json())

app.use('/api/servicepage',servicePageRoutes)
app.use('/api/item',itemRoutes)
app.use('/api/staticpage',staticPageRoutes)
app.use('/api/testimonial',testimonialRoutes)
app.use('/api/contentsection',contentSectionRoutes)

app.get('/',(req,res)=>{
    res.send('Welcome to the Backend API')
})

module.exports = app;
module.exports.handler = serverless(app);
