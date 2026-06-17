# Karaoke Room Management System

Hệ thống quản lý phòng karaoke được xây dựng theo mô hình **MVC (Model-View-Controller)**, sử dụng Node.js, Express, EJS và MongoDB.

## 1. Yêu cầu hệ thống

* **Node.js**: Phiên bản 16.x trở lên.
* **MongoDB**: Đã cài đặt và đang chạy (mặc định tại `mongodb://localhost:27017/`).

## 2. Hướng dẫn cài đặt

1. Giải nén hoặc tải mã nguồn về máy.
2. Mở Terminal (hoặc Command Prompt) tại thư mục gốc của dự án.
3. Cài đặt các gói thư viện cần thiết:
```bash
npm install

```
## 3. Cấu hình Cơ sở dữ liệu

1. Đảm bảo MongoDB đã khởi động.
2. Sử dụng MongoDB Compass, tạo một database tên là `karaokeDB`.
3. Trong database `karaokeDB`, tạo collection tên là `rooms` và thêm dữ liệu mẫu:
```json
{
  "roomNumber": "101",
  "capacity": 10,
  "status": "available",
  "pricePerHour": 200000,
  "features": ["TV", "Air Conditioner", "Sound System"]
}

```
## 4. Cách chạy dự án

Tại thư mục gốc của dự án, chạy lệnh sau:
```bash
node app.js

```
Server sẽ khởi chạy tại: `http://localhost:3000`

## 5. Hướng dẫn sử dụng
* 
**Danh sách đặt phòng**: Truy cập `http://localhost:3000/bookings` để xem danh sách, cập nhật hoặc xóa đặt phòng.
* 
**Thêm mới**: Nhấn vào nút "Add New Booking" để vào trang đặt phòng.
* 
*Lưu ý*: Hệ thống chỉ cho phép đặt phòng nếu `roomNumber` đã tồn tại trong database.
* 
**Tính năng tự động**: Hệ thống sẽ tự động tính `totalAmount` dựa trên thời gian bắt đầu, kết thúc và giá mỗi giờ.

## 6. Cấu trúc thư mục

* 
`/Models`: Định nghĩa Schema cho Room và Booking.

* 
`/Controllers`: Chứa logic xử lý nghiệp vụ.

* 
`/Views`: Chứa các file giao diện `.ejs`.

* `app.js`: File cấu hình và khởi chạy ứng dụng.