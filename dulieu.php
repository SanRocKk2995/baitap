<?php
require_once 'config.php';

// Hàm xuất dữ liệu ra file CSV
function exportDataToCSV() {
    global $pdo;
    
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=ktx_data_' . date('Y-m-d') . '.csv');
    
    // Tạo file pointer cho output
    $output = fopen('php://output', 'w');
    
    // Thêm BOM cho UTF-8
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
    
    // Thêm headers
    fputcsv($output, array(
        'Mã Phòng',
        'Tòa Nhà',
        'MSSV',
        'Họ Tên',
        'Email',
        'Số Điện Thoại',
        'Khoa',
        'Trạng Thái Thanh Toán',
        'Ngày Đăng Ký'
    ));
    
    try {
        // Lấy dữ liệu từ database
        $stmt = $pdo->query("
            SELECT 
                r.number as room_number,
                b.name as building_name,
                reg.student_id,
                reg.student_name,
                reg.student_email,
                reg.student_phone,
                reg.student_faculty,
                'Chưa có thông tin' as payment_status,
                reg.registration_date
            FROM rooms r
            LEFT JOIN buildings b ON r.building_id = b.id
            LEFT JOIN registrations reg ON r.id = reg.room_id
            ORDER BY b.name, r.number
        ");
        
        // Ghi dữ liệu
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, array(
                $row['room_number'],
                $row['building_name'],
                $row['student_id'] ?? 'N/A',
                $row['student_name'] ?? 'N/A',
                $row['student_email'] ?? 'N/A',
                $row['student_phone'] ?? 'N/A',
                $row['student_faculty'] ?? 'N/A',
                $row['payment_status'] ?? 'N/A',
                $row['registration_date'] ?? 'N/A'
            ));
        }
    } catch(PDOException $e) {
        die("Lỗi xuất dữ liệu: " . $e->getMessage());
    }
    
    fclose($output);
}

// Hàm nhập dữ liệu từ file CSV
function importDataFromCSV($file) {
    global $pdo;
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return array('success' => false, 'message' => 'Lỗi upload file');
    }
    
    // Mở file CSV
    $handle = fopen($file['tmp_name'], 'r');
    if (!$handle) {
        return array('success' => false, 'message' => 'Không thể đọc file');
    }
    
    try {
        // Bắt đầu transaction
        $pdo->beginTransaction();
        
        // Bỏ qua dòng header
        fgetcsv($handle);
        
        // Đọc từng dòng trong file CSV
        while (($data = fgetcsv($handle)) !== FALSE) {
            // Kiểm tra xem tòa nhà đã tồn tại chưa
            $stmt = $pdo->prepare("SELECT id FROM buildings WHERE name = ?");
            $stmt->execute([$data[1]]);
            $building = $stmt->fetch();
            
            if (!$building) {
                // Thêm tòa nhà mới
                $stmt = $pdo->prepare("INSERT INTO buildings (name) VALUES (?)");
                $stmt->execute([$data[1]]);
                $buildingId = $pdo->lastInsertId();
            } else {
                $buildingId = $building['id'];
            }
            
            // Kiểm tra và thêm/cập nhật phòng
            $stmt = $pdo->prepare("SELECT id FROM rooms WHERE number = ? AND building_id = ?");
            $stmt->execute([$data[0], $buildingId]);
            $room = $stmt->fetch();
            
            if (!$room) {
                // Thêm phòng mới
                $stmt = $pdo->prepare("INSERT INTO rooms (number, building_id) VALUES (?, ?)");
                $stmt->execute([$data[0], $buildingId]);
                $roomId = $pdo->lastInsertId();
            } else {
                $roomId = $room['id'];
            }
            
            // Kiểm tra và thêm/cập nhật đăng ký
            if (!empty($data[2])) { // Nếu có MSSV
                $stmt = $pdo->prepare("
                    INSERT INTO registrations 
                    (room_id, student_id, student_name, student_email, student_phone, 
                     student_faculty, payment_status, registration_date)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    student_name = VALUES(student_name),
                    student_email = VALUES(student_email),
                    student_phone = VALUES(student_phone),
                    student_faculty = VALUES(student_faculty),
                    payment_status = VALUES(payment_status)
                ");
                
                $stmt->execute([
                    $roomId,
                    $data[2], // MSSV
                    $data[3], // Họ tên
                    $data[4], // Email
                    $data[5], // Số điện thoại
                    $data[6], // Khoa
                    $data[7], // Trạng thái thanh toán
                    $data[8]  // Ngày đăng ký
                ]);
            }
        }
        
        // Commit transaction
        $pdo->commit();
        fclose($handle);
        return array('success' => true, 'message' => 'Nhập dữ liệu thành công');
        
    } catch(PDOException $e) {
        // Rollback nếu có lỗi
        $pdo->rollBack();
        fclose($handle);
        return array('success' => false, 'message' => 'Lỗi nhập dữ liệu: ' . $e->getMessage());
    }
}

// Xử lý request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'export':
                exportDataToCSV();
                exit();
                break;
                
            case 'import':
                if (isset($_FILES['csv_file'])) {
                    $result = importDataFromCSV($_FILES['csv_file']);
                    echo json_encode($result);
                } else {
                    echo json_encode(array('success' => false, 'message' => 'Không tìm thấy file'));
                }
                exit();
                break;
        }
    }
}
?>

<!-- Form nhập file CSV -->
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản Lý Dữ Liệu KTX</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
        }
        .container {
            max-width: 1200px;
        }
        h2 {
            font-family: 'Merriweather', serif;
            font-weight: 700;
            color: #2c3e50;
            text-align: center;
            margin-bottom: 2rem;
            font-weight: bold;
        }
        .card {
            border: none;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
        }
        .card-title {
            color: #34495e;
            font-weight: bold;
            margin-bottom: 1.5rem;
        }
        .btn {
            padding: 10px 20px;
            font-weight: 500;
            border-radius: 5px;
        }
        .btn-primary {
            background-color: #3498db;
            border-color: #3498db;
        }
        .btn-primary:hover {
            background-color: #2980b9;
            border-color: #2980b9;
        }
        .btn-success {
            background-color: #2ecc71;
            border-color: #2ecc71;
        }
        .btn-success:hover {
            background-color: #27ae60;
            border-color: #27ae60;
        }
        .form-control {
            border-radius: 5px;
            border: 1px solid #ddd;
            padding: 10px;
        }
        .form-control:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 0.2rem rgba(52,152,219,0.25);
        }
        .card-body {
            padding: 2rem;
        }
    </style>
</head>
<body class="container mt-5">
    <h2>Quản Lý Dữ Liệu KTX </h2> 
    
    <div class="row mt-4">
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Xuất Dữ Liệu</h5>
                    <form method="post">
                        <input type="hidden" name="action" value="export">
                        <button type="submit" class="btn btn-primary">Xuất File CSV</button>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Nhập Dữ Liệu</h5>
                    <form method="post" enctype="multipart/form-data" id="importForm">
                        <input type="hidden" name="action" value="import">
                        <div class="mb-3">
                            <label for="csv_file" class="form-label">Chọn File CSV</label>
                            <input type="file" class="form-control" id="csv_file" name="csv_file" accept=".csv" required>
                        </div>
                        <button type="submit" class="btn btn-success">Nhập Dữ Liệu</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('importForm').onsubmit = async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('dulieu.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                alert(result.message);
                
                if (result.success) {
                    location.reload();
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi nhập dữ liệu');
            }
        };
    </script>
</body>
</html>
