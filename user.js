// Biến toàn cục để lưu thông tin người dùng
let currentUser = null;

// Load thông tin người dùng khi trang được tải
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Lấy thông tin người dùng trước
        const response = await fetch('user_api.php?action=getUserInfo');
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            // Chỉ hiển thị dashboard sau khi đã có thông tin người dùng
            await showDashboard();
        } else {
            // Nếu không có thông tin người dùng, chuyển về trang đăng nhập
            window.location.href = 'index.php';
        }
    } catch (error) {
        console.error('Error loading user info:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.'
        }).then(() => {
            window.location.href = 'index.php';
        });
    }
});

// Hàm lấy thông tin người dùng
async function loadUserInfo() {
    try {
        const response = await fetch('user_api.php?action=getUserInfo');
        const data = await response.json();
        if (data.success) {
            currentUser = data.user;
        } else {
            window.location.href = 'index.php'; // Chuyển về trang đăng nhập nếu không có session
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

// Hiển thị dashboard
async function showDashboard() {
    const mainContent = document.getElementById('mainContent');
    try {
        const response = await fetch('user_api.php?action=getDashboardInfo');
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message);
        }

        mainContent.innerHTML = `
            <div class="dashboard">
                <h2>Xin chào, ${data.user?.username || 'Sinh viên'}</h2>
                <div class="info-cards">
                    <div class="card room-info-card">
                        <h3><i class="fas fa-bed"></i> Thông Tin Phòng</h3>
                        ${data.room ? `
                            <div class="info-content">
                                <p><strong>Phòng:</strong> ${data.room.number}</p>
                                <p><strong>Tòa:</strong> ${data.room.building}</p>
                                <p><strong>Giá phòng:</strong> ${formatPrice(data.room.price)}đ/học kỳ</p>
                            </div>
                            <div class="room-actions">
                                <button class="view-details-btn" onclick="showRoomDetails('${data.room.id}')">
                                    Xem chi tiết
                                </button>
                                <button class="cancel-registration-btn" onclick="cancelRegistration()">
                                    <i class="fas fa-times"></i> Hủy đăng ký
                                </button>
                            </div>
                        ` : `
                            <div class="empty-state">
                                <p>Chưa đăng ký phòng</p>
                                <button onclick="showRoomRegistration()">Đăng ký ngay</button>
                            </div>
                        `}
                    </div>
                    
                    <div class="card payment-info-card">
                        <h3><i class="fas fa-money-bill-wave"></i> Thanh Toán</h3>
                        ${data.payment ? `
                            <div class="info-content">
                                <p><strong>Trạng thái:</strong> 
                                    <span class="payment-status ${data.payment.status}">
                                        ${getPaymentStatusText(data.payment.status)}
                                    </span>
                                </p>
                                <p><strong>Học kỳ:</strong> ${data.payment.semester}</p>
                                <p><strong>Số tiền:</strong> ${formatPrice(data.payment.amount)}đ</p>
                            </div>
                        ` : `
                            <div class="empty-state">
                                <p>Chưa có thông tin thanh toán</p>
                                ${data.room ? `
                                    <button onclick="showPaymentInfo()">Xem thông tin thanh toán</button>
                                ` : ''}
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading dashboard:', error);
        mainContent.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Có lỗi xảy ra khi tải thông tin</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Hàm hỗ trợ format trạng thái thanh toán
function getPaymentStatusText(status) {
    const statusMap = {
        'pending': 'Chờ thanh toán',
        'completed': 'Đã thanh toán',
        'overdue': 'Quá hạn'
    };
    return statusMap[status] || status;
}

// Hiển thị form đăng ký phòng
async function showRoomRegistration() {
    const mainContent = document.getElementById('mainContent');
    try {
        const response = await fetch('user_api.php?action=getAvailableRooms');
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message);
        }

        let html = `
            <div class="room-registration">
                <h2>Đăng Ký Phòng</h2>
                <div class="building-sections">
        `;

        // Kiểm tra nếu không có phòng nào
        if (!data.rooms || Object.keys(data.rooms).length === 0) {
            html += `
                <div class="empty-state">
                    <p>Hiện tại không có phòng trống</p>
                </div>
            `;
        } else {
            // Hiển thị phòng theo từng tòa nhà
            for (const [building, rooms] of Object.entries(data.rooms)) {
                html += `
                    <div class="building-section">
                        <h3>Tòa ${building}</h3>
                        <div class="room-grid">
                            ${rooms.map(room => `
                                <div class="room-card">
                                    <div class="room-status ${room.status}">
                                        ${getStatusText(room.status)}
                                    </div>
                                    <h4>Phòng ${room.number}</h4>
                                    <div class="room-info">
                                        <p><i class="fas fa-users"></i> Số người: ${room.current_occupants}/${room.max_occupants}</p>
                                        <p><i class="fas fa-money-bill"></i> Giá: ${formatPrice(room.price)}đ/học kỳ</p>
                                    </div>
                                    <button type="button" 
                                            onclick="confirmRegistration('${room.id}', '${room.number}', ${room.price})"
                                            class="register-btn">
                                        Đăng ký
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }

        html += `
                </div>
            </div>
        `;

        mainContent.innerHTML = html;
    } catch (error) {
        console.error('Error loading rooms:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể tải danh sách phòng: ' + error.message
        });
    }
}

// Hàm xác nhận đăng ký phòng
async function confirmRegistration(roomId, roomNumber, price) {
    // Kiểm tra xem đã có thông tin người dùng chưa
    if (!currentUser) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Vui lòng đăng nhập lại để tiếp tục'
        }).then(() => {
            window.location.href = 'index.php';
        });
        return;
    }

    try {
        // Bước 1: Form nhập thông tin
        const { value: formData } = await Swal.fire({
            title: 'Thông tin đăng ký',
            html: `
                <div class="registration-info">
                    <p><strong>Mã sinh viên:</strong> ${currentUser.username}</p>
                    <p><strong>Email:</strong> ${currentUser.email}</p>
                </div>
                <form id="registrationForm">
                    <div class="form-group">
                        <label for="phone">Số điện thoại:</label>
                        <input type="tel" id="phone" class="swal2-input" placeholder="Nhập số điện thoại">
                    </div>
                    <div class="form-group">
                        <label for="faculty">Khoa:</label>
                        <input type="text" id="faculty" class="swal2-input" placeholder="Nhập tên khoa">
                    </div>
                </form>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Tiếp tục',
            cancelButtonText: 'Hủy',
            preConfirm: () => {
                const phone = document.getElementById('phone').value;
                const faculty = document.getElementById('faculty').value;
                
                if (!phone || !faculty) {
                    Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin');
                    return false;
                }
                
                if (!/^[0-9]{10}$/.test(phone)) {
                    Swal.showValidationMessage('Số điện thoại không hợp lệ');
                    return false;
                }

                return { phone, faculty };
            }
        });

        if (!formData) return; // Người dùng đã hủy

        // Bước 2: Xác nhận thông tin
        const result = await Swal.fire({
            title: 'Xác nhận đăng ký',
            html: `
                <div class="confirmation-details">
                    <p><strong>Phòng:</strong> ${roomNumber}</p>
                    <p><strong>Giá phòng:</strong> ${formatPrice(price)}đ/học kỳ</p>
                    <p><strong>Mã sinh viên:</strong> ${currentUser.username}</p>
                    <p><strong>Số điện thoại:</strong> ${formData.phone}</p>
                    <p><strong>Khoa:</strong> ${formData.faculty}</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận đăng ký',
            cancelButtonText: 'Hủy'
        });

        if (!result.isConfirmed) return;

        // Bước 3: Gửi đăng ký
        const response = await fetch('user_api.php?action=registerRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomId: roomId,
                phone: formData.phone,
                faculty: formData.faculty
            })
        });

        const responseData = await response.json();

        if (responseData.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Đăng ký phòng thành công!'
            });
            showDashboard();
        } else {
            throw new Error(responseData.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: error.message || 'Có lỗi xảy ra khi đăng ký phòng'
        });
    }
}

