const mongoose = require('mongoose');

const CountSchema = new mongoose.Schema({ 
    boxNo: String,
    count: String,
    title: String,
    description: String
});

module.exports = mongoose.model('Count', CountSchema);
