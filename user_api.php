<?php
session_start();
// Thêm headers để tránh cache và xác định response type
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

// Thêm error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Hàm xử lý lỗi chung
function handleError($message, $code = 500) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'message' => $message
    ]);
    exit;
}

// Kiểm tra session trước khi thực hiện bất kỳ action nào
function checkLogin() {
    if (!isset($_SESSION['user_id'])) {
        handleError('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại', 401);
    }
}

try {
    require_once 'config.php';
} catch (Exception $e) {
    handleError('Không thể kết nối đến cơ sở dữ liệu');
}

$action = $_GET['action'] ?? '';

// Đảm bảo action được cung cấp
if (empty($action)) {
    handleError('Missing action parameter', 400);
}

switch($action) {
    case 'getUserInfo':
        checkLogin();
        try {
            // Sử dụng database login_system
            $stmt = $pdo->prepare("
                SELECT id, username, email, fullname, phone, faculty 
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
                       rm.number as room_number, 
                       rm.price,
                       rm.current_occupants,
                       rm.max_occupants,
                       b.name as building_name,
                       p.status as payment_status,
                       p.amount as payment_amount,
                       p.payment_month
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
                    'price' => $info['price'],
                    'current_occupants' => $info['current_occupants'],
                    'max_occupants' => $info['max_occupants']
                ];
            }

            // Nếu có thông tin thanh toán
            if ($info['payment_status']) {
                $response['payment'] = [
                    'status' => $info['payment_status'],
                    'amount' => $info['payment_amount'],
                    'payment_month' => $info['payment_month']
                ];
            }

            // Thêm thông tin tiện ích
            if ($info['registration_id']) {
                $stmt = $pdo->prepare("
                    SELECT 
                        u.month,
                        u.year,
                        COALESCE(u.electricity_usage, 0) as electricity_usage,
                        COALESCE(u.water_usage, 0) as water_usage,
                        -- Tính toán phí
                        COALESCE(u.electricity_usage * 3500, 0) as calc_electricity_fee,
                        COALESCE(u.water_usage * 15000, 0) as calc_water_fee,
                        50000 as calc_internet_fee,
                        CASE 
                            WHEN p.id IS NOT NULL AND p.payment_type = 'utility' THEN 'paid'
                            ELSE 'unpaid' 
                        END as status
                    FROM registrations r
                    JOIN rooms rm ON r.room_id = rm.id
                    LEFT JOIN utility_usage u ON rm.id = u.room_id
                        AND u.month = MONTH(CURRENT_DATE())
                        AND u.year = YEAR(CURRENT_DATE())
                    LEFT JOIN payments p ON r.id = p.registration_id
                        AND p.payment_type = 'utility'
                        AND MONTH(p.payment_date) = MONTH(CURRENT_DATE())
                        AND YEAR(p.payment_date) = YEAR(CURRENT_DATE())
                    WHERE r.id = ?
                ");
                $stmt->execute([$info['registration_id']]);
                $utilities = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($utilities) {
                    $response['utilities'] = [
                        'month' => $utilities['month'],
                        'year' => $utilities['year'],
                        'electricity_usage' => (float)$utilities['electricity_usage'],
                        'water_usage' => (float)$utilities['water_usage'],
                        'electricity_fee' => (float)$utilities['calc_electricity_fee'],
                        'water_fee' => (float)$utilities['calc_water_fee'],
                        'internet_fee' => (float)$utilities['calc_internet_fee'],
                        'status' => $utilities['status']
                    ];
                }
            }

            // Lấy thông tin thanh toán gần nhất
            $stmt = $pdo->prepare("
                SELECT * FROM payments 
                WHERE registration_id = ? 
                ORDER BY payment_date DESC 
                LIMIT 1
            ");
            $stmt->execute([$info['registration_id']]);
            $payment = $stmt->fetch(PDO::FETCH_ASSOC);

            // Debug: In ra thông tin payment
            error_log("Payment data: " . print_r($payment, true));
            error_log("Current month: " . date('n/Y'));

            // Đảm bảo trả về payment_date đúng định dạng
            if ($payment) {
                $payment['payment_date'] = date('Y-m-d H:i:s', strtotime($payment['payment_date']));
                // Debug: In ra payment_month
                error_log("Payment month: " . $payment['payment_month']);
            }

            echo json_encode($response);
        } catch (Exception $e) {
            error_log("Error in getDashboardInfo: " . $e->getMessage());
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
        
        if (!isset($data['roomId'])) {
            echo json_encode(['success' => false, 'message' => 'Thiếu thông tin đăng ký']);
            break;
        }

        try {
            $pdo->beginTransaction();

            // Lấy thông tin người dùng đầy đủ
            $stmt = $pdo->prepare("
                SELECT id, username, email, fullname, phone, faculty 
                FROM login_system.users 
                WHERE id = ?
            ");
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Kiểm tra xem người dùng đã điền đủ thông tin chưa
            if (empty($user['fullname']) || empty($user['phone']) || empty($user['faculty'])) {
                throw new Exception('Vui lòng điền đầy đủ thông tin cá nhân trước khi đăng ký phòng');
            }

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

            // Thêm đăng ký mới với đầy đủ thông tin
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
                $user['fullname'],
                $user['email'],
                $user['phone'],
                $user['faculty']
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

            // Xóa các thanh toán liên quan trước
            $stmt = $pdo->prepare("DELETE FROM payments WHERE registration_id = ?");
            $stmt->execute([$registration['id']]);

            // Sau đó xóa đăng ký
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

    case 'checkPaymentStatus':
        checkLogin();
        try {
            $requestedMonth = $_GET['month'] ?? date('n/Y');
            
            // Lấy thông tin đăng ký phòng của sinh viên
            $stmt = $pdo->prepare("
                SELECT r.*, DATE_FORMAT(r.registration_date, '%c/%Y') as start_month 
                FROM registrations r
                WHERE r.student_id = ?
            ");
            $stmt->execute([$_SESSION['username']]);
            $registration = $stmt->fetch();

            if (!$registration) {
                throw new Exception('Bạn chưa đăng ký phòng hoặc đăng ký đã bị hủy');
            }

            // Kiểm tra các tháng trước
            $currentDate = date_create_from_format('n/Y', $requestedMonth);
            if (!$currentDate) {
                throw new Exception('Định dạng tháng không hợp lệ');
            }

            // Lấy danh sách các tháng chưa thanh toán từ tháng đăng ký
            $stmt = $pdo->prepare("
                WITH RECURSIVE months AS (
                    -- Bắt đầu từ tháng đăng ký
                    SELECT STR_TO_DATE(CONCAT('01/', ?), '%d/%m/%Y') as month_date,
                           ? as month_str
                    UNION ALL
                    SELECT DATE_ADD(month_date, INTERVAL 1 MONTH),
                           DATE_FORMAT(DATE_ADD(month_date, INTERVAL 1 MONTH), '%c/%Y')
                    FROM months
                    WHERE month_date < STR_TO_DATE(CONCAT('01/', ?), '%d/%m/%Y')
                )
                SELECT m.month_str
                FROM months m
                LEFT JOIN payments p ON p.registration_id = ? 
                    AND p.payment_month = m.month_str
                WHERE p.id IS NULL
                AND m.month_date <= CURRENT_DATE()
                ORDER BY m.month_date ASC
            ");

            // Thêm năm vào tháng nếu chỉ có tháng
            $startMonth = $registration['start_month'];
            if (strlen($startMonth) <= 2) {
                $startMonth .= '/' . date('Y');
            }
            
            $stmt->execute([
                $startMonth, 
                $startMonth,
                $requestedMonth,
                $registration['id']
            ]);
            $unpaidMonths = $stmt->fetchAll(PDO::FETCH_COLUMN);

            // Kiểm tra thanh toán của tháng được yêu cầu
            $stmt = $pdo->prepare("
                SELECT COUNT(*) 
                FROM payments 
                WHERE registration_id = ? 
                AND payment_month = ?
            ");
            $stmt->execute([$registration['id'], $requestedMonth]);
            $hasPayment = $stmt->fetchColumn() > 0;

            // Kiểm tra xem tháng yêu cầu có phải là tháng trong tương lai không
            $requestedDate = date_create_from_format('n/Y', $requestedMonth);
            $currentDate = new DateTime();
            $isFutureMonth = $requestedDate > $currentDate;

            echo json_encode([
                'success' => true,
                'canPay' => !$hasPayment && !$isFutureMonth,
                'requestedMonth' => $requestedMonth,
                'startMonth' => $startMonth,
                'hasPayment' => $hasPayment,
                'unpaidMonths' => $unpaidMonths,
                'isFutureMonth' => $isFutureMonth
            ]);
        } catch (Exception $e) {
            error_log("Error in checkPaymentStatus: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'makePayment':
        checkLogin();
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $paymentMonth = $data['month'] ?? date('n/Y');
            
            $pdo->beginTransaction();

            // Lấy thông tin đăng ký phòng của sinh viên
            $stmt = $pdo->prepare("
                SELECT r.*, rm.price, rm.current_occupants 
                FROM registrations r
                JOIN rooms rm ON r.room_id = rm.id
                WHERE r.student_id = ?
            ");
            $stmt->execute([$_SESSION['username']]);
            $registration = $stmt->fetch();

            if (!$registration) {
                throw new Exception('Bạn chưa đăng ký phòng hoặc đăng ký đã bị hủy');
            }

            // Kiểm tra xem đã thanh toán tháng này chưa
            $stmt = $pdo->prepare("
                SELECT COUNT(*) 
                FROM payments 
                WHERE registration_id = ? 
                AND payment_month = ?
            ");
            $stmt->execute([$registration['id'], $paymentMonth]);
            if ($stmt->fetchColumn() > 0) {
                throw new Exception('Bạn đã thanh toán cho tháng này rồi');
            }

            // Tính toán số tiền phải trả (chia theo số người)
            $amountPerPerson = round($registration['price'] / $registration['current_occupants']);

            // Thêm thanh toán mới
            $stmt = $pdo->prepare("
                INSERT INTO payments (
                    registration_id,
                    amount,
                    payment_month,
                    status,
                    payment_date
                ) VALUES (?, ?, ?, 'completed', NOW())
            ");
            $stmt->execute([
                $registration['id'],
                $amountPerPerson,
                $paymentMonth
            ]);

            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            error_log("Error in makePayment: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'getPaymentHistory':
        checkLogin();
        try {
            $stmt = $pdo->prepare("
                SELECT 
                    p.*,
                    r.student_id,
                    rm.number as room_number,
                    rm.price
                FROM payments p
                JOIN registrations r ON p.registration_id = r.id
                JOIN rooms rm ON r.room_id = rm.id
                WHERE r.student_id = ?
                ORDER BY p.payment_date DESC
            ");
            $stmt->execute([$_SESSION['username']]);
            $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true, 
                'payments' => array_map(function($payment) {
                    return [
                        'payment_date' => $payment['payment_date'],
                        'amount' => $payment['amount'],
                        'payment_type' => $payment['payment_type'],
                        'status' => $payment['status'],
                        'month' => $payment['month'],
                        'room_number' => $payment['room_number']
                    ];
                }, $payments)
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false, 
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'getUnpaidStudents':
        // API endpoint cho admin để lấy danh sách sinh viên chưa thanh toán
        checkAdminLogin(); // Đảm bảo chỉ admin mới có thể truy cập
        try {
            $stmt = $pdo->prepare("
                SELECT DISTINCT r.*, u.username, u.email, rm.number as room_number, 
                       rm.price, b.name as building_name
                FROM registrations r
                JOIN login_system.users u ON r.student_id = u.username
                JOIN rooms rm ON r.room_id = rm.id
                JOIN buildings b ON rm.building_id = b.id
                LEFT JOIN payments p ON r.id = p.registration_id
                WHERE (p.id IS NULL OR p.status != 'completed')
                    AND r.payment_status = 'unpaid'
                ORDER BY r.registration_date DESC
            ");
            $stmt->execute();
            $unpaidStudents = $stmt->fetchAll();

            echo json_encode([
                'success' => true, 
                'students' => $unpaidStudents
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false, 
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'updateUserInfo':
        checkLogin();
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Validate dữ liệu
            if (empty($data['username']) || empty($data['email'])) {
                throw new Exception('Thiếu thông tin bắt buộc');
            }

            // Cập nhật thông tin trong database
            $stmt = $pdo->prepare("
                UPDATE login_system.users 
                SET username = ?,
                    email = ?,
                    fullname = ?,
                    phone = ?,
                    faculty = ?
                WHERE id = ?
            ");
            
            $stmt->execute([
                $data['username'],
                $data['email'],
                $data['fullname'],
                $data['phone'],
                $data['faculty'],
                $_SESSION['user_id']
            ]);

            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode([
                'success' => false, 
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'makeUtilityPayment':
        checkLogin();
        $data = json_decode(file_get_contents('php://input'), true);
        
        try {
            $pdo->beginTransaction();

            // Lấy thông tin đăng ký phòng của sinh viên
            $stmt = $pdo->prepare("
                SELECT r.* FROM registrations r
                WHERE r.student_id = ?
            ");
            $stmt->execute([$_SESSION['username']]);
            $registration = $stmt->fetch();

            if (!$registration) {
                throw new Exception('Không tìm thấy thông tin đăng ký phòng');
            }

            // Kiểm tra xem đã thanh toán tiện ích tháng này chưa
            $stmt = $pdo->prepare("
                SELECT id FROM payments 
                WHERE registration_id = ? 
                AND payment_type = 'utility'
                AND MONTH(payment_date) = MONTH(CURRENT_DATE())
                AND YEAR(payment_date) = YEAR(CURRENT_DATE())
            ");
            $stmt->execute([$registration['id']]);
            if ($stmt->fetch()) {
                throw new Exception('Tiện ích tháng này đã được thanh toán');
            }

            // Thêm thanh toán tiện ích mới
            $stmt = $pdo->prepare("
                INSERT INTO payments (
                    registration_id,
                    amount,
                    status,
                    payment_date,
                    payment_type
                ) VALUES (?, ?, 'completed', NOW(), 'utility')
            ");
            $stmt->execute([
                $registration['id'],
                $data['electricity_fee'] + $data['water_fee'] + $data['internet_fee']
            ]);

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
