const Room = require('../Models/roomModel');
const Booking = require('../Models/bookingModel');

// 1. CHỨC NĂNG XEM DANH SÁCH ĐẶT PHÒNG
// Lấy toàn bộ danh sách đặt phòng từ cơ sở dữ liệu và hiển thị ra giao diện list (booking.ejs)
exports.getAllBookings = async (req, res) => {
    const bookings = await Booking.find();
    res.render('booking', { bookings });
};

// 2. CHỨC NĂNG THÊM MỚI ĐẶT PHÒNG (Giao diện)
// Hiển thị giao diện form để người dùng điền thông tin đặt phòng mới (bookRoom.ejs)
exports.getAddBooking = (req, res) => res.render('bookRoom', { booking: null });

// 3. CHỨC NĂNG THÊM MỚI ĐẶT PHÒNG (Xử lý dữ liệu)
// Nhận dữ liệu từ form, kiểm tra phòng có tồn tại không, tính tổng tiền và lưu vào cơ sở dữ liệu
exports.postAddBooking = async (req, res) => {
    const { customerName, roomNumber, startTime, endTime } = req.body;
    // Tìm phòng trong DB để lấy đơn giá mỗi giờ
    const room = await Room.findOne({ roomNumber });
    if (!room) return res.send('Phòng không tồn tại!'); // Nếu không tìm thấy phòng, báo lỗi
    
    // Tính số giờ sử dụng = (thời gian kết thúc - thời gian bắt đầu) chuyển đổi sang giờ
    const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    
    // Tạo bản ghi đặt phòng mới với tổng tiền tự động tính
    await Booking.create({ customerName, roomNumber, startTime, endTime, totalAmount: hours * room.pricePerHour });
    res.redirect('/bookings'); // Lưu xong quay về trang danh sách
};

// 4. CHỨC NĂNG XÓA ĐẶT PHÒNG
// Xóa lượt đặt phòng trong cơ sở dữ liệu dựa trên ID được truyền qua URL
exports.postDeleteBooking = async (req, res) => {
    await Booking.findByIdAndDelete(req.params.id);
    res.redirect('/bookings'); // Xóa xong quay về trang danh sách
};

// 5. CHỨC NĂNG CẬP NHẬT ĐẶT PHÒNG (Giao diện)
// Lấy thông tin đặt phòng cũ theo ID và hiển thị lên form chỉnh sửa (updateRoom.ejs)
exports.getUpdateBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    res.render('updateRoom', { booking });
};

// 6. CHỨC NĂNG CẬP NHẬT ĐẶT PHÒNG (Xử lý dữ liệu)
// Nhận thông tin chỉnh sửa từ form, tìm lại phòng để lấy đơn giá, tính lại tổng tiền và cập nhật DB
exports.postUpdateBooking = async (req, res) => {
    const { customerName, roomNumber, startTime, endTime } = req.body;
    // Tìm phòng để lấy đơn giá mới (trong trường hợp người dùng đổi sang số phòng khác)
    const room = await Room.findOne({ roomNumber });
    if (!room) return res.send('Phòng không tồn tại!');
    
    // Tính lại số giờ sử dụng
    const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    
    // Cập nhật lại thông tin đặt phòng trong cơ sở dữ liệu
    await Booking.findByIdAndUpdate(req.params.id, { customerName, roomNumber, startTime, endTime, totalAmount: hours * room.pricePerHour });
    res.redirect('/bookings'); // Cập nhật xong quay về trang danh sách
};