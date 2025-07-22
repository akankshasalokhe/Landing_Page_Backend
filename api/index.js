const dotenv=require('dotenv')
const express = require('express')
const connectDB=require('../config/db.js')
const serverless = require('serverless-http'); 
const path = require('path'); 


const itemRoutes=require('../routes/itemRoutes.js')
const staticPageRoutes=require('../routes/staticPageRoutes.js')
const servicePageRoutes=require('../routes/servicePageRoute.js')
const testimonialRoutes=require('../routes/testimonialRoutes.js')
const contentSectionRoutes=require('../routes/contentSectionRoutes.js')
const galleryRoutes=require('../routes/galleryRoutes.js')
const categoryRoutes = require('../routes/categoryRoutes.js')
const footerRoutes = require('../routes/footerRoutes.js')
const bannerRoutes = require('../routes/bannerRoutes.js')
const contactUsRoutes = require('../routes/contactUsRoutes.js')
const serviceProvideRoutes = require('../routes/serviceProviderRoutes.js')

const cors=require('cors')
dotenv.config()
connectDB()

const app=express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/servicepage',servicePageRoutes)
app.use('/api/item',itemRoutes)
app.use('/api/staticpage',staticPageRoutes)
app.use('/api/testimonial',testimonialRoutes)
app.use('/api/contentsection',contentSectionRoutes)
app.use('/api/gallery',galleryRoutes)
app.use('/api/categories',categoryRoutes)
app.use('/api/footer',footerRoutes)
app.use('/api/banner',bannerRoutes)
app.use('/api/contact', contactUsRoutes);
app.use('/api/serviceprovider',serviceProvideRoutes)

// app.use(express.json({ limit: '25mb' }));
// app.use(express.urlencoded({ limit: '1024mb', extended: true }));


app.get('/',(req,res)=>{
    res.send('Welcome to the Backend API')
})

// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });

module.exports = app;
module.exports.handler = serverless(app);
