//các biến toàn cầu
let selectedRoomId = null;
let selectedRegistrationId = null;
//hàm lấy dữ liệu từ server
async function fetchData() {
    //lấy danh sách tòa nhà và phòng từ server
    try {
        const buildingsResponse = await fetch('api.php?action=getBuildings');
        const roomsResponse = await fetch('api.php?action=getRooms');
        
        const buildings = await buildingsResponse.json();
        const rooms = await roomsResponse.json();
        
        updateBuildingSelect(buildings);
        renderRoomsByBuilding(buildings, rooms);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function updateBuildingSelect(buildings) {
    const select = document.getElementById('roomType');
    select.innerHTML = '';
    buildings.forEach(building => {
        const option = document.createElement('option');
        option.value = building.id;
        option.textContent = `Tòa ${building.name}`;
        select.appendChild(option);
    });
}

function renderRoomsByBuilding(buildings, rooms) {
    const roomGrid = document.getElementById('roomGrid');
    roomGrid.innerHTML = '';

    buildings.forEach(building => {
        const buildingSection = document.createElement('div');
        buildingSection.className = 'building-section';
        
        const buildingRooms = rooms.filter(room => room.building_id === building.id);
        
        buildingSection.innerHTML = `
            <h2>
                <span class="building-name" onclick="openEditBuilding(${building.id}, '${building.name}')">
                    Tòa ${building.name}
                </span>
            </h2>
            <div class="building-rooms">
                ${buildingRooms.length ? 
                    buildingRooms.map(room => createRoomCard(room)).join('') :
                    '<div class="no-rooms">Chưa có phòng</div>'
                }
            </div>
        `;
        
        roomGrid.appendChild(buildingSection);
    });
}

// Hàm tạo room card
function createRoomCard(room) {
    const statusText = getStatusText(room.status);
    return `
        <div class="room-card">
            <div class="room-info" onclick="toggleRoomActions('actions-${room.id}')">
                <span class="room-status ${room.status}">${statusText}</span>
                <h3>Phòng ${room.number}</h3>
                <p>Số người: ${room.current_occupants}/${room.max_occupants}</p>
                <p>Giá: ${formatPrice(room.price)}đ/tháng</p>
            </div>
            <div class="room-actions" id="actions-${room.id}">
                ${room.status !== 'occupied' ? 
                    `<button onclick="openRegisterModal(${room.id})">
                        <i class="fas fa-user-plus"></i>
                        Đăng ký
                    </button>` : ''
                }
                <button onclick="openEditStatus(${room.id})">
                    <i class="fas fa-edit"></i>
                    Sửa trạng thái
                </button>
                <button onclick="openUtilityUsage(${room.id}, '${room.number}')">
                    <i class="fas fa-bolt"></i>
                    Điện nước
                </button>
                <button onclick="showStudentList(${room.id})">
                    <i class="fas fa-users"></i>
                    Danh sách SV
                </button>
            </div>
        </div>
    `;
}

// Hàm hiển thị phòng
function displayRooms(rooms) {
    const grid = document.getElementById('roomGrid');
    if (!grid) return;

    grid.innerHTML = rooms.map(room => createRoomCard(room)).join('');
}

// Hàm toggle actions
function toggleRoomActions(actionId) {
    const allActions = document.querySelectorAll('.room-actions');
    allActions.forEach(div => {
        if (div.id !== actionId) {
            div.style.display = 'none';
        }
    });
    
    const actionDiv = document.getElementById(actionId);
    if (actionDiv) {
        actionDiv.style.display = actionDiv.style.display === 'none' ? 'flex' : 'none';
    }
}

// Hàm lấy text trạng thái
function getStatusText(status) {
    switch(status) {
        case 'available':
            return 'Còn trống';
        case 'occupied':
            return 'Đủ người';
        case 'issues':
            return 'Có sự cố';
        default:
            return status;
    }
}

//hàm format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

//hàm thêm phòng mới
async function addRoom(event) {
    event.preventDefault();
    
    const newRoom = {
        number: document.getElementById('roomNumber').value,
        building_id: document.getElementById('roomType').value,
        max_occupants: Number(document.getElementById('maxOccupants').value),
        price: Number(document.getElementById('roomPrice').value)
    };
    
    try {
        const response = await fetch('api.php?action=addRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRoom)
        });
        
        const result = await response.json();
        if (result.success) {
            await fetchData();
            closeAddRoom();
            document.getElementById('addRoomForm').reset();
        }
    } catch (error) {
        console.error('Error adding room:', error);
    }
}

//hàm thêm tòa nhà mới
async function addBuilding(event) {
    event.preventDefault();
    
    const buildingName = document.getElementById('buildingName').value;
    
    try {
        const response = await fetch('api.php?action=addBuilding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: buildingName })
        });
        
        const result = await response.json();
        if (result.success) {
            await fetchData();
            closeAddBuilding();
            document.getElementById('addBuildingForm').reset();
        }
    } catch (error) {
        console.error('Error adding building:', error);
    }
}

//hàm đăng ký phòng cho sinh viên
async function submitRegistration(event) {
    event.preventDefault();
    
    const registration = {
        roomId: selectedRoomId,
        studentName: document.getElementById('studentName').value,
        studentId: document.getElementById('studentId').value,
        studentPhone: document.getElementById('studentPhone').value,
        studentEmail: document.getElementById('studentEmail').value,
        studentFaculty: document.getElementById('studentFaculty').value
    };
    
    try {
        const response = await fetch('api.php?action=addRegistration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registration)
        });
        
        const result = await response.json();
        if (result.success) {
            await fetchData();
            swal({
                title: "Thông báo!",
                text: "Đăng kí phòng thành công!",
                icon: "success",
                button: "Ok",
            });
            closeRegisterModal();
        }
    } catch (error) {
        console.error('Error submitting registration:', error);
    }
}

