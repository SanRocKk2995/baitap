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
        
        // Kiểm tra response status
        if (!response.ok) {
            if (response.status === 401) {
                // Session hết hạn
                window.location.href = 'index.php';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Kiểm tra response type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid response format');
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Unknown error occurred');
        }

        // Kiểm tra trạng thái thanh toán tiền phòng tháng này
        const currentDate = new Date();
        const currentMonth = `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        const needNewPayment = !data.payment || data.payment.payment_month !== currentMonth;

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
                                <p><strong>Giá phòng:</strong> ${formatPrice(data.room.price)}đ/tháng</p>
                            </div>
                            <div class="room-actions">
                                ${needNewPayment ? `
                                    <button class="payment-btn" onclick="makePayment('${data.room.id}', ${data.room.price})">
                                        <i class="fas fa-money-bill"></i> Thanh toán tiền phòng tháng ${currentDate.getMonth() + 1}
                                    </button>
                                ` : `
                                    <button class="payment-btn" disabled style="background-color: #ccc;">
                                        <i class="fas fa-check"></i> Đã thanh toán tháng này
                                    </button>
                                `}
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
                        <h3><i class="fas fa-money-bill"></i> Thông Tin Thanh Toán</h3>
                        ${data.payment ? `
                            <div class="info-content">
                                <p><strong>Trạng thái:</strong> 
                                    <span class="payment-status ${data.payment.status}">
                                        ${getPaymentStatusText(data.payment.status)}
                                    </span>
                                </p>
                                <p><strong>Tháng:</strong> ${data.payment.payment_month || 'Chưa có thông tin'}</p>
                                <p><strong>Số tiền:</strong> ${formatPrice(data.payment.amount)}đ</p>
                            </div>
                            <button class="view-history-btn" onclick="showPaymentHistory()">
                                <i class="fas fa-history"></i> Xem lịch sử
                            </button>
                        ` : `
                            <div class="empty-state">
                                <p>Chưa có thông tin thanh toán</p>
                            </div>
                        `}
                    </div>
                    
                    <div class="card utility-info-card">
                        <h3><i class="fas fa-bolt"></i> Tiện ích Tháng ${data.utilities?.month || '--'}/${data.utilities?.year || '--'}</h3>
                        ${data.utilities ? `
                            <div class="info-content">
                                <div class="utility-item">
                                    <span><i class="fas fa-bolt"></i> Điện:</span>
                                    <div>
                                        <p>${data.utilities.electricity_usage} kWh</p>
                                        <p class="fee">${formatPrice(data.utilities.electricity_fee)}đ</p>
                                    </div>
                                </div>
                                <div class="utility-item">
                                    <span><i class="fas fa-water"></i> Nước:</span>
                                    <div>
                                        <p>${data.utilities.water_usage} m³</p>
                                        <p class="fee">${formatPrice(data.utilities.water_fee)}đ</p>
                                    </div>
                                </div>
                                <div class="utility-item">
                                    <span><i class="fas fa-wifi"></i> Internet:</span>
                                    <div>
                                        <p class="fee">${formatPrice(data.utilities.internet_fee)}đ</p>
                                    </div>
                                </div>
                                <div class="utility-total">
                                    <strong>Tổng cộng:</strong>
                                    <strong>${formatPrice(
                                        data.utilities.electricity_fee + 
                                        data.utilities.water_fee + 
                                        data.utilities.internet_fee
                                    )}đ</strong>
                                </div>
                            </div>
                            <div class="utility-actions">
                                ${data.utilities.status === 'paid' ? `
                                    <button class="payment-btn" disabled style="background-color: #ccc;">
                                        <i class="fas fa-check"></i> Đã thanh toán
                                    </button>
                                ` : `
                                    <button class="payment-btn" onclick="makeUtilityPayment(
                                        ${data.utilities.electricity_fee},
                                        ${data.utilities.water_fee},
                                        ${data.utilities.internet_fee}
                                    )">
                                        <i class="fas fa-money-bill"></i> Thanh toán tiện ích
                                    </button>
                                `}
                            </div>
                        ` : `
                            <div class="empty-state">
                                <p>Chưa có thông tin tiện ích tháng này</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Dashboard error:', error);
        
        // Hiển thị thông báo lỗi chi tiết hơn
        mainContent.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Có lỗi xảy ra khi tải thông tin</p>
                <p>${error.message}</p>
                <button onclick="location.reload()" class="retry-btn">
                    <i class="fas fa-sync"></i> Thử lại
                </button>
            </div>
        `;

        // Nếu là lỗi session, chuyển hướng về trang đăng nhập
        if (error.message.includes('đăng nhập')) {
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 2000);
        }
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
                                        <p><i class="fas fa-money-bill"></i> Giá: ${formatPrice(room.price)}đ/tháng</p>
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
    try {
        // Xác nhận đăng ký
        const result = await Swal.fire({
            title: 'Xác nhận đăng ký',
            html: `
                <div class="confirmation-details">
                    <p><strong>Phòng:</strong> ${roomNumber}</p>
                    <p><strong>Giá phòng:</strong> ${formatPrice(price)}đ/tháng</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận đăng ký',
            cancelButtonText: 'Hủy'
        });

        if (!result.isConfirmed) return;

        // Gửi đăng ký
        const response = await fetch('user_api.php?action=registerRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomId: roomId
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

// Hàm hiển thị lịch sử thanh toán
async function showPaymentHistory() {
    try {
        const response = await fetch('user_api.php?action=getPaymentHistory');
        const data = await response.json();

        if (data.success) {
            const paymentRows = data.payments.map(payment => `
                <tr>
                    <td>${new Date(payment.payment_date).toLocaleDateString('vi-VN')}</td>
                    <td>
                        ${payment.payment_type === 'utility' 
                            ? '<span class="badge bg-info">Tiện ích</span>' 
                            : '<span class="badge bg-primary">Tiền phòng</span>'
                        }
                    </td>
                    <td>${formatPrice(payment.amount)}đ</td>
                    <td>
                        ${payment.payment_type === 'utility' 
                            ? `Thanh toán tiện ích tháng ${new Date(payment.payment_date).getMonth() + 1}/${new Date(payment.payment_date).getFullYear()}`
                            : `Thanh toán tiền phòng tháng ${payment.month || ''}`
                        }
                    </td>
                    <td>
                        <span class="badge bg-success">
                            <i class="fas fa-check"></i> Đã thanh toán
                        </span>
                    </td>
                </tr>
            `).join('');

            Swal.fire({
                title: 'Lịch sử thanh toán',
                html: `
                    <div class="payment-history">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Ngày</th>
                                    <th>Loại</th>
                                    <th>Số tiền</th>
                                    <th>Mô tả</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${paymentRows}
                            </tbody>
                        </table>
                    </div>
                `,
                width: '800px',
                customClass: {
                    container: 'payment-history-modal'
                }
            });
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading payment history:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể tải lịch sử thanh toán'
        });
    }
}

