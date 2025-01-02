<?php
session_start();
header('Content-Type: application/json');
require_once 'config.php';

// Kiểm tra đăng nhập
function checkLogin() {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Chưa đăng nhập']);
        exit;
    }
}

$action = $_GET['action'] ?? '';

switch($action) {
    case 'getUserInfo':
        checkLogin();
        try {
            // Sử dụng database login_system
            $stmt = $pdo->prepare("
                SELECT id, username, email 
                FROM login_system.users 
                WHERE id = ?
            ");
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                echo json_encode([
                    'success' => true, 
                    'user' => $user
                ]);
            } else {
                echo json_encode([
                    'success' => false, 
                    'message' => 'Không tìm thấy thông tin người dùng'
                ]);
            }
        } catch (Exception $e) {
            echo json_encode([
                'success' => false, 
                'message' => 'Lỗi khi lấy thông tin: ' . $e->getMessage()
            ]);
        }
        break;

    case 'getDashboardInfo':
        checkLogin();
        try {
            // Chuyển đổi student_id sang COLLATE giống nhau
            $stmt = $pdo->prepare("
                SELECT u.*, r.id as registration_id, 
                       rm.number as room_number, rm.price,
                       b.name as building_name,
                       p.status as payment_status,
                       p.amount as payment_amount,
                       p.semester as payment_semester
                FROM login_system.users u
                LEFT JOIN ktx_management.registrations r ON u.username COLLATE utf8mb4_unicode_ci = r.student_id
                LEFT JOIN ktx_management.rooms rm ON r.room_id = rm.id
                LEFT JOIN ktx_management.buildings b ON rm.building_id = b.id
                LEFT JOIN ktx_management.payments p ON r.id = p.registration_id
                WHERE u.id = ?
                ORDER BY r.registration_date DESC
                LIMIT 1
            ");
            $stmt->execute([$_SESSION['user_id']]);
            $info = $stmt->fetch(PDO::FETCH_ASSOC);

            // Format dữ liệu trả về
            $response = [
                'success' => true,
                'user' => [
                    'id' => $info['id'],
                    'username' => $info['username'],
                    'email' => $info['email']
                ],
                'room' => null,
                'payment' => null
            ];

            // Nếu có thông tin phòng
            if ($info['registration_id']) {
                $response['room'] = [
                    'number' => $info['room_number'],
                    'building' => $info['building_name'],
                    'price' => $info['price']
                ];
            }

            // Nếu có thông tin thanh toán
            if ($info['payment_status']) {
                $response['payment'] = [
                    'status' => $info['payment_status'],
                    'amount' => $info['payment_amount'],
                    'semester' => $info['payment_semester']
                ];
            }

            echo json_encode($response);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false, 
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'getAvailableRooms':
        checkLogin();
        try {
            // Lấy danh sách tất cả các tòa nhà và phòng còn trống
            $stmt = $pdo->prepare("
                SELECT r.*, b.name as building_name,
                       (SELECT COUNT(*) FROM registrations WHERE room_id = r.id) as registered_students
                FROM rooms r
                JOIN buildings b ON r.building_id = b.id
                WHERE r.status = 'available'
                AND r.current_occupants < r.max_occupants
                ORDER BY b.name, r.number
            ");
            $stmt->execute();
            $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Nhóm phòng theo tòa nhà
            $groupedRooms = [];
            foreach ($rooms as $room) {
                if (!isset($groupedRooms[$room['building_name']])) {
                    $groupedRooms[$room['building_name']] = [];
                }
                $groupedRooms[$room['building_name']][] = $room;
            }

            echo json_encode([
                'success' => true,
                'rooms' => $groupedRooms
            ]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'registerRoom':
        checkLogin();
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['roomId']) || !isset($data['phone']) || !isset($data['faculty'])) {
            echo json_encode(['success' => false, 'message' => 'Thiếu thông tin đăng ký']);
            break;
        }

        try {
            $pdo->beginTransaction();

            // Lấy thông tin người dùng
            $stmt = $pdo->prepare("SELECT * FROM login_system.users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Kiểm tra xem sinh viên đã đăng ký phòng chưa
            $stmt = $pdo->prepare("
                SELECT COUNT(*) FROM registrations 
                WHERE student_id = ?
            ");
            $stmt->execute([$user['username']]);
            if ($stmt->fetchColumn() > 0) {
                throw new Exception('Bạn đã đăng ký phòng rồi');
            }

            // Kiểm tra phòng còn trống không
            $stmt = $pdo->prepare("
                SELECT * FROM rooms 
                WHERE id = ? AND current_occupants < max_occupants
            ");
            $stmt->execute([$data['roomId']]);
            $room = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$room) {
                throw new Exception('Phòng không tồn tại hoặc đã đủ người');
            }

            // Thêm đăng ký mới
            $stmt = $pdo->prepare("
                INSERT INTO registrations (
                    room_id,
                    student_id,
                    student_name,
                    student_email,
                    student_phone,
                    student_faculty,
                    registration_date
                ) VALUES (?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->execute([
                $data['roomId'],
                $user['username'],
                $user['username'],
                $user['email'],
                $data['phone'],
                $data['faculty']
            ]);

            // Cập nhật số người trong phòng
            $stmt = $pdo->prepare("
                UPDATE rooms 
                SET current_occupants = current_occupants + 1
                WHERE id = ?
            ");
            $stmt->execute([$data['roomId']]);

            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['success' => true]);
        break;

    case 'cancelRegistration':
        checkLogin();
        try {
            $pdo->beginTransaction();

            // Lấy thông tin đăng ký hiện tại của sinh viên
            $stmt = $pdo->prepare("
                SELECT r.*, rm.id as room_id 
                FROM registrations r
                JOIN rooms rm ON r.room_id = rm.id
                WHERE r.student_id = ?
            ");
            $stmt->execute([$_SESSION['username']]);
            $registration = $stmt->fetch();

            if (!$registration) {
                throw new Exception('Không tìm thấy thông tin đăng ký phòng');
            }

            // Xóa đăng ký
            $stmt = $pdo->prepare("DELETE FROM registrations WHERE student_id = ?");
            $stmt->execute([$_SESSION['username']]);

            // Giảm số người trong phòng
            $stmt = $pdo->prepare("
                UPDATE rooms 
                SET current_occupants = current_occupants - 1
                WHERE id = ?
            ");
            $stmt->execute([$registration['room_id']]);

            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}
?>
