const mongoose = require('mongoose');

// Định nghĩa Schema cho Karaoke Room
const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true }, //
    capacity: { type: Number, required: true },   //
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance'], //
        default: 'available'
    },
    pricePerHour: { type: Number, required: true }, //
    features: [String] //
});

// Xuất model để sử dụng ở các file khác
module.exports = mongoose.model('Room', roomSchema);