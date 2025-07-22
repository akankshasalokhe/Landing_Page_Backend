const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("../config/db.js");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// If you serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/servicepage', require('../routes/servicePageRoute.js'));
app.use('/api/item', require('../routes/itemRoutes.js'));
app.use('/api/staticpage', require('../routes/staticPageRoutes.js'));
app.use('/api/testimonial', require('../routes/testimonialRoutes.js'));
app.use('/api/contentsection', require('../routes/contentSectionRoutes.js'));
app.use('/api/gallery', require('../routes/galleryRoutes.js'));
app.use('/api/categories', require('../routes/categoryRoutes.js'));
app.use('/api/footer', require('../routes/footerRoutes.js'));
app.use('/api/banner', require('../routes/bannerRoutes.js'));
app.use('/api/contact', require('../routes/contactUsRoutes.js'));
app.use('/api/serviceprovider', require('../routes/serviceProviderRoutes.js'));

app.get('/', (req, res) => {
  res.send('Welcome to the Backend API');
});

module.exports = app;
module.exports.handler = serverless(app);
