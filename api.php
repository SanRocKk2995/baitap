<?php
//Thiết lập header Json và kết nối database
header('Content-Type: application/json');
require_once 'config.php';

// Lấy danh sách tòa nhà
function getBuildings() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM buildings ORDER BY name");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Lấy danh sách phòng
function getRooms() {
    global $pdo;
    $stmt = $pdo->query("SELECT r.*, b.name as building FROM rooms r JOIN buildings b ON r.building_id = b.id");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Xử lý các request
$action = $_GET['action'] ?? '';

switch($action) {
    case 'getBuildings':
        echo json_encode(getBuildings());
        break;
    //hàm lấy danh sách phòng
    case 'getRooms':
        $sql = "SELECT r.*, b.name as building_name 
                FROM rooms r 
                JOIN buildings b ON r.building_id = b.id";
        $stmt = $pdo->query($sql);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
    //hàm thêm phòng mới
    case 'addRoom':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO rooms (number, building_id, max_occupants, price, status) VALUES (?, ?, ?, ?, 'available')");
        $stmt->execute([$data['number'], $data['building_id'], $data['max_occupants'], $data['price']]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;
    //hàm đăng ký phòng cho sinh viên
    case 'addRegistration':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $pdo->beginTransaction();
            
            // Kiểm tra số lượng người hiện tại trong phòng
            $stmt = $pdo->prepare("SELECT current_occupants, max_occupants FROM rooms WHERE id = ?");
            $stmt->execute([$data['roomId']]);
            $room = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Nếu phòng đã đủ người, không cho đăng ký
            if ($room['current_occupants'] >= $room['max_occupants']) {
                throw new Exception('Phòng đã đủ người');
            }
            
            // Thêm đăng ký mới
            $stmt = $pdo->prepare("INSERT INTO registrations (room_id, student_name, student_id, student_phone, student_email, student_faculty) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['roomId'],
                $data['studentName'],
                $data['studentId'],
                $data['studentPhone'],
                $data['studentEmail'],
                $data['studentFaculty']
            ]);
            
            // Cập nhật số người và trạng thái phòng
            $newOccupants = $room['current_occupants'] + 1;
            $newStatus = $newOccupants >= $room['max_occupants'] ? 'occupied' : 'available';
            
            $stmt = $pdo->prepare("UPDATE rooms SET current_occupants = ?, status = ? WHERE id = ?");
            $stmt->execute([$newOccupants, $newStatus, $data['roomId']]);
            
            $pdo->commit();
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
    //hàm lấy danh sách sinh viên
    case 'getAllStudents':
        $stmt = $pdo->query("
            SELECT * FROM registrations 
            ORDER BY student_name
        ");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
    //hàm lấy danh sách đăng ký
    case 'getRegistrations':
        $sql = "SELECT r.*, rm.number as room_number, b.name as building_name 
                FROM registrations r 
                JOIN rooms rm ON r.room_id = rm.id 
                JOIN buildings b ON rm.building_id = b.id 
                ORDER BY r.registration_date DESC";
        $stmt = $pdo->query($sql);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 'updateRoomStatus':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE rooms SET status = ? WHERE id = ?");
        $success = $stmt->execute([$data['status'], $data['roomId']]);
        echo json_encode(['success' => $success]);
        break;
        
    case 'cancelRegistration':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $pdo->beginTransaction();
            
            // Lấy room_id và thông tin phòng
            $stmt = $pdo->prepare("
                SELECT r.room_id, rm.current_occupants, rm.max_occupants 
                FROM registrations r
                JOIN rooms rm ON r.room_id = rm.id 
                WHERE r.id = ?
            ");
            $stmt->execute([$data['registrationId']]);
            $info = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Giảm số người và cập nhật trạng thái phòng
            $newOccupants = $info['current_occupants'] - 1;
            $newStatus = $newOccupants >= $info['max_occupants'] ? 'occupied' : 'available';
            
            $stmt = $pdo->prepare("UPDATE rooms SET current_occupants = ?, status = ? WHERE id = ?");
            $stmt->execute([$newOccupants, $newStatus, $info['room_id']]);
            
            // Xóa đăng ký
            $stmt = $pdo->prepare("DELETE FROM registrations WHERE id = ?");
            $stmt->execute([$data['registrationId']]);
            
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
    //hàm lấy danh sách sinh viên trong phòng
    case 'getStudents':
        $roomId = $_GET['roomId'];
        $sql = "SELECT r.*, DATE_FORMAT(r.registration_date, '%d/%m/%Y') as formatted_date 
                FROM registrations r 
                WHERE r.room_id = ? 
                ORDER BY r.registration_date DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$roomId]);
        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($students);
        break;
    //hàm thêm tòa nhà mới
    case 'addBuilding':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO buildings (name) VALUES (?)");
        $stmt->execute([$data['name']]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;
    //hàm cập nhật tòa nhà
    case 'updateBuilding':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $pdo->prepare("UPDATE buildings SET name = ? WHERE id = ?");
            $stmt->execute([$data['name'], $data['id']]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
    //hàm xóa tòa nhà
    case 'deleteBuilding':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $pdo->beginTransaction();
            
            // Kiểm tra xem có phòng nào đang có người ở không
            $stmt = $pdo->prepare("
                SELECT COUNT(*) as occupied_rooms 
                FROM rooms 
                WHERE building_id = ? AND current_occupants > 0
            ");
            $stmt->execute([$data['id']]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result['occupied_rooms'] > 0) {
                throw new Exception('Không thể xóa tòa nhà vì có phòng đang có người ở');
            }
            
            // Xóa tất cả đăng ký trong các phòng của tòa nhà
            $stmt = $pdo->prepare("
                DELETE r FROM registrations r
                INNER JOIN rooms rm ON r.room_id = rm.id
                WHERE rm.building_id = ?
            ");
            $stmt->execute([$data['id']]);
            
            // Xóa tất cả phòng trong tòa nhà
            $stmt = $pdo->prepare("DELETE FROM rooms WHERE building_id = ?");
            $stmt->execute([$data['id']]);
            
            // Xóa tòa nhà
            $stmt = $pdo->prepare("DELETE FROM buildings WHERE id = ?");
            $stmt->execute([$data['id']]);
            
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
    //hàm xóa phòng
    case 'deleteRoom':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $pdo->beginTransaction();
            
            // Kiểm tra xem phòng có sinh viên không
            $stmt = $pdo->prepare("
                SELECT COUNT(*) as student_count 
                FROM registrations 
                WHERE room_id = ?
            ");
            $stmt->execute([$data['roomId']]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result['student_count'] > 0) {
                throw new Exception('Không thể xóa phòng vì đang có sinh viên ở');
            }
            
            // Xóa phòng
            $stmt = $pdo->prepare("DELETE FROM rooms WHERE id = ?");
            $stmt->execute([$data['roomId']]);
            
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
    //hàm tìm kiếm sinh viên
    case 'searchStudent':
        $studentId = $_GET['studentId'];
        $sql = "SELECT r.*, rm.number as room_number, rm.price as room_price,
                b.name as building_name, r.payment_status,
                DATE_FORMAT(r.last_payment_date, '%d/%m/%Y') as formatted_payment_date
                FROM registrations r 
                JOIN rooms rm ON r.room_id = rm.id 
                JOIN buildings b ON rm.building_id = b.id
                WHERE r.student_id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$studentId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            // Định dạng lại dữ liệu trả về
            $result['payment_status'] = $result['payment_status'] ?? 'unpaid';
            $result['last_payment_date'] = $result['formatted_payment_date'] ?? null;
        }
        
        echo json_encode($result);
        break;
    //hàm thanh toán tiền phòng
    case 'makePayment':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $pdo->beginTransaction();
            
            // Cập nhật trạng thái thanh toán
            $stmt = $pdo->prepare("
                UPDATE registrations 
                SET payment_status = 'paid',
                    last_payment_date = NOW()
                WHERE id = ?
            ");
            $stmt->execute([$data['registrationId']]);
            
            // Thêm bản ghi thanh toán mới
            $stmt = $pdo->prepare("
                INSERT INTO payments (
                    registration_id, 
                    amount, 
                    electricity_fee,
                    water_fee,
                    internet_fee,
                    semester, 
                    status
                ) 
                VALUES (?, ?, ?, ?, ?, ?, 'completed')
            ");
            $stmt->execute([
                $data['registrationId'],
                $data['amount'],
                $data['electricityFee'],
                $data['waterFee'],
                $data['internetFee'],
                $data['semester']
            ]);
            
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
    case 'logout':
        session_start();
        session_destroy();
        echo json_encode(['success' => true]);
        break;
    
    case 'updateStudent':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $pdo->prepare("
                UPDATE registrations 
                SET student_name = ?, 
                    student_id = ?, 
                    student_phone = ?, 
                    student_email = ?, 
                    student_faculty = ? 
                WHERE id = ?
            ");
            $stmt->execute([
                $data['studentName'],
                $data['studentId'],
                $data['studentPhone'],
                $data['studentEmail'],
                $data['studentFaculty'],
                $data['registrationId']
            ]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;
    case 'getUnpaidStudents':
        $sql = "SELECT DISTINCT 
                    r.*, 
                    rm.number as room_number,
                    rm.price as room_price,
                    b.name as building_name,
                    DATE_FORMAT(r.registration_date, '%d/%m/%Y') as formatted_reg_date
                FROM registrations r
                JOIN rooms rm ON r.room_id = rm.id
                JOIN buildings b ON rm.building_id = b.id
                WHERE r.id NOT IN (
                    SELECT registration_id FROM payments
                )
                ORDER BY r.registration_date DESC";
        
        $stmt = $pdo->query($sql);
        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Định dạng lại giá phòng
        foreach ($students as &$student) {
            $student['room_price'] = number_format($student['room_price'], 0, ',', '.') . ' VNĐ';
        }
        
        echo json_encode($students);
        break;
    case 'getPaidStudents':
        $sql = "SELECT 
                    p.*,
                    r.student_name, 
                    r.student_id,
                    r.student_phone,
                    r.student_email,
                    r.student_faculty,
                    rm.number as room_number, 
                    b.name as building_name,
                    DATE_FORMAT(p.payment_date, '%d/%m/%Y') as formatted_payment_date,
                    DATE_FORMAT(r.registration_date, '%d/%m/%Y') as formatted_reg_date
                FROM payments p
                JOIN registrations r ON p.registration_id = r.id 
                JOIN rooms rm ON r.room_id = rm.id 
                JOIN buildings b ON rm.building_id = b.id
                ORDER BY p.payment_date DESC";
        
        $stmt = $pdo->query($sql);
        $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Định dạng lại số tiền
        foreach ($payments as &$payment) {
            $payment['amount'] = number_format($payment['amount'], 0, ',', '.') . ' VNĐ';
            $payment['payment_status'] = $payment['status']; // Đổi tên field để phù hợp với frontend
        }
        
        echo json_encode($payments);
        break;
    case 'getUtilityPrices':
        try {
            $stmt = $pdo->query("SELECT * FROM utility_prices ORDER BY id DESC LIMIT 1");
            $prices = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode([
                'success' => true,
                'prices' => $prices
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
    case 'updateUtilityPrices':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $pdo->prepare("
                INSERT INTO utility_prices (electricity_price, water_price, internet_price)
                VALUES (?, ?, ?)
            ");
            $stmt->execute([
                $data['electricity'],
                $data['water'],
                $data['internet']
            ]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
    case 'getPaymentHistory':
        try {
            $sql = "
                SELECT 
                    r.student_name,
                    r.student_id,
                    rm.number as room_number,
                    b.name as building_name,
                    p.amount,
                    p.electricity_fee,
                    p.water_fee,
                    p.internet_fee,
                    p.payment_date,
                    p.semester
                FROM payments p
                JOIN registrations r ON p.registration_id = r.id
                JOIN rooms rm ON r.room_id = rm.id
                JOIN buildings b ON rm.building_id = b.id
                ORDER BY p.payment_date DESC
            ";
            $stmt = $pdo->query($sql);
            $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'payments' => $payments
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
    case 'getUtilityUsage':
        $roomId = $_GET['roomId'];
        $month = $_GET['month'];
        $year = $_GET['year'];
        
        try {
            $stmt = $pdo->prepare("
                SELECT * FROM utility_usage 
                WHERE room_id = ? AND month = ? AND year = ?
            ");
            $stmt->execute([$roomId, $month, $year]);
            $usage = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'usage' => $usage
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
    case 'getUtilityHistory':
        $roomId = $_GET['roomId'];
        
        try {
            $stmt = $pdo->prepare("
                SELECT * FROM utility_usage 
                WHERE room_id = ?
                ORDER BY year DESC, month DESC 
                LIMIT 12
            ");
            $stmt->execute([$roomId]);
            $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'history' => $history
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
    case 'updateUtilityUsage':
        $data = json_decode(file_get_contents('php://input'), true);
        
        try {
            $stmt = $pdo->prepare("
                INSERT INTO utility_usage 
                    (room_id, month, year, electricity_usage, water_usage)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    electricity_usage = VALUES(electricity_usage),
                    water_usage = VALUES(water_usage)
            ");
            
            $stmt->execute([
                $data['roomId'],
                $data['month'],
                $data['year'],
                $data['electricityUsage'],
                $data['waterUsage']
            ]);
            
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
    case 'getUnpaidUtilityStudents':
        try {
            $currentMonth = date('n');
            $currentYear = date('Y');
            
            // Debug: In ra các giá trị
            error_log("Current Month: " . $currentMonth);
            error_log("Current Year: " . $currentYear);
            
            $sql = "SELECT DISTINCT 
                        r.*, 
                        rm.number as room_number,
                        rm.current_occupants,
                        rm.price as room_price,
                        b.name as building_name,
                        u.electricity_usage,
                        u.water_usage,
                        up.electricity_price,
                        up.water_price,
                        up.internet_price
                    FROM registrations r
                    JOIN rooms rm ON r.room_id = rm.id
                    JOIN buildings b ON rm.building_id = b.id
                    LEFT JOIN utility_usage u ON rm.id = u.room_id 
                        AND u.month = ? AND u.year = ?
                    LEFT JOIN utility_prices up ON up.id = (
                        SELECT id FROM utility_prices 
                        ORDER BY created_at DESC 
                        LIMIT 1
                    )
                    WHERE NOT EXISTS (
                        SELECT 1 FROM payments p 
                        WHERE p.registration_id = r.id 
                        AND p.payment_type = 'utility'
                        AND p.payment_month = ?
                        AND p.payment_year = ?
                    )
                    ORDER BY b.name, rm.number";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$currentMonth, $currentYear, $currentMonth, $currentYear]);
            $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Debug: In ra số lượng kết quả
            error_log("Number of students found: " . count($students));
            
            // Tính toán phí tiện ích cho mỗi sinh viên
            foreach ($students as &$student) {
                // Đảm bảo current_occupants không bao giờ là 0
                $roommates_count = max(1, intval($student['current_occupants']));
                
                // Chuyển đổi các giá trị null thành 0
                $electricity_usage = floatval($student['electricity_usage'] ?? 0);
                $water_usage = floatval($student['water_usage'] ?? 0);
                $electricity_price = floatval($student['electricity_price'] ?? 0);
                $water_price = floatval($student['water_price'] ?? 0);
                $internet_price = floatval($student['internet_price'] ?? 0);
                
                // Tính toán chi phí
                $electricity_fee = ($electricity_usage * $electricity_price) / $roommates_count;
                $water_fee = ($water_usage * $water_price) / $roommates_count;
                $internet_fee = $internet_price / $roommates_count;
                
                $total = $electricity_fee + $water_fee + $internet_fee;
                
                $student['utility_fees'] = [
                    'electricity' => number_format($electricity_fee, 0, ',', '.'),
                    'water' => number_format($water_fee, 0, ',', '.'),
                    'internet' => number_format($internet_fee, 0, ',', '.'),
                    'total' => number_format($total, 0, ',', '.')
                ];
                
                $student['usage_details'] = [
                    'electricity' => $electricity_usage,
                    'water' => $water_usage
                ];
                
                $student['current_month'] = $currentMonth;
                $student['current_year'] = $currentYear;
            }
            
            echo json_encode([
                'success' => true,
                'data' => $students
            ]);
            
        } catch (Exception $e) {
            error_log("Error in getUnpaidUtilityStudents: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
}
?>
