<!DOCTYPE html>
<html lang="vn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="login.css">
</head>
<body>
</head>
<body>
    <div class="container">
        <div class="form">
            <div class="formBx">
                <form id="loginForm" action="process.php" method="post">
                    <h2>Đăng nhập</h2>
                    <input type="text" name="username" placeholder="Tên đăng nhập" required>
                    <input type="password" name="password" placeholder="Mật khẩu" required>
                    <input type="hidden" name="action" value="login">
                    <input type="submit" value="Đăng nhập">
                    <p class="signup">Chưa có tài khoản? <a href="javascript:void(0)" onclick="toggleForm()">Đăng ký</a></p>
                </form>
            </div>
            <div class="imgBx">
                <div class="content">
                    <h3>Chào mừng bạn!</h3>
                    <p>Tạo tài khoản để truy cập tất cả các tính năng</p>
                    <button onclick="toggleForm()">Đăng ký</button>
                </div>
            </div>
        </div>
    </div>

</body>
<script src="login.js"></script>
</html>
