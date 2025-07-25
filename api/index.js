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

// Handle large payloads
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

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
app.use('/api/earning',require('../routes/EarningInfoRoutes.js'))
app.use('/api/partners',require('../routes/partnerRoutes.js'))
app.use('/api/counts',require('../routes/countRoutes.js'))
app.use('/api/benifits',require('../routes/benifitRoutes.js'))
app.use('/api/video',require('../routes/videoRoutes.js'))
// app.use('/api/nationwide',require('../routes/nationwideRoutes.js'))
// app.use('/api/partner-section',require('../routes/partnerSectionRoutes.js'))

app.get('/', (req, res) => {
  res.send('Welcome to the Backend API');
});

module.exports = app;
module.exports.handler = serverless(app);