//hàm cập nhật trạng thái phòng
async function updateRoomStatus(event) {
    event.preventDefault();
    
    const status = document.getElementById('roomStatus').value;
    
    try {
        const response = await fetch('api.php?action=updateRoomStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomId: selectedRoomId,
                status: status
            })
        });
        
        const result = await response.json();
        if (result.success) {
            await fetchData();
            closeEditStatus();
        }
    } catch (error) {
        console.error('Error updating room status:', error);
    }
}

//hàm modal control
function openAddRoom() {
    document.getElementById('addRoomModal').style.display = 'block';
}

function closeAddRoom() {
    document.getElementById('addRoomModal').style.display = 'none';
}

function openAddBuilding() {
    document.getElementById('addBuildingModal').style.display = 'block';
}

function closeAddBuilding() {
    document.getElementById('addBuildingModal').style.display = 'none';
}

function openRegisterModal(roomId) {
    selectedRoomId = roomId;
    document.getElementById('registerModal').style.display = 'block';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('registerForm').reset();
}

function openEditStatus(roomId) {
    selectedRoomId = roomId;
    document.getElementById('editStatusModal').style.display = 'block';
    
    const roomCard = document.querySelector(`[data-room-id="${roomId}"]`);
    if (roomCard) {
        const currentStatus = roomCard.querySelector('.room-status').dataset.status;
        document.getElementById('roomStatus').value = currentStatus;
    }
}

function closeEditStatus() {
    document.getElementById('editStatusModal').style.display = 'none';
}

//hàm hiển thị danh sách sinh viên trong phòng
async function showStudentList(roomId) {
    try {
        const response = await fetch(`api.php?action=getStudents&roomId=${roomId}`);
        const students = await response.json();
        
        const container = document.getElementById('studentListContainer');
        
        if (students.length === 0) {
            container.innerHTML = '<div class="no-students">Chưa có sinh viên đăng ký phòng này</div>';
        } else {
            container.innerHTML = students.map(student => `
                <div class="student-list-item">
                    <p><strong>Họ và tên:</strong> ${student.student_name}</p>
                    <p><strong>MSSV:</strong> ${student.student_id}</p>
                    <p><strong>SĐT:</strong> ${student.student_phone}</p>
                    <p><strong>Email:</strong> ${student.student_email}</p>
                    <p><strong>Khoa:</strong> ${student.student_faculty}</p>
                    <p><strong>Ngày đăng ký:</strong> ${new Date(student.registration_date).toLocaleDateString('vi-VN')}</p>
                </div>
            `).join('');
        }
        
        // Hiển thị modal
        document.getElementById('studentListModal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching students:', error);
        alert('Có lỗi xảy ra khi lấy danh sách sinh viên');
    }
}

//hàm đóng modal danh sách sinh viên
function closeStudentList() {
    document.getElementById('studentListModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    fetchData();
});

//hàm tìm kiếm phòng
async function searchRooms() {
    const searchText = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchText) {
        await fetchData();
        return;
    }

    try {
        const buildingsResponse = await fetch('api.php?action=getBuildings');
        const roomsResponse = await fetch('api.php?action=getRooms');
        const studentsResponse = await fetch('api.php?action=getAllStudents');
        
        const buildings = await buildingsResponse.json();
        const rooms = await roomsResponse.json();
        const students = await studentsResponse.json();

        // Lọc phòng dựa trên các tiêu chí
        const filteredRooms = rooms.filter(room => {
            const building = buildings.find(b => b.id === room.building_id);
            const roomStudents = students.filter(s => s.room_id === room.id);
            
            // Tìm trong số phòng
            const matchRoom = room.number.toString().toLowerCase().includes(searchText);
            
            // Tìm trong tên tòa nhà - Đã sửa lại phần này
            const matchBuilding = building && (
                building.name.toLowerCase().includes(searchText) ||           // Tìm theo tên tòa
                `tòa ${building.name}`.toLowerCase().includes(searchText) || // Tìm theo "tòa X"
                `toa ${building.name}`.toLowerCase().includes(searchText) || // Tìm theo "toa X"
                `toà ${building.name}`.toLowerCase().includes(searchText)    // Tìm theo "toà X"
            );
            
            // Tìm trong thông tin sinh viên
            const matchStudent = roomStudents.some(student => 
                student.student_name.toLowerCase().includes(searchText) ||
                student.student_id.toLowerCase().includes(searchText) ||
                student.student_phone.toLowerCase().includes(searchText) ||
                student.student_email.toLowerCase().includes(searchText) ||
                student.student_faculty.toLowerCase().includes(searchText)
            );

            return matchRoom || matchBuilding || matchStudent;
        });

        // Render kết quả
        renderRoomsByBuilding(buildings, filteredRooms);

    } catch (error) {
        console.error('Error searching:', error);
    }
}

// Hàm khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
    fetchData();
});