// Thêm hàm thanh toán
async function makePayment(registrationId, amount) {
    try {
        // Kiểm tra trạng thái thanh toán hiện tại
        const response = await fetch('user_api.php?action=checkPaymentStatus');
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        if (!data.canPay) {
            await Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Bạn đã thanh toán cho tháng này rồi!'
            });
            return;
        }

        // Tiếp tục với quá trình thanh toán
        const result = await Swal.fire({
            title: 'Xác nhận thanh toán',
            html: `
                <div class="payment-details">
                    <p>Số tiền cần thanh toán: ${formatPrice(amount)}đ</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận thanh toán',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            const response = await fetch('user_api.php?action=makePayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Thanh toán thành công!'
                });
                showDashboard();
            } else {
                throw new Error(data.message);
            }
        }
    } catch (error) {
        console.error('Payment error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: error.message || 'Có lỗi xảy ra khi thanh toán'
        });
    }
}

// Hàm hiển thị popup điền thông tin cá nhân
async function showPersonalInfo() {
    try {
        // Lấy thông tin hiện tại của user (nếu có)
        const response = await fetch('user_api.php?action=getUserInfo');
        const data = await response.json();
        const userInfo = data.success ? data.user : {};

        const result = await Swal.fire({
            title: 'Thông tin cá nhân',
            html: `
                <form id="personalInfoForm" class="swal-form">
                    <div class="form-group">
                        <label for="fullName">Họ và tên:</label>
                        <input type="text" id="fullName" class="swal-input" 
                            value="${userInfo.fullname || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="studentId">Mã sinh viên:</label>
                        <input type="text" id="studentId" class="swal-input" 
                            value="${userInfo.username || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" class="swal-input" 
                            value="${userInfo.email || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Số điện thoại:</label>
                        <input type="tel" id="phone" class="swal-input" 
                            value="${userInfo.phone || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="faculty">Khoa:</label>
                        <input type="text" id="faculty" class="swal-input" 
                            value="${userInfo.faculty || ''}" required>
                    </div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Lưu thông tin',
            cancelButtonText: 'Hủy',
            preConfirm: () => {
                const form = document.getElementById('personalInfoForm');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return false;
                }
                return {
                    fullname: document.getElementById('fullName').value,
                    username: document.getElementById('studentId').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    faculty: document.getElementById('faculty').value
                };
            }
        });

        if (result.isConfirmed && result.value) {
            // Gửi thông tin lên server
            const saveResponse = await fetch('user_api.php?action=updateUserInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(result.value)
            });

            const saveData = await saveResponse.json();

            if (saveData.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đã cập nhật thông tin cá nhân'
                });
                // Cập nhật lại dashboard nếu cần
                showDashboard();
            } else {
                throw new Error(saveData.message);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: error.message || 'Có lỗi xảy ra khi cập nhật thông tin'
        });
    }
}

// Thêm hàm thanh toán tiện ích
async function makeUtilityPayment(electricityFee, waterFee, internetFee) {
    try {
        const totalAmount = electricityFee + waterFee + internetFee;
        
        const result = await Swal.fire({
            title: 'Xác nhận thanh toán tiện ích',
            html: `
                <div class="payment-details">
                    <p><strong>Tiền điện:</strong> ${formatPrice(electricityFee)}đ</p>
                    <p><strong>Tiền nước:</strong> ${formatPrice(waterFee)}đ</p>
                    <p><strong>Tiền mạng:</strong> ${formatPrice(internetFee)}đ</p>
                    <p><strong>Tổng cộng:</strong> ${formatPrice(totalAmount)}đ</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận thanh toán',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            const response = await fetch('user_api.php?action=makeUtilityPayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    electricity_fee: electricityFee,
                    water_fee: waterFee,
                    internet_fee: internetFee
                })
            });

            const data = await response.json();

            if (data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Thanh toán tiện ích thành công!'
                });
                showDashboard(); // Cập nhật lại dashboard
            } else {
                throw new Error(data.message);
            }
        }
    } catch (error) {
        console.error('Utility payment error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: error.message || 'Có lỗi xảy ra khi thanh toán tiện ích'
        });
    }
}
