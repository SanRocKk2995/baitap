const formBx = document.querySelector('.formBx');
const imgBx = document.querySelector('.imgBx');
let isLoginForm = true;

function toggleForm() {
    formBx.classList.toggle('active');
    imgBx.classList.toggle('active');
    
    if (isLoginForm) {
        // Switch to Registration form
        setTimeout(() => {
            document.querySelector('form').innerHTML = `
                <h2>Đăng ký</h2>
                <input type="text" name="username" placeholder="Tên đăng nhập" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Mật khẩu" required>
                <input type="password" name="confirm_password" placeholder="Xác nhận mật khẩu" required>
                <input type="hidden" name="action" value="register">
                <input type="submit" value="Đăng ký">
                <p class="signup">Đã có tài khoản? <a href="javascript:void(0)" onclick="toggleForm()">Đăng nhập</a></p>
            `;
            document.querySelector('.content').innerHTML = `
                <h3>Chào mừng trở lại!</h3>
                <p>Đăng nhập để tiếp tục truy cập tài khoản của bạn</p>
                <button onclick="toggleForm()">Đăng nhập</button>
            `;
        }, 250);
    } else {
        // Switch to Login form
        setTimeout(() => {
            document.querySelector('form').innerHTML = `
                <h2>Đăng nhập</h2>
                <input type="text" name="username" placeholder="Tên đăng nhập" required>
                <input type="password" name="password" placeholder="Mật khẩu" required>
                <input type="hidden" name="action" value="login">
                <input type="submit" value="Đăng nhập">
                <p class="signup">Chưa có tài khoản? <a href="javascript:void(0)" onclick="toggleForm()">Đăng ký</a></p>
            `;
            document.querySelector('.content').innerHTML = `
                <h3>Chào mừng bạn!</h3>
                <p>Tạo tài khoản để truy cập tất cả các tính năng</p>
                <button onclick="toggleForm()">Đăng ký</button>
            `;
        }, 250);
    }
    isLoginForm = !isLoginForm;
}

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    // Kiểm tra mật khẩu khớp nhau khi đăng ký
    if (formData.get('action') === 'register') {
        if (formData.get('password') !== formData.get('confirm_password')) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
    }

    fetch('process.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            if (formData.get('action') === 'login') {
                window.location.href = 'ktx.html';
            } else {
                // Nếu đăng ký thành công, chuyển về form đăng nhập
                toggleForm();
            }
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi');
    });
});