// Chức năng Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Chức năng tìm kiếm
async function searchRooms() {
    const searchText = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchText) {
        await fetchData();
        return;
    }

    try {
        const buildingsResponse = await fetch('api.php?action=getBuildings');
        const roomsResponse = await fetch('api.php?action=getRooms');
        const studentsResponse = await fetch('api.php?action=getAllStudents');
        
        const buildings = await buildingsResponse.json();
        const rooms = await roomsResponse.json();
        const students = await studentsResponse.json();

        const filteredRooms = rooms.filter(room => {
            const building = buildings.find(b => b.id === room.building_id);
            const roomStudents = students.filter(s => s.room_id === room.id);
            
            return room.number.toLowerCase().includes(searchText) ||
                   `tòa ${building?.name}`.toLowerCase().includes(searchText) ||
                   roomStudents.some(student => 
                       student.student_name.toLowerCase().includes(searchText) ||
                       student.student_id.toLowerCase().includes(searchText) ||
                       student.student_email.toLowerCase().includes(searchText) ||
                       student.student_faculty.toLowerCase().includes(searchText)
                   );
        });

        renderRoomsByBuilding(buildings, filteredRooms);
    } catch (error) {
        console.error('Error searching:', error);
    }
}

// Chức năng lọc phòng
async function filterRooms(filter) {
    try {
        const roomGrid = document.getElementById('roomGrid');
        const registrationsList = document.getElementById('registrationsList');

        // Hiển thị grid phòng và ẩn danh sách đăng ký
        roomGrid.style.display = 'flex';
        registrationsList.style.display = 'none';

        const response = await fetch(`api.php?action=getRooms`);
        const rooms = await response.json();
        const buildingsResponse = await fetch('api.php?action=getBuildings');
        const buildings = await buildingsResponse.json();

        let filteredRooms = rooms;
        
        // Lọc phòng theo điều kiện
        if (filter !== 'all') {
            filteredRooms = rooms.filter(room => {
                if (filter === 'available') {
                    return room.status === 'available' && room.current_occupants < room.max_occupants;
                } else if (filter === 'occupied') {
                    return room.status === 'occupied' || room.current_occupants >= room.max_occupants;
                } else if (filter === 'issues') {
                    // Lọc các phòng có vấn đề
                    return ['bao_tri', 'sua_chua', 'don_dep', 'hu_hong'].includes(room.status);
                }
                return true;
            });
        }

        renderRoomsByBuilding(buildings, filteredRooms);
    } catch (error) {
        console.error('Error filtering rooms:', error);
    }
}

