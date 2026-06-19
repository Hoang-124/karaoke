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
exports.getAddBooking = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.render('bookRoom', { booking: null, rooms, error: null });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// 3. CHỨC NĂNG THÊM MỚI ĐẶT PHÒNG (Xử lý dữ liệu)
// Nhận dữ liệu từ form, kiểm tra phòng có tồn tại không, tính tổng tiền và lưu vào cơ sở dữ liệu
exports.postAddBooking = async (req, res) => {
    const { customerName, roomNumber, startTime, endTime } = req.body;
    const rooms = await Room.find();

    // Validate inputs
    const errors = [];
    if (!customerName || customerName.trim() === '') {
        errors.push('Tên khách hàng không được để trống.');
    }
    if (!roomNumber || roomNumber.trim() === '') {
        errors.push('Vui lòng chọn phòng.');
    }

    const start = startTime ? new Date(startTime) : null;
    const end = endTime ? new Date(endTime) : null;

    if (!start || isNaN(start.getTime())) {
        errors.push('Thời gian bắt đầu không hợp lệ.');
    }
    if (!end || isNaN(end.getTime())) {
        errors.push('Thời gian kết thúc không hợp lệ.');
    }

    if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
        if (end <= start) {
            errors.push('Thời gian kết thúc phải sau thời gian bắt đầu.');
        }
    }

    // Tìm phòng trong DB để lấy đơn giá mỗi giờ
    let room = null;
    if (roomNumber) {
        room = await Room.findOne({ roomNumber });
        if (!room) {
            errors.push('Phòng không tồn tại!');
        }
    }

    if (errors.length > 0) {
        return res.render('bookRoom', {
            booking: { customerName, roomNumber, startTime, endTime },
            rooms,
            error: errors.join(' ')
        });
    }

    try {
        // Tính số giờ sử dụng = (thời gian kết thúc - thời gian bắt đầu) chuyển đổi sang giờ
        const hours = (end - start) / (1000 * 60 * 60);

        // Tạo bản ghi đặt phòng mới với tổng tiền tự động tính
        await Booking.create({
            customerName: customerName.trim(),
            roomNumber,
            startTime: start,
            endTime: end,
            totalAmount: hours * room.pricePerHour
        });
        res.redirect('/bookings'); // Lưu xong quay về trang danh sách
    } catch (err) {
        res.render('bookRoom', {
            booking: { customerName, roomNumber, startTime, endTime },
            rooms,
            error: err.message
        });
    }
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
    try {
        const booking = await Booking.findById(req.params.id);
        const rooms = await Room.find();
        res.render('updateRoom', { booking, rooms, error: null });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// 6. CHỨC NĂNG CẬP NHẬT ĐẶT PHÒNG (Xử lý dữ liệu)
// Nhận thông tin chỉnh sửa từ form, tìm lại phòng để lấy đơn giá, tính lại tổng tiền và cập nhật DB
exports.postUpdateBooking = async (req, res) => {
    const { customerName, roomNumber, startTime, endTime } = req.body;
    const rooms = await Room.find();
    const bookingId = req.params.id;

    // Validate inputs
    const errors = [];
    if (!customerName || customerName.trim() === '') {
        errors.push('Tên khách hàng không được để trống.');
    }
    if (!roomNumber || roomNumber.trim() === '') {
        errors.push('Vui lòng chọn phòng.');
    }

    const start = startTime ? new Date(startTime) : null;
    const end = endTime ? new Date(endTime) : null;

    if (!start || isNaN(start.getTime())) {
        errors.push('Thời gian bắt đầu không hợp lệ.');
    }
    if (!end || isNaN(end.getTime())) {
        errors.push('Thời gian kết thúc không hợp lệ.');
    }

    if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
        if (end <= start) {
            errors.push('Thời gian kết thúc phải sau thời gian bắt đầu.');
        }
    }

    // Tìm phòng để lấy đơn giá mới (trong trường hợp người dùng đổi sang số phòng khác)
    let room = null;
    if (roomNumber) {
        room = await Room.findOne({ roomNumber });
        if (!room) {
            errors.push('Phòng không tồn tại!');
        }
    }

    if (errors.length > 0) {
        return res.render('updateRoom', {
            booking: { _id: bookingId, customerName, roomNumber, startTime, endTime },
            rooms,
            error: errors.join(' ')
        });
    }

    try {
        // Tính lại số giờ sử dụng
        const hours = (end - start) / (1000 * 60 * 60);

        // Cập nhật lại thông tin đặt phòng trong cơ sở dữ liệu
        await Booking.findByIdAndUpdate(bookingId, {
            customerName: customerName.trim(),
            roomNumber,
            startTime: start,
            endTime: end,
            totalAmount: hours * room.pricePerHour
        });
        res.redirect('/bookings'); // Cập nhật xong quay về trang danh sách
    } catch (err) {
        res.render('updateRoom', {
            booking: { _id: bookingId, customerName, roomNumber, startTime, endTime },
            rooms,
            error: err.message
        });
    }
};