<?php
session_start();
require_once 'configlogin.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    if ($action === 'register') {
        $username = trim($_POST['username']);
        $email = trim($_POST['email']);
        $password = $_POST['password'];

        // Kiểm tra username đã tồn tại
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->fetchColumn() > 0) {
            echo json_encode(['success' => false, 'message' => 'Tên đăng nhập đã tồn tại']);
            exit;
        }

        // Kiểm tra email đã tồn tại
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetchColumn() > 0) {
            echo json_encode(['success' => false, 'message' => 'Email đã được sử dụng']);
            exit;
        }

        // Mã hóa mật khẩu
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        try {
            $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
            $stmt->execute([$username, $email, $hashed_password]);
            echo json_encode(['success' => true, 'message' => 'Đăng ký thành công! Vui lòng đăng nhập.']);
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Lỗi: ' . $e->getMessage()]);
        }
    }

    elseif ($action === 'login') {
        $username = trim($_POST['username']);
        $password = $_POST['password'];

        try {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                echo json_encode([
                    'success' => true, 
                    'message' => 'Đăng nhập thành công',
                    'role' => $user['role']
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Tên đăng nhập hoặc mật khẩu không đúng']);
            }
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Lỗi: ' . $e->getMessage()]);
        }
    }
}
?>