// Chức năng xem danh sách đăng ký
async function showRegistrations() {
    try {
        const response = await fetch('api.php?action=getRegistrations');
        const registrations = await response.json();
        
        const roomGrid = document.getElementById('roomGrid');
        const registrationsList = document.getElementById('registrationsList');
        
        roomGrid.style.display = 'none';
        registrationsList.style.display = 'block';
        
        const registrationsContainer = document.getElementById('registrationsContainer');
        
        if (registrations.length === 0) {
            registrationsContainer.innerHTML = '<div class="no-registrations">Không có đơn đăng ký nào</div>';
            return;
        }
        
        // Hàm tính thời gian đã ở
        function getTimeStayed(registrationDate) {
            const regDate = new Date(registrationDate);
            const now = new Date();
            const diffTime = Math.abs(now - regDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffMonths = Math.floor(diffDays / 30);
            const diffYears = Math.floor(diffMonths / 12);
            
            if (diffYears > 0) {
                return `${diffYears} năm ${diffMonths % 12} tháng`;
            } else if (diffMonths > 0) {
                return `${diffMonths} tháng ${diffDays % 30} ngày`;
            } else {
                return `${diffDays} ngày`;
            }
        }
        
        registrationsContainer.innerHTML = registrations.map(reg => `
            <div class="registration-item">
                <div class="student-info">
                    <h3>Phòng ${reg.room_number} - Tòa ${reg.building_name}</h3>
                    <p><strong>Họ tên:</strong> ${reg.student_name}</p>
                    <p><strong>MSSV:</strong> ${reg.student_id}</p>
                    <p><strong>SĐT:</strong> ${reg.student_phone}</p>
                    <p><strong>Email:</strong> ${reg.student_email}</p>
                    <p><strong>Khoa:</strong> ${reg.student_faculty}</p>
                    <p><strong>Ngày đăng ký:</strong> ${new Date(reg.registration_date).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Thời gian ở:</strong> ${getTimeStayed(reg.registration_date)}</p>
                </div>
                <div class="registration-actions">
                    <button onclick='openEditStudent(${JSON.stringify(reg)})'>
                        <i class="fas fa-edit"></i> Chỉnh sửa
                    </button>
                    <button onclick="cancelRegistration(${reg.id})" class="cancel-registration">
                        <i class="fas fa-times"></i> Hủy đăng ký
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error fetching registrations:', error);
        alert('Có lỗi xảy ra khi lấy danh sách đăng ký');
    }
}

// Thêm hàm hủy đăng ký
async function cancelRegistration(registrationId) {
    if (!confirm('Bạn có chắc muốn hủy đăng ký này?')) {
        return;
    }
    
    try {
        const response = await fetch('api.php?action=cancelRegistration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ registrationId: registrationId })
        });
        
        const result = await response.json();
        if (result.success) {
            await showRegistrations(); // Refresh danh sách
        } else {
            alert('Có lỗi xảy ra: ' + result.error);
        }
    } catch (error) {
        console.error('Error canceling registration:', error);
        alert('Có lỗi xảy ra khi hủy đăng ký');
    }
}

// Các hàm modal
function openAddRoom() {
    document.getElementById('addRoomModal').style.display = 'block';
}

function closeAddRoom() {
    document.getElementById('addRoomModal').style.display = 'none';
    document.getElementById('addRoomForm').reset();
}

function openAddBuilding() {
    document.getElementById('addBuildingModal').style.display = 'block';
}

function closeAddBuilding() {
    document.getElementById('addBuildingModal').style.display = 'none';
    document.getElementById('addBuildingForm').reset();
}

function openRegisterModal(roomId) {
    selectedRoomId = roomId;
    document.getElementById('registerModal').style.display = 'block';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('registerForm').reset();
}

function openEditStatus(roomId) {
    selectedRoomId = roomId;
    document.getElementById('editStatusModal').style.display = 'block';
    
    const roomCard = document.querySelector(`[data-room-id="${roomId}"]`);
    if (roomCard) {
        const currentStatus = roomCard.querySelector('.room-status').dataset.status;
        document.getElementById('roomStatus').value = currentStatus;
    }
}

function closeEditStatus() {
    document.getElementById('editStatusModal').style.display = 'none';
}

// Chức năng xem danh sách sinh viên trong phòng
async function showStudentList(roomId) {
    try {
        const response = await fetch(`api.php?action=getStudents&roomId=${roomId}`);
        const students = await response.json();
        
        const container = document.getElementById('studentListContainer');
        
        if (students.length === 0) {
            container.innerHTML = '<div class="no-students">Chưa có sinh viên đăng ký phòng này</div>';
        } else {
            container.innerHTML = students.map(student => `
                <div class="student-list-item">
                    <p><strong>Họ và tên:</strong> ${student.student_name}</p>
                    <p><strong>MSSV:</strong> ${student.student_id}</p>
                    <p><strong>SĐT:</strong> ${student.student_phone}</p>
                    <p><strong>Email:</strong> ${student.student_email}</p>
                    <p><strong>Khoa:</strong> ${student.student_faculty}</p>
                    <p><strong>Ngày đăng ký:</strong> ${new Date(student.registration_date).toLocaleDateString('vi-VN')}</p>
                </div>
            `).join('');
        }
        
        // Hiển thị modal
        document.getElementById('studentListModal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching students:', error);
        alert('Có lỗi xảy ra khi lấy danh sách sinh viên');
    }
}

function closeStudentList() {
    document.getElementById('studentListModal').style.display = 'none';
}

// Các hàm xử lý form
async function addRoom(event) {
    event.preventDefault();
    
    const newRoom = {
        number: document.getElementById('roomNumber').value,
        building_id: document.getElementById('roomType').value,
        max_occupants: Number(document.getElementById('maxOccupants').value),
        price: Number(document.getElementById('roomPrice').value)
    };
    
    try {
        const response = await fetch('api.php?action=addRoom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRoom)
        });
        
        const result = await response.json();
        if (result.success) {
            await fetchData();
            closeAddRoom();
        }
    } catch (error) {
        console.error('Error adding room:', error);
    }
}
async function addBuilding(event) {
    event.preventDefault();
    
    const buildingName = document.getElementById('buildingName').value;
    
    try {
        const response = await fetch('api.php?action=addBuilding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: buildingName })
        });
        
        const result = await response.json();
        if (result.success) {
            await fetchData();
            closeAddBuilding();
        }
    } catch (error) {
        console.error('Error adding building:', error);
    }
}

async function submitRegistration(event) {
    event.preventDefault();
    
    const registration = {
        roomId: selectedRoomId,
        studentName: document.getElementById('studentName').value,
        studentId: document.getElementById('studentId').value,
        studentPhone: document.getElementById('studentPhone').value,
        studentEmail: document.getElementById('studentEmail').value,
        studentFaculty: document.getElementById('studentFaculty').value
    };
    
    try {
        const response = await fetch('api.php?action=addRegistration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registration)
        });
        
        const result = await response.json();
        if (result.success) {
            await fetchData();
            swal({
                title: "Thông báo!",
                text: "Đăng kí phòng thành công!",
                icon: "success",
                button: "Ok",
            });
            closeRegisterModal();
        }
    } catch (error) {
        console.error('Error submitting registration:', error);
    }
}

async function updateRoomStatus(event) {
    event.preventDefault();
    
    const status = document.getElementById('roomStatus').value;
    
    try {
        const response = await fetch('api.php?action=updateRoomStatus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomId: selectedRoomId,
                status: status
            })
        });
        
        const result = await response.json();
        if (result.success) {
            await fetchData();
            closeEditStatus();
        }
    } catch (error) {
        console.error('Error updating room status:', error);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    sidebar.classList.toggle('open');
    
    // Ẩn/hiện nút hamburger menu
    if (sidebar.classList.contains('open')) {
        hamburgerMenu.style.display = 'none';
    } else {
        hamburgerMenu.style.display = 'flex';
    }
}

function openEditBuilding(buildingId, buildingName) {
    document.getElementById('editBuildingId').value = buildingId;
    document.getElementById('editBuildingName').value = buildingName;
    document.getElementById('editBuildingModal').style.display = 'block';
}

function closeEditBuilding() {
    document.getElementById('editBuildingModal').style.display = 'none';
    document.getElementById('editBuildingForm').reset();
}

async function updateBuilding(event) {
    event.preventDefault();
    
    const buildingId = document.getElementById('editBuildingId').value;
    const buildingName = document.getElementById('editBuildingName').value;
    
    try {
        const response = await fetch('api.php?action=updateBuilding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: buildingId,
                name: buildingName
            })
        });
        
        const result = await response.json();
        if (result.success) {
            await fetchData();
            closeEditBuilding();
        } else {
            alert('Không thể cập nhật tòa nhà: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating building:', error);
        alert('Có lỗi xảy ra khi cập nhật tòa nhà');
    }
}
//hàm xóa tòa nhà
async function deleteBuilding() {
    if (!confirm('Bạn có chắc muốn xóa tòa nhà này? Tất cả phòng và đăng ký trong tòa nhà sẽ bị xóa.')) {
        return;
    }
    
    const buildingId = document.getElementById('editBuildingId').value;
    
    try {
        const response = await fetch('api.php?action=deleteBuilding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: buildingId })
        });
        
        const result = await response.json();
        if (result.success) {
            await fetchData();
            closeEditBuilding();
        } else {
            alert(result.error || 'Không thể xóa tòa nhà');
        }
    } catch (error) {
        console.error('Error deleting building:', error);
        alert('Có lỗi xảy ra khi xóa tòa nhà');
    }
}
//hàm xóa phòng
async function deleteRoom() {
    if (!confirm('Bạn có chắc muốn xóa phòng này?')) {
        return;
    }
    
    try {
        const response = await fetch('api.php?action=deleteRoom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId: selectedRoomId })
        });
        
        const result = await response.json();
        if (result.success) {
            await fetchData();
            closeEditStatus();
        } else {
            alert(result.error || 'Không thể xóa phòng');
        }
    } catch (error) {
        console.error('Error deleting room:', error);
        alert('Có lỗi xảy ra khi xóa phòng');
    }
}
//hàm mở modal thanh toán
function openPaymentSearch() {
    document.getElementById('paymentSearchModal').style.display = 'block';
    document.getElementById('paymentInfo').style.display = 'none';
    document.getElementById('paymentStudentId').value = '';
}
//hàm đóng modal thanh toán
function closePaymentSearch() {
    document.getElementById('paymentSearchModal').style.display = 'none';
}
//hàm tìm kiếm sinh viên thanh toán
async function searchStudentPayment() {
    const studentId = document.getElementById('paymentStudentId').value;
    if (!studentId) {
        swal({
            title: "Thông báo!",
            text: "Vui lòng nhập MSSV",
            icon: "warning",
            button: "Ok",
        });
        return;
    }

    try {
        const response = await fetch(`api.php?action=searchStudent&studentId=${studentId}`);
        const data = await response.json();
        
        if (!data) {
            alert('Không tìm thấy sinh viên');
            return;
        }

        const paymentInfo = document.getElementById('paymentInfo');
        const currentSemester = getCurrentSemester();
        const isPaid = data.payment_status === 'completed' && 
                      data.payment_semester === currentSemester;

        paymentInfo.innerHTML = `
            <div class="student-payment-info">
                <h3>Thông Tin Sinh Viên</h3>
                <p><strong>Họ và tên:</strong> ${data.student_name}</p>
                <p><strong>MSSV:</strong> ${data.student_id}</p>
                <p><strong>Phòng:</strong> ${data.room_number} - Tòa ${data.building_name}</p>
                <div class="fees-section">
                    <h4>Phí phòng</h4>
                    <p><strong>Giá phòng:</strong> ${formatPrice(data.room_price)}đ/tháng</p>
                    
                    <h4>Phí sinh hoạt</h4>
                    <div class="utility-fees">
                        <div class="form-group">
                            <label>Tiền điện:</label>
                            <input type="number" id="electricityFee" min="0" value="0">
                        </div>
                        <div class="form-group">
                            <label>Tiền nước:</label>
                            <input type="number" id="waterFee" min="0" value="0">
                        </div>
                        <div class="form-group">
                            <label>Tiền mạng:</label>
                            <input type="number" id="internetFee" min="0" value="0">
                        </div>
                    </div>
                    
                    <p><strong>Tổng phí:</strong> <span id="totalFee">${formatPrice(data.room_price)}đ</span></p>
                    
                    <p><strong>Trạng thái:</strong> 
                        <span class="payment-status ${isPaid ? 'paid' : 'unpaid'}">
                            ${isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                    </p>
                    ${!isPaid ? `
                        <button onclick="makePayment(${data.id}, ${data.room_price})">
                            Thanh toán học kỳ ${currentSemester}
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        // Thêm event listeners cho các input phí
        const feeInputs = ['electricityFee', 'waterFee', 'internetFee'];
        feeInputs.forEach(id => {
            document.getElementById(id).addEventListener('input', updateTotalFee);
        });
    } catch (error) {
        console.error('Error searching student:', error);
        alert('Có lỗi xảy ra khi tìm kiếm');
    }
}
//hàm lấy học kỳ hiện tại
function getCurrentSemester() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return month >= 8 ? `${year}-1` : `${year}-2`;
}
//hàm thanh toán tiền phòng
async function makePayment(registrationId, roomPrice) {
    const electricityFee = Number(document.getElementById('electricityFee').value) || 0;
    const waterFee = Number(document.getElementById('waterFee').value) || 0;
    const internetFee = Number(document.getElementById('internetFee').value) || 0;
    
    const totalAmount = roomPrice + electricityFee + waterFee + internetFee;

    const willPay = await swal({
        title: "Xác nhận",
        text: `Tổng số tiền cần thanh toán: ${formatPrice(totalAmount)}đ`,
        icon: "warning",
        buttons: {
            cancel: {
                text: "Hủy",
                value: false,
                visible: true,
                className: "",
                closeModal: true,
            },
            confirm: {
                text: "Đồng ý",
                value: true,
            }
        },
        dangerMode: true
    });
    
    if (!willPay) return;

    try {
        const response = await fetch('api.php?action=makePayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                registrationId: registrationId,
                amount: totalAmount,
                electricityFee: electricityFee,
                waterFee: waterFee,
                internetFee: internetFee,
                semester: getCurrentSemester()
            })
        });

        const result = await response.json();
        if (result.success) {
            swal({
                title: "Thông báo!",
                text: "Thanh toán thành công!",
                icon: "success",
                button: "Ok",
            });
            searchStudentPayment();
        } else {
            swal({
                title: "Lỗi!",
                text: "Có lỗi xảy ra: " + result.error,
                icon: "error",
                button: "Ok",
            });
        }
    } catch (error) {
        console.error('Error making payment:', error);
        swal({
            title: "Lỗi!",
            text: "Có lỗi xảy ra khi thanh toán",
            icon: "error",
            button: "Ok",
        });
    }
}

// Thêm hàm hiển thị sinh viên chưa đóng tiền

// Thêm hàm đóng modal danh sách sinh viên chưa đóng tiền
function closeUnpaidStudents() {
    document.getElementById('unpaidStudentsModal').style.display = 'none';
}
// Thêm hàm để xử lý dropdown
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const button = dropdown.previousElementSibling;
    
    // Toggle dropdown hiện tại
    dropdown.classList.toggle('show');
    button.classList.toggle('active');
}

// Hàm mở modal chỉnh sửa
function openEditStudent(registration) {
    selectedRegistrationId = registration.id;
    document.getElementById('editStudentRegistrationId').value = registration.id;
    document.getElementById('editStudentName').value = registration.student_name;
    document.getElementById('editStudentId').value = registration.student_id;
    document.getElementById('editStudentPhone').value = registration.student_phone;
    document.getElementById('editStudentEmail').value = registration.student_email;
    document.getElementById('editStudentFaculty').value = registration.student_faculty;
    
    document.getElementById('editStudentModal').style.display = 'block';
}

// Hàm đóng modal
function closeEditStudent() {
    document.getElementById('editStudentModal').style.display = 'none';
    selectedRegistrationId = null;
}

// Hàm cập nhật thông tin sinh viên
async function updateStudent(event) {
    event.preventDefault();
    
    const data = {
        registrationId: selectedRegistrationId,
        studentName: document.getElementById('editStudentName').value,
        studentId: document.getElementById('editStudentId').value,
        studentPhone: document.getElementById('editStudentPhone').value,
        studentEmail: document.getElementById('editStudentEmail').value,
        studentFaculty: document.getElementById('editStudentFaculty').value
    };
    
    try {
        const response = await fetch('api.php?action=updateStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            await fetchData(); // Refresh data
            closeEditStudent();
        } else {
            alert('Có lỗi xảy ra: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating student:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin');
    }
}
// ... existing code ...

// Sửa lại hàm closeStudentList
function closeStudentList() {
    document.getElementById('studentListModal').style.display = 'none';
}

// Thêm event listener chỉ cho studentListModal
document.addEventListener('DOMContentLoaded', function() {
    const studentListModal = document.getElementById('studentListModal');
    studentListModal.addEventListener('click', function(event) {
        // Chỉ đóng modal nếu click vào phần nền (không phải modal-content)
        if (event.target === studentListModal) {
            closeStudentList();
        }
    });
    

});

async function showUnpaidUtilityStudents() {
    try {
        const response = await fetch('api.php?action=getUnpaidUtilityStudents');
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Không thể lấy dữ liệu');
        }
        
        const students = result.data;
        const roomGrid = document.getElementById('roomGrid');
        const registrationsList = document.getElementById('registrationsList');
        
        roomGrid.style.display = 'none';
        registrationsList.style.display = 'block';
        
        const registrationsContainer = document.getElementById('registrationsContainer');
        
        if (!students || students.length === 0) {
            registrationsContainer.innerHTML = '<div class="no-registrations">Không có sinh viên nào chưa đóng tiền tiện ích tháng này</div>';
            return;
        }

        registrationsContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3>Danh sách sinh viên chưa đóng tiền tiện ích tháng ${students[0].current_month}/${students[0].current_year}</h3>
                <div class="search-box">
                    <input type="text" id="unpaidUtilitySearchInput" placeholder="Tìm kiếm..." oninput="filterUnpaidUtilityStudents()">
                </div>
            </div>
            <div id="unpaidUtilityStudentsList">
                ${students.map(student => `
                    <div class="registration-item unpaid" data-student-info="${student.student_name.toLowerCase()} ${student.student_id.toLowerCase()}">
                        <div class="student-info">
                            <h3>Phòng ${student.room_number} - Tòa ${student.building_name}</h3>
                            <p><strong>Họ tên:</strong> ${student.student_name}</p>
                            <p><strong>MSSV:</strong> ${student.student_id}</p>
                            <p><strong>SĐT:</strong> ${student.student_phone}</p>
                            <p><strong>Email:</strong> ${student.student_email}</p>
                            <p><strong>Khoa:</strong> ${student.student_faculty}</p>
                            <div class="utility-details">
                                <h4>Chi tiết sử dụng phòng:</h4>
                                <p><strong>Điện:</strong> ${student.usage_details.electricity} kWh</p>
                                <p><strong>Nước:</strong> ${student.usage_details.water} m³</p>
                                <h4>Chi phí phải đóng (đã chia ${student.current_occupants} người):</h4>
                                <p><strong>Tiền điện:</strong> ${student.utility_fees.electricity} VNĐ</p>
                                <p><strong>Tiền nước:</strong> ${student.utility_fees.water} VNĐ</p>
                                <p><strong>Tiền Internet:</strong> ${student.utility_fees.internet} VNĐ</p>
                                <p class="total-fee"><strong>Tổng cộng:</strong> ${student.utility_fees.total} VNĐ</p>
                            </div>
                        </div>
                        <div class="registration-actions">
                            <button onclick="openUtilityPayment(${student.id}, ${student.utility_fees.total.replace(/\./g, '')})" class="btn btn-primary">
                                <i class="fas fa-money-bill-wave"></i> Thanh toán tiện ích
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        swal({
            title: "Lỗi!",
            text: error.message || "Có lỗi xảy ra khi lấy danh sách sinh viên chưa đóng tiền tiện ích",
            icon: "error",
            button: "Đóng",
        });
    }
}

// Thêm hàm lọc sinh viên
function filterUnpaidUtilityStudents() {
    const searchInput = document.getElementById('unpaidUtilitySearchInput');
    const filter = searchInput.value.toLowerCase();
    const items = document.querySelectorAll('#unpaidUtilityStudentsList .registration-item');

    items.forEach(item => {
        const info = item.getAttribute('data-student-info');
        if (info.includes(filter)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

async function showPaidStudents() {
    try {
        const response = await fetch('api.php?action=getPaidStudents');
        const payments = await response.json();
        
        const roomGrid = document.getElementById('roomGrid');
        const registrationsList = document.getElementById('registrationsList');
        
        roomGrid.style.display = 'none';
        registrationsList.style.display = 'block';
        
        const registrationsContainer = document.getElementById('registrationsContainer');
        
        if (payments.length === 0) {
            registrationsContainer.innerHTML = '<div class="no-registrations">Không có lịch sử đóng tiền</div>';
            return;
        }

        registrationsContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3>Lịch sử đóng tiền của sinh viên (${payments.length} lượt đóng)</h3>
            </div>
            ${payments.map(payment => `
                <div class="registration-item paid">
                    <div class="student-info">
                        <h3>Phòng ${payment.room_number} - Tòa ${payment.building_name}</h3>
                        <p><strong>Họ tên:</strong> ${payment.student_name}</p>
                        <p><strong>MSSV:</strong> ${payment.student_id}</p>
                        <p><strong>SĐT:</strong> ${payment.student_phone}</p>
                        <p><strong>Email:</strong> ${payment.student_email}</p>
                        <p><strong>Khoa:</strong> ${payment.student_faculty}</p>
                        <p><strong>Ngày đăng ký phòng:</strong> ${payment.formatted_reg_date}</p>
                        <p class="text-success"><strong>Ngày đóng tiền:</strong> ${payment.formatted_payment_date}</p>
                        <p class="text-primary"><strong>Số tiền đã đóng:</strong> ${payment.amount}</p>
                        <p><strong>Tháng đóng:</strong> ${payment.payment_month || 'Không có thông tin'}</p>
                        <p><strong>Loại thanh toán:</strong> ${getPaymentTypeText(payment.payment_type)}</p>
                        <p><strong>Trạng thái:</strong> <span class="status-badge ${payment.status.toLowerCase()}">${getPaymentStatusText(payment.status)}</span></p>
                    </div>
                </div>
            `).join('')}
        `;
        
    } catch (error) {
        console.error('Error fetching payment history:', error);
        swal({
            title: "Lỗi!",
            text: "Có lỗi xảy ra khi lấy lịch sử đóng tiền",
            icon: "error",
            button: "Đóng",
        });
    }
}

// Hàm chuyển đổi loại thanh toán sang tiếng Việt
function getPaymentTypeText(type) {
    const types = {
        'cash': 'Tiền mặt',
        'transfer': 'Chuyển khoản',
        'card': 'Thẻ',
        // Thêm các loại thanh toán khác nếu cần
    };
    return types[type] || type;
}

// Hàm chuyển đổi trạng thái thanh toán sang tiếng Việt
function getPaymentStatusText(status) {
    const statuses = {
        'pending': 'Đang xử lý',
        'completed': 'Hoàn thành',
        'failed': 'Thất bại',
        'cancelled': 'Đã hủy'
        // Thêm các trạng thái khác nếu cần
    };
    return statuses[status] || status;
}

// Hàm tính tổng phí
function updateTotalFee() {
    const roomPrice = Number(document.querySelector('.student-payment-info').dataset.roomPrice);
    const electricityFee = Number(document.getElementById('electricityFee').value) || 0;
    const waterFee = Number(document.getElementById('waterFee').value) || 0;
    const internetFee = Number(document.getElementById('internetFee').value) || 0;
    
    const total = roomPrice + electricityFee + waterFee + internetFee;
    document.getElementById('totalFee').textContent = formatPrice(total) + 'đ';
}

// Mở modal quản lý giá dịch vụ
async function openUtilityPrices() {
    try {
        const response = await fetch('api.php?action=getUtilityPrices');
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('electricityPrice').value = data.prices.electricity_price;
            document.getElementById('waterPrice').value = data.prices.water_price;
            document.getElementById('internetPrice').value = data.prices.internet_price;
        }
        
        document.getElementById('utilityPricesModal').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        swal("Lỗi", "Không thể tải thông tin giá dịch vụ", "error");
    }
}

// Đóng modal
function closeUtilityPrices() {
    document.getElementById('utilityPricesModal').style.display = 'none';
}

// Cập nhật giá dịch vụ
async function updateUtilityPrices(event) {
    event.preventDefault();
    
    const prices = {
        electricity: Number(document.getElementById('electricityPrice').value),
        water: Number(document.getElementById('waterPrice').value),
        internet: Number(document.getElementById('internetPrice').value)
    };

    try {
        const response = await fetch('api.php?action=updateUtilityPrices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prices)
        });

        const data = await response.json();
        
        if (data.success) {
            swal("Thành công", "Đã cập nhật giá dịch vụ", "success");
            closeUtilityPrices();
        } else {
            swal("Lỗi", data.error || "Không thể cập nhật giá dịch vụ", "error");
        }
    } catch (error) {
        console.error('Error:', error);
        swal("Lỗi", "Không thể cập nhật giá dịch vụ", "error");
    }
}

// Mở modal nhập số điện nước
async function openUtilityUsage(roomId, roomNumber) {
    document.getElementById('utilityRoomId').value = roomId;
    document.getElementById('utilityRoomNumber').textContent = roomNumber;
    
    // Điền năm
    const yearSelect = document.getElementById('utilityYear');
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '';
    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
        yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
    }
    yearSelect.value = currentYear;
    
    // Set tháng hiện tại
    document.getElementById('utilityMonth').value = new Date().getMonth() + 1;
    
    // Load dữ liệu hiện tại nếu có
    await loadUtilityUsage(roomId);
    
    // Hiển thị modal
    document.getElementById('utilityUsageModal').style.display = 'block';
}

// Load dữ liệu sử dụng điện nước
async function loadUtilityUsage(roomId) {
    try {
        const month = document.getElementById('utilityMonth').value;
        const year = document.getElementById('utilityYear').value;
        
        const response = await fetch(`api.php?action=getUtilityUsage&roomId=${roomId}&month=${month}&year=${year}`);
        const data = await response.json();
        
        if (data.success && data.usage) {
            document.getElementById('electricityUsage').value = data.usage.electricity_usage;
            document.getElementById('waterUsage').value = data.usage.water_usage;
        } else {
            document.getElementById('electricityUsage').value = '';
            document.getElementById('waterUsage').value = '';
        }
        
        // Load lịch sử
        await loadUtilityHistory(roomId);
        
    } catch (error) {
        console.error('Error:', error);
        swal("Lỗi", "Không thể tải dữ liệu", "error");
    }
}

// Load lịch sử sử dụng
async function loadUtilityHistory(roomId) {
    try {
        const response = await fetch(`api.php?action=getUtilityHistory&roomId=${roomId}`);
        const data = await response.json();
        
        if (data.success) {
            const historyContent = document.getElementById('utilityHistoryContent');
            if (data.history.length === 0) {
                historyContent.innerHTML = '<p class="no-data">Chưa có dữ liệu</p>';
                return;
            }
            
            historyContent.innerHTML = data.history.map(item => `
                <div class="history-item">
                    <div class="history-date">Tháng ${item.month}/${item.year}</div>
                    <div class="history-usage">
                        <span>Điện: ${item.electricity_usage} kWh</span>
                        <span>Nước: ${item.water_usage} m³</span>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Cập nhật số điện nước
async function updateUtilityUsage(event) {
    event.preventDefault();
    
    const data = {
        roomId: document.getElementById('utilityRoomId').value,
        month: document.getElementById('utilityMonth').value,
        year: document.getElementById('utilityYear').value,
        electricityUsage: document.getElementById('electricityUsage').value,
        waterUsage: document.getElementById('waterUsage').value
    };

    try {
        const response = await fetch('api.php?action=updateUtilityUsage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (result.success) {
            swal("Thành công", "Đã cập nhật số điện nước", "success");
            await loadUtilityHistory(data.roomId);
        } else {
            swal("Lỗi", result.error || "Không thể cập nhật số điện nước", "error");
        }
    } catch (error) {
        console.error('Error:', error);
        swal("Lỗi", "Không thể cập nhật số điện nước", "error");
    }
}

// Đóng modal
function closeUtilityUsage() {
    document.getElementById('utilityUsageModal').style.display = 'none';
}

// Event listeners cho thay đổi tháng/năm
document.getElementById('utilityMonth').addEventListener('change', () => {
    const roomId = document.getElementById('utilityRoomId').value;
    loadUtilityUsage(roomId);
});

document.getElementById('utilityYear').addEventListener('change', () => {
    const roomId = document.getElementById('utilityRoomId').value;
    loadUtilityUsage(roomId);
});

// Thêm hàm để toggle hiển thị các nút
function toggleRoomActions(actionId) {
    // Ẩn tất cả các action divs trước
    const allActions = document.querySelectorAll('.room-actions');
    allActions.forEach(div => {
        if (div.id !== actionId) {
            div.style.display = 'none';
        }
    });
    
    // Toggle action div được chọn
    const actionDiv = document.getElementById(actionId);
    if (actionDiv) {
        actionDiv.style.display = actionDiv.style.display === 'none' ? 'flex' : 'none';
    }
}