// Các hàm hỗ trợ
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

function getStatusText(status) {
    const statusMap = {
        'available': 'Còn trống',
        'occupied': 'Đã đủ người',
        'maintenance': 'Đang bảo trì'
    };
    return statusMap[status] || status;
}

// Các hàm điều khiển giao diện
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    sidebar.classList.toggle('open');
    
    if (sidebar.classList.contains('open')) {
        hamburgerMenu.style.display = 'none';
    } else {
        hamburgerMenu.style.display = 'flex';
    }
}

// Hàm đăng xuất
async function logout() {
    try {
        const response = await fetch('user_api.php?action=logout');
        const result = await response.json();
        if (result.success) {
            window.location.href = 'index.php';
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Thêm hàm hủy đăng ký
async function cancelRegistration() {
    try {
        const result = await Swal.fire({
            title: 'Xác nhận hủy đăng ký',
            text: 'Bạn có chắc chắn muốn hủy đăng ký phòng không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có, hủy đăng ký',
            cancelButtonText: 'Không'
        });

        if (result.isConfirmed) {
            const response = await fetch('user_api.php?action=cancelRegistration', {
                method: 'POST'
            });
            const data = await response.json();

            if (data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đã hủy đăng ký phòng'
                });
                showDashboard(); // Cập nhật lại dashboard
            } else {
                throw new Error(data.message);
            }
        }
    } catch (error) {
        console.error('Cancel registration error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: error.message || 'Có lỗi xảy ra khi hủy đăng ký'
        });
    }
}
