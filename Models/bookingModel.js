const mongoose = require('mongoose');

// Định nghĩa Schema cho Booking
const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true }, // 
    roomNumber: { type: String, required: true },   // 
    startTime: { type: Date, required: true },      // [cite: 23]
    endTime: { type: Date, required: true },        // [cite: 24]
    totalAmount: { type: Number, required: true }   // [cite: 25]
});

// Xuất model để sử dụng ở các file khác
module.exports = mongoose.model('Booking', bookingSchema);