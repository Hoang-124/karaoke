require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bookingController = require('./Controllers/bookingController');

// Cấu hình thư mục chứa các file giao diện EJS
app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');

// Cấu hình middleware để đọc dữ liệu gửi lên từ form (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Kết nối đến cơ sở dữ liệu MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/karaokeDB';
mongoose.connect(mongoURI);

// --- ĐỊNH NGHĨA CÁC ĐƯỜNG DẪN (ROUTES) ---

// Trang chủ mặc định: tự động chuyển hướng sang trang danh sách đặt phòng
app.get('/', (req, res) => res.redirect('/bookings'));

// Xem danh sách đặt phòng
app.get('/bookings', bookingController.getAllBookings);

// Hiển thị form đặt phòng mới
app.get('/book-room', bookingController.getAddBooking);

// Xử lý gửi form đặt phòng mới
app.post('/book-room', bookingController.postAddBooking);

// Xử lý xóa lượt đặt phòng theo ID
app.post('/delete-booking/:id', bookingController.postDeleteBooking);

// Hiển thị form chỉnh sửa lượt đặt phòng theo ID
app.get('/update-booking/:id', bookingController.getUpdateBooking);

// Xử lý lưu thông tin chỉnh sửa lượt đặt phòng
app.post('/update-booking/:id', bookingController.postUpdateBooking);

// Khởi chạy server lắng nghe tại cổng PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));