# 📊 BÁO CÁO CHI TIẾT DỰ ÁN LITEBUY - HỆ THỐNG WEB BÁN HÀNG

## 🏗️ TỔNG QUAN KIẾN TRÚC
Dự án LiteBuy là một hệ thống thương mại điện tử full-stack sử dụng:
- Frontend: React + Vite (Port 5173)
- Backend: Spring Boot + Java 17 (Port 8080)  
- Database: PostgreSQL (Port 5432)
- Authentication: JWT + Google OAuth

═══════════════════════════════════════════════════════════════════════════════

## 📁 CẤU TRÚC THƊ MỤC GỐC (ROOT DIRECTORY)

### 🔧 Files Cấu hình Chính

**📄 package.json**
- Chức năng: Quản lý dependencies và scripts cho React frontend
- Công nghệ: Node.js package manager
- Dependencies chính: React 18.2.0, Vite 4.4.5, React Router DOM 6.30.1
- Scripts: dev (khởi động Vite), build (build production), preview (preview build)

**📄 vite.config.js**  
- Chức năng: Cấu hình Vite build tool và development server
- Tính năng: Proxy API từ /api/* → localhost:8080, CORS configuration
- Plugins: @vitejs/plugin-react để hỗ trợ React

**📄 index.html**
- Chức năng: Entry point HTML chính cho React SPA
- Mount point: <div id="root"> để render React app

**📄 database.sql**
- Chức năng: Schema SQL để tạo database PostgreSQL
- Tables: users, products, orders, order_items, cart_items
- Features: Auto-increment IDs, foreign keys, timestamps

### 🎯 Files Batch Scripts Tự động hóa

**📄 start-project.bat** 
- Chức năng: Script khởi động toàn bộ dự án (Frontend + Backend)
- Quy trình: Kiểm tra hệ thống → Start Backend → Start Frontend
- Kiểm tra: Java, Maven, Node.js, PostgreSQL

**📄 stop-project.bat**
- Chức năng: Dừng tất cả processes của dự án
- Kill ports: 8080 (Backend), 5173 (Frontend)

**📄 check-system.bat**
- Chức năng: Kiểm tra môi trường phát triển
- Verify: Java 17+, Maven 3.6+, Node.js 16+, PostgreSQL

**📄 setup-database.bat & setup-database-v2.bat**
- Chức năng: Tự động setup PostgreSQL database
- Tạo database 'litebuy_db' với user postgres

**📄 start-backend.bat**
- Chức năng: Khởi động riêng Spring Boot backend
- Maven: clean compile spring-boot:run

**📄 rebuild-backend.bat**
- Chức năng: Rebuild và restart backend
- Clean target folder trước khi build lại

**📄 test-auth.bat & test-system.bat**
- Chức năng: Test authentication và hệ thống
- Automated testing scripts

**📄 quick-setup.bat & auto-start.bat**
- Chức năng: Setup nhanh và khởi động tự động

═══════════════════════════════════════════════════════════════════════════════

## 🎨 THƊ MỤC PUBLIC (Static Assets)

**📁 public/**
- Chức năng: Chứa static files được serve trực tiếp

**📁 public/img/**
- brand-logo.png: Logo thương hiệu LiteBuy
- favicon.png: Icon hiển thị trên browser tab

═══════════════════════════════════════════════════════════════════════════════

## ⚛️ THƊ MỤC SRC (React Frontend Source)

### 📄 Files Gốc

**📄 src/main.jsx**
- Chức năng: Entry point cho React application
- Setup: ReactDOM.createRoot, StrictMode, ErrorBoundary wrapper
- Mount: Render App component vào DOM

**📄 src/App.jsx** 
- Chức năng: Root component với routing và providers
- Setup: BrowserRouter, AuthProvider, GoogleOAuthProvider
- Routes: Protected routes, admin routes, public routes
- Features: Authentication guards, role-based access

**📄 src/App.css**
- Chức năng: Global CSS styles cho toàn bộ ứng dụng

### 🧩 THƊ MỤC COMPONENTS (UI Components)

**📄 src/components/Navbar.jsx**
- Chức năng: Navigation bar với menu, search, user profile
- Features: Responsive design, user authentication status
- Integration: AuthContext để hiển thị login/logout

**📄 src/components/Footer.jsx**
- Chức năng: Footer với thông tin liên hệ, links
- Styling: ../styles/footer.css

**📄 src/components/Carousel.jsx**
- Chức năng: Image carousel cho hero section
- Data source: ../data/heroSlides.jsx
- Styling: ../styles/carousel.css

**📄 src/components/ProductCard.jsx**
- Chức năng: Card component hiển thị thông tin sản phẩm
- Features: Image, price, ratings, add to cart button
- Props: product data object

**📄 src/components/FlashSaleItem.jsx**
- Chức năng: Special component cho flash sale products
- Features: Countdown timer, discount percentage
- Styling: ../styles/flashSale.css

**📄 src/components/ProductFilters.jsx**
- Chức năng: Filter sidebar cho products page
- Filters: Category, price range, brand, ratings

**📄 src/components/ProductReviews.jsx**
- Chức năng: Reviews section cho product detail
- Features: Rating stars, comment text, user info
- Styling: ../styles/productReviews.css

**📄 src/components/ErrorBoundary.jsx**
- Chức năng: Error handling wrapper cho React components
- Fallback: Error UI khi component crash

**📄 src/components/SnowEffect.jsx**
- Chức năng: Decorative snow animation effect
- CSS: ../styles/snowEffect.css

**📄 src/components/PopupPromotion.jsx**
- Chức năng: Popup modal cho promotional offers
- Features: Auto-show, closeable, promotional content

### 🔗 THƊ MỤC CONTEXT (State Management)

**📄 src/context/AuthContext.jsx**
- Chức năng: Global authentication state management
- Features: Login/logout, user session, token storage
- Methods: loginWithGoogle, register, logout
- Storage: localStorage cho user data và JWT token

### 🎣 THƊ MỤC HOOKS (Custom React Hooks)

**📄 src/hooks/index.js**
- Chức năng: Export tất cả custom hooks

**📄 src/hooks/useProductData.js**
- Chức năng: Hook quản lý product data fetching
- Features: Loading states, error handling, caching

**📄 src/hooks/useProductFilters.js**
- Chức năng: Hook quản lý filter logic cho products
- State: Filter criteria, filtered results

**📄 src/hooks/useStableCallback.js**
- Chức năng: Hook tối ưu callback functions
- Purpose: Prevent unnecessary re-renders

**📄 src/hooks/usePreventRerender.js**
- Chức năng: Hook tối ưu performance
- Purpose: Memoization và prevent re-renders

### 📄 THƊ MỤC PAGES (Page Components)

#### 🏠 Pages Chính

**📄 src/pages/Home.jsx**
- Chức năng: Trang chủ với hero carousel, featured products, flash sales
- APIs: productsAPI.search(), categoriesAPI.getAll()
- Components: Carousel, FlashSaleItem, ProductCard
- Styling: ../styles/home.css, ../styles/flashSale.css

**📄 src/pages/Products.jsx & Products-api.jsx**
- Chức năng: Trang danh sách sản phẩm với search và filter
- Features: Pagination, sorting, search với Fuse.js
- Components: ProductCard, ProductFilters
- APIs: productsAPI với advanced search

**📄 src/pages/ProductDetail.jsx**
- Chức năng: Trang chi tiết sản phẩm
- Features: Image gallery, specifications, reviews, add to cart
- APIs: productsAPI.getById(), reviewsAPI
- Styling: ../styles/productDetail.css

**📄 src/pages/Cart.jsx**
- Chức năng: Trang giỏ hàng
- Features: Item management, quantity update, total calculation
- Local storage: Cart persistence
- Styling: ../styles/cart.css

**📄 src/pages/Checkout.jsx**
- Chức năng: Trang thanh toán
- Features: Shipping info, payment method, order summary
- Validation: Form validation, order creation
- Styling: ../styles/checkout.css

**📄 src/pages/OrderConfirmation.jsx**
- Chức năng: Trang xác nhận đơn hàng thành công
- Display: Order details, tracking info

**📄 src/pages/OrderStatus.jsx**
- Chức năng: Trang theo dõi trạng thái đơn hàng
- Features: Order tracking, status updates
- Styling: ../styles/orderStatus.css

#### 🔐 Pages Authentication

**📄 src/pages/Login.jsx & Login-new.jsx**
- Chức năng: Trang đăng nhập với multiple versions
- Features: Form login, Google OAuth integration
- Integration: AuthContext, react-oauth/google
- Styling: ../styles/auth.css

**📄 src/pages/Register.jsx & RegisterTest.jsx**
- Chức năng: Trang đăng ký tài khoản
- Features: Form validation, email verification
- APIs: authAPI.register()

#### 👤 Pages User

**📄 src/pages/Profile.jsx**
- Chức năng: Trang profile người dùng
- Features: Edit info, order history, settings
- Styling: ../styles/profile.css

#### 🏪 Pages Seller

**📄 src/pages/SellerDashboard.jsx**
- Chức năng: Dashboard cho seller
- Features: Sales analytics, product management
- Styling: ../styles/seller.css

**📄 src/pages/AddProduct.jsx**
- Chức năng: Trang thêm sản phẩm mới
- Features: Form upload, image handling, validation

**📄 src/pages/ProductManagement.jsx**
- Chức năng: Quản lý sản phẩm cho seller
- Features: CRUD operations, inventory management
- Styling: ../styles/productManagement.css

#### 🛍️ Pages Special

**📄 src/pages/FlashSalePage.jsx**
- Chức năng: Trang flash sale chuyên biệt
- Features: Countdown timers, limited time offers
- Components: FlashSaleItem

**📄 src/pages/ReviewsPage.jsx**
- Chức năng: Trang reviews và ratings
- Features: Review listing, rating filters

#### 🔧 Pages Development

**📄 src/pages/ApiTest.jsx**
- Chức năng: Trang test API endpoints
- Purpose: Development và debugging
- Features: API call testing, response display

#### 👑 THƊ MỤC ADMIN

**📄 src/pages/Admin/AdminDashboard.jsx**
- Chức năng: Dashboard quản trị hệ thống
- Features: User management, system analytics, reports
- Access: Admin role only
- Styling: ../styles/admin.css

**📄 src/pages/Admin/AdminLogin.jsx**
- Chức năng: Login riêng cho admin
- Security: Separate authentication flow

### 🌐 THƊ MỤC SERVICES (API Integration)

**📄 src/services/api.js**
- Chức năng: Central API service layer
- Features: HTTP client, authentication headers, error handling
- Endpoints: authAPI, productsAPI, ordersAPI, cartAPI, etc.
- Config: Base URL, timeout, CORS settings
- Utils: apiCall helper, token management

**📄 src/debug-api.js**
- Chức năng: API debugging utilities
- Purpose: Development debugging tools

### 🎨 THƊ MỤC STYLES (CSS Styling)

**📄 src/styles/admin.css** - Admin dashboard styling<br>
**📄 src/styles/auth.css** - Authentication pages styling  <br>
**📄 src/styles/carousel.css** - Carousel component styling<br>
**📄 src/styles/cart.css** - Shopping cart styling<br>
**📄 src/styles/checkout.css** - Checkout process styling<br>
**📄 src/styles/flashSale.css** - Flash sale components styling<br>
**📄 src/styles/footer.css** - Footer component styling<br>
**📄 src/styles/home.css** - Homepage styling<br>
**📄 src/styles/navbar.css** - Navigation bar styling<br>
**📄 src/styles/orderStatus.css** - Order tracking styling<br>
**📄 src/styles/popupPromotion.css** - Popup modal styling<br>
**📄 src/styles/productDetail.css** - Product detail page styling<br>
**📄 src/styles/productManagement.css** - Product management styling<br>
**📄 src/styles/productReviews.css** - Reviews component styling<br>
**📄 src/styles/products.css** - Products listing styling<br>
**📄 src/styles/profile.css** - User profile styling<br>
**📄 src/styles/seller.css** - Seller dashboard styling<br>
**📄 src/styles/snowEffect.css** - Snow animation styling

### 📊 THƊ MỤC DATA (Static Data)

**📄 src/data/heroSlides.jsx**
- Chức năng: Static data cho homepage carousel
- Content: Hero images, titles, descriptions

**📄 src/data/flashSaleData.jsx**
- Chức năng: Static data cho flash sale items
- Content: Flash sale products, discount info

═══════════════════════════════════════════════════════════════════════════════

## ☕ THƯ MỤC BACKEND-JAVA (Spring Boot Backend)

### 📄 Files Cấu hình

**📄 backend-java/pom.xml**
- Chức năng: Maven configuration và dependency management
- Parent: spring-boot-starter-parent 3.2.0
- Dependencies chính:
  * spring-boot-starter-web: REST API framework
  * spring-boot-starter-data-jpa: Database ORM
  * spring-boot-starter-security: Authentication & Authorization  
  * spring-boot-starter-validation: Input validation
  * postgresql: Database driver
  * jjwt (0.11.5): JWT token handling
  * lombok: Code generation (getters/setters)
  * spring-boot-devtools: Hot reload development
- Build target: Java 17, JAR packaging

**📄 backend-java/src/main/resources/application.properties**
- Chức năng: Spring Boot application configuration
- Database config:
  * URL: jdbc:postgresql://localhost:5432/litebuy_db
  * Username/Password: postgres/1
  * JPA: hibernate.ddl-auto=update, show-sql=true
- Server config:
  * Port: 8080
  * Context-path: /api (tất cả endpoints prefix /api)
- JWT config:
  * Secret: Base64 encoded key
  * Expiration: 86400000ms (24 hours)
- CORS: Allow origin http://localhost:5173
- File upload: Max 10MB
- Logging: DEBUG level cho com.litebuy package

### 🚀 Main Application

**📄 backend-java/src/main/java/com/litebuy/ecommerce/EcommerceBackendApplication.java**
- Chức năng: Spring Boot main application class
- Annotation: @SpringBootApplication (auto-configuration)
- Entry point: public static void main(String[] args)
- Auto-scan: Tự động scan components trong package com.litebuy.ecommerce

### 🎛️ THƯ MỤC CONTROLLER (REST API Endpoints)

**📄 AuthController.java**
- Package: com.litebuy.ecommerce.controller
- Annotation: @RestController, @RequestMapping("/auth"), @CrossOrigin
- Dependencies: AuthenticationManager, UserRepository, PasswordEncoder, JwtUtils
- Endpoints chi tiết:
  * POST /api/auth/login: Login với email/password
    - Input: LoginRequest DTO (email, password)
    - Process: Kiểm tra email exists → Authentication → Generate JWT
    - Output: JwtResponse (token, user info) hoặc error message
    - Validation: Email format, password min 6 chars
  * POST /api/auth/register: Đăng ký user mới
    - Input: RegisterRequest DTO
    - Process: Validate → Encode password → Save user
    - Output: Success/error message
  * POST /api/auth/google-login: Google OAuth authentication
    - Input: Google credential token
    - Process: Verify Google token → Create/find user → Generate JWT
- Security: Password encoding với BCrypt
- Error handling: Try-catch với specific error messages

**📄 ProductController.java**
- Package: com.litebuy.ecommerce.controller  
- Annotation: @RestController, @RequestMapping("/products"), @CrossOrigin
- Dependencies: ProductRepository
- Endpoints chi tiết:
  * GET /api/products: Lấy danh sách sản phẩm
    - Params: page, size, sortBy, sortDir, category, name
    - Features: Pagination, sorting, filtering
    - Output: Page<Product> object
  * GET /api/products/{id}: Lấy chi tiết 1 sản phẩm
    - Output: Product object hoặc 404 not found
  * POST /api/products: Tạo sản phẩm mới (Admin/Seller)
    - Input: Product object với validation
    - Security: Require authentication
  * PUT /api/products/{id}: Cập nhật sản phẩm
    - Input: Product object, path variable id
  * DELETE /api/products/{id}: Xóa sản phẩm (soft delete)
  * GET /api/products/search: Advanced search
    - Params: keyword, category, minPrice, maxPrice
    - Query: JPA custom queries với @Query annotation
  * GET /api/products/flash-sale: Flash sale products
    - Filter: isFlashSale=true và flashSaleEnd > current time
- Pagination: Spring Data Pageable interface
- Sorting: Dynamic sorting với Sort.by()

**📄 CartController.java**
- Package: com.litebuy.ecommerce.controller
- Dependencies: CartItemRepository, ProductRepository
- Endpoints chi tiết:
  * GET /api/cart: Lấy giỏ hàng của user
    - Security: Require authentication, get user from JWT
    - Output: List<CartItem> với product details
  * POST /api/cart/add: Thêm sản phẩm vào giỏ
    - Input: productId, quantity
    - Logic: Check product exists → Check stock → Add/update cart item
  * PUT /api/cart/update: Cập nhật số lượng
    - Input: cartItemId, newQuantity
    - Validation: quantity > 0, <= stock
  * DELETE /api/cart/remove/{itemId}: Xóa item khỏi giỏ
  * DELETE /api/cart/clear: Xóa toàn bộ giỏ hàng
- Session management: User-specific cart dựa trên JWT user ID

**📄 FlashSaleController.java**
- Package: com.litebuy.ecommerce.controller
- Chức năng: Xử lý flash sale logic
- Endpoints:
  * GET /api/flash-sales/active: Lấy flash sales đang active
  * POST /api/flash-sales/create: Tạo flash sale (Admin only)
  * PUT /api/flash-sales/{id}/end: Kết thúc flash sale sớm
- Features: Time validation, discount calculation
- Business logic: Check thời gian bắt đầu/kết thúc

**📄 HealthController.java**
- Package: com.litebuy.ecommerce.controller
- Endpoint: GET /api/health
- Chức năng: Health check cho monitoring systems
- Response: {"status": "UP", "timestamp": "...", "database": "connected"}
- No authentication required

### 📊 THƯ MỤC ENTITY (JPA Database Models)

**📄 User.java**
- Package: com.litebuy.ecommerce.entity
- Annotations: @Entity, @Table(name = "users")
- Implements: UserDetails (Spring Security interface)
- Fields chi tiết:
  * @Id @GeneratedValue Long id: Primary key
  * @NotBlank @Size(max=50) String name: User full name
  * @Email @Column(unique=true) String email: Login email
  * @NotBlank @Size(min=6) String password: Encoded password
  * String phoneNumber: Optional phone
  * @Column(columnDefinition="TEXT") String address: Full address
  * @Enumerated(EnumType.STRING) Role role: USER/ADMIN/SELLER
  * Boolean isActive: Account active status
  * LocalDateTime createdAt: Auto timestamp
  * LocalDateTime updatedAt: Auto update timestamp
- Relationships: 
  * @OneToMany(mappedBy="user") List<Order> orders
- Security methods: getAuthorities(), isAccountNonExpired(), etc.
- Validation: Jakarta validation annotations

**📄 Product.java**
- Package: com.litebuy.ecommerce.entity
- Annotations: @Entity, @Table(name = "products"), @Data, @Builder (Lombok)
- Fields chi tiết:
  * @Id @GeneratedValue Long id: Primary key
  * @NotBlank String name: Product name
  * @Column(columnDefinition="TEXT") String description: Long description
  * @NotNull @Column(precision=10, scale=2) BigDecimal price: Original price
  * @Column(precision=10, scale=2) BigDecimal salePrice: Discounted price
  * @PositiveOrZero Integer stock: Available quantity
  * @Column(length=500) String imageUrl: Product image URL
  * String category: Product category
  * String brand: Product brand
  * Boolean isFlashSale: Flash sale flag
  * LocalDateTime flashSaleEnd: Flash sale end time
  * @Builder.Default Boolean isActive = true: Active status
  * LocalDateTime createdAt, updatedAt: Timestamps
- Business logic: Price calculation, stock management
- Lombok: Auto-generates getters, setters, constructors

**📄 Order.java**
- Package: com.litebuy.ecommerce.entity
- Annotations: @Entity, @Table(name = "orders")
- Fields chi tiết:
  * @Id @GeneratedValue Long id: Primary key
  * @ManyToOne @JoinColumn(name="user_id") User user: Order owner
  * @NotNull @Column(precision=10, scale=2) BigDecimal totalAmount: Total order value
  * @Enumerated(EnumType.STRING) OrderStatus status: PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED
  * @Column(columnDefinition="TEXT") String shippingAddress: Delivery address
  * String phoneNumber: Contact phone
  * String notes: Special instructions
  * LocalDateTime createdAt, updatedAt: Timestamps
- Relationships:
  * @OneToMany(mappedBy="order", cascade=CascadeType.ALL) List<OrderItem> orderItems
- Business logic: Order total calculation, status workflow

**📄 OrderItem.java**
- Package: com.litebuy.ecommerce.entity
- Annotations: @Entity, @Table(name = "order_items")
- Fields chi tiết:
  * @Id @GeneratedValue Long id: Primary key
  * @ManyToOne @JoinColumn(name="order_id") Order order: Parent order
  * @ManyToOne @JoinColumn(name="product_id") Product product: Ordered product
  * @NotNull @Positive Integer quantity: Order quantity
  * @NotNull @Column(precision=10, scale=2) BigDecimal price: Price tại thời điểm order
- Purpose: Store order details, preserve price history
- Relationships: Many order items per order, reference product

**📄 CartItem.java**
- Package: com.litebuy.ecommerce.entity
- Annotations: @Entity, @Table(name = "cart_items")
- Fields chi tiết:
  * @Id @GeneratedValue Long id: Primary key
  * @ManyToOne @JoinColumn(name="user_id") User user: Cart owner
  * @ManyToOne @JoinColumn(name="product_id") Product product: Cart product
  * @NotNull @Positive Integer quantity: Cart quantity
  * LocalDateTime createdAt: Added to cart time
- Purpose: Temporary storage cho shopping cart
- Constraints: Unique constraint trên (user_id, product_id)

### 🏪 THƯ MỤC REPOSITORY (Data Access Layer)

**📄 UserRepository.java**
- Interface extends: JpaRepository<User, Long>
- Custom methods:
  * Optional<User> findByEmail(String email): Find by login email
  * Boolean existsByEmail(String email): Check email exists
  * List<User> findByRole(Role role): Find by user role
  * @Query("SELECT u FROM User u WHERE u.isActive = true") List<User> findActiveUsers()

**📄 ProductRepository.java**
- Interface extends: JpaRepository<Product, Long>
- Custom methods:
  * List<Product> findByActiveTrue(): Active products only
  * Page<Product> findByActiveTrue(Pageable pageable): Paginated active products
  * Page<Product> findByCategory(String category, Pageable pageable): Filter by category
  * Page<Product> findByCategoryAndNameContainingIgnoreCase(): Category + name search
  * Page<Product> findByNameContainingIgnoreCase(): Name search (case-insensitive)
  * List<Product> findByIsFlashSaleTrue(): Flash sale products
  * @Query custom searches: Price range, multiple filters
  * @Query("SELECT p FROM Product p WHERE p.flashSaleEnd > :now") List<Product> findActiveFlashSales(@Param("now") LocalDateTime now)

**📄 CartItemRepository.java**
- Interface extends: JpaRepository<CartItem, Long>
- Custom methods:
  * List<CartItem> findByUserId(Long userId): User's cart items
  * Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId): Check existing item
  * void deleteByUserId(Long userId): Clear user cart
  * @Query("SELECT SUM(ci.quantity * p.price) FROM CartItem ci JOIN ci.product p WHERE ci.user.id = :userId") BigDecimal calculateCartTotal(@Param("userId") Long userId)

**📄 OrderRepository.java**
- Interface extends: JpaRepository<Order, Long>
- Custom methods:
  * List<Order> findByUserId(Long userId): User's orders
  * Page<Order> findByUserIdOrderByCreatedAtDesc(): Paginated user orders
  * List<Order> findByStatus(OrderStatus status): Filter by status
  * @Query statistics queries: Sales reports, revenue calculations

### 🔒 THƯ MỤC SECURITY (Spring Security Configuration)

**📄 SecurityConfig.java**
- Package: com.litebuy.ecommerce.config
- Annotations: @Configuration, @EnableWebSecurity
- Dependencies: UserDetailsServiceImpl, JwtAuthenticationFilter
- Bean definitions:
  * @Bean PasswordEncoder: BCryptPasswordEncoder for password hashing
  * @Bean AuthenticationManager: Handle authentication
  * @Bean SecurityFilterChain: HTTP security configuration
  * @Bean CorsConfigurationSource: CORS policy
- Security rules:
  * Public endpoints: /api/auth/**, /api/products/**, /api/health
  * Protected endpoints: /api/cart/**, /api/orders/**
  * Admin endpoints: /api/admin/**
- Session policy: STATELESS (JWT-based)
- CORS: Allow http://localhost:5173 origin

**📄 JwtUtils.java**
- Package: com.litebuy.ecommerce.security
- Annotation: @Component
- Configuration: @Value từ application.properties
- Methods:
  * generateJwtToken(Authentication auth): Tạo JWT token
  * getUserNameFromJwtToken(String token): Extract username từ token
  * validateJwtToken(String token): Validate token signature và expiration
  * getSigningKey(): Create signing key từ secret
- JWT library: jjwt-api với HS256 algorithm
- Token format: Bearer {token}

**📄 JwtAuthenticationFilter.java**
- Package: com.litebuy.ecommerce.security
- Extends: OncePerRequestFilter
- Purpose: Intercept HTTP requests, validate JWT tokens
- Flow:
  1. Extract token từ Authorization header
  2. Validate token với JwtUtils
  3. Load user details từ database
  4. Set authentication context
  5. Continue filter chain
- Error handling: Invalid/expired token responses

**📄 UserDetailsServiceImpl.java**
- Package: com.litebuy.ecommerce.security
- Implements: UserDetailsService (Spring Security)
- Method: loadUserByUsername(String email): Load user for authentication
- Integration: Query UserRepository by email
- Returns: UserDetails object (User entity implements này)

### 📦 THƯ MỤC DTO (Data Transfer Objects)

**📄 LoginRequest.java**
- Package: com.litebuy.ecommerce.dto
- Purpose: Login API request format
- Fields:
  * @NotBlank @Email String email: Login email
  * @NotBlank @Size(min=6, max=40) String password: Login password
- Validation: Jakarta validation annotations
- Methods: Getters, setters, constructors

**📄 RegisterRequest.java**
- Package: com.litebuy.ecommerce.dto
- Purpose: Registration API request format
- Fields: name, email, password, confirmPassword, phoneNumber, address
- Validation: Email format, password strength, confirm password match
- Custom validation: @UniqueEmail annotation

**📄 JwtResponse.java**
- Package: com.litebuy.ecommerce.dto
- Purpose: Authentication API response format
- Fields:
  * String token: JWT access token
  * String type = "Bearer": Token type
  * Long id: User ID
  * String name: User name
  * String email: User email
  * String role: User role
- Constructor: Build từ User entity và token string

### ⚙️ THƯ MỤC CONFIG (Spring Configuration)

**📄 SecurityConfig.java** (đã mô tả ở phần Security)

**📄 DataInitializer.java**
- Package: com.litebuy.ecommerce.config
- Annotations: @Component, @EventListener
- Purpose: Initialize default data khi application startup
- Events: ApplicationReadyEvent
- Data initialization:
  * Default admin user
  * Sample products
  * Sample categories
- Conditional: Chỉ chạy nếu database empty

### 🎯 THƯ MỤC TARGET (Build Output)

**📄 ecommerce-backend-0.0.1-SNAPSHOT.jar**
- Chức năng: Executable JAR file (Spring Boot fat JAR)
- Build: Maven generated artifact với spring-boot:repackage
- Structure: Classes + dependencies + embedded Tomcat
- Run: java -jar ecommerce-backend-0.0.1-SNAPSHOT.jar
- Deployment: Production-ready Spring Boot application

**📁 target/classes/**
- Compiled Java classes (.class files)
- Resources: application.properties, static files
- Auto-generated: Maven compile phase

**📁 target/generated-sources/**
- Maven generated source code
- Annotations processing output

**📁 target/maven-archiver/**
- pom.properties: Build metadata
- JAR manifest information

═══════════════════════════════════════════════════════════════════════════════

## 🔄 LUỒNG HOẠT ĐỘNG TỔNG QUAN

### 1. Khởi động hệ thống:
```
start-project.bat → Check System → Start Backend (8080) → Start Frontend (5173)
```

### 2. User Authentication:
```
Login Page → Google OAuth/Form → Backend Validation → JWT Token → Protected Routes
```

### 3. Product Management:
```
Products Page → API Call → Spring Controller → JPA Repository → PostgreSQL → Response
```

### 4. Order Processing:
```
Cart → Checkout → Order Creation → Database Storage → Confirmation
```

### 5. API Flow:
```
Frontend → Vite Proxy (/api/*) → Spring Boot (8080) → PostgreSQL → Response
```

═══════════════════════════════════════════════════════════════════════════════

## 🌐 KIẾN TRÚC API VÀ CÁCH HOẠT ĐỘNG CHI TIẾT

### 🔧 **CÁCH API ĐƯỢC TẠO RA (API Creation Process)**

#### **1. Thiết kế Database Schema (PostgreSQL)**
```sql
-- Bước 1: Tạo database và tables
CREATE DATABASE litebuy_db;
CREATE TABLE users (id, name, email, password, role, ...);
CREATE TABLE products (id, name, price, stock, category, ...);
CREATE TABLE orders (id, user_id, total_amount, status, ...);
```

#### **2. Tạo JPA Entities (Object-Relational Mapping)**
```java
// User.java - Map database table → Java object
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Email @Column(unique = true)
    private String email;
    
    @OneToMany(mappedBy = "user")
    private List<Order> orders;
}
```

#### **3. Tạo Repository Layer (Data Access)**
```java
// UserRepository.java - Database operations
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.isActive = true")
    List<User> findActiveUsers();
}
```

#### **4. Tạo Controller Layer (REST Endpoints)**
```java
// AuthController.java - HTTP endpoints
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Business logic here
        return ResponseEntity.ok(jwtResponse);
    }
}
```

#### **5. Cấu hình Security & JWT**
```java
// SecurityConfig.java - Authentication & Authorization
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        return http
            .authorizeRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .build();
    }
}
```

### 🔄 **QUY TRÌNH API HOẠT ĐỘNG (API Workflow)**

#### **A. Frontend API Call (src/services/api.js)**
```javascript
// 1. Frontend tạo API request
const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...options,
    };
    
    // 2. Gửi request đến backend
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return response.json();
};

// Example: Gọi API login
const authAPI = {
    login: (credentials) => apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })
};
```

#### **B. Vite Proxy Configuration (vite.config.js)**
```javascript
// 3. Vite proxy chuyển tiếp request
export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080',  // Backend URL
                changeOrigin: true,              // CORS handling
                secure: false,                   // Allow HTTP
                rewrite: (path) => path,         // Keep /api prefix
            }
        }
    }
});

// Flow: Frontend(/api/auth/login) → Proxy → Backend(localhost:8080/api/auth/login)
```

#### **C. Spring Boot Backend Processing**

**Bước 1: Request Filter Chain**
```java
// JwtAuthenticationFilter.java - Xử lý JWT token
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) {
        // 1. Extract JWT token từ Authorization header
        String jwt = getJwtFromRequest(request);
        
        // 2. Validate token
        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            // 3. Load user từ database
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            
            // 4. Set authentication context
            UsernamePasswordAuthenticationToken auth = 
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        
        // 5. Continue to controller
        filterChain.doFilter(request, response);
    }
}
```

**Bước 2: Controller Processing**
```java
// AuthController.java - Business logic
@PostMapping("/login")
public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    try {
        // 1. Validate input (Jakarta Validation)
        // @Valid annotation tự động validate email format, password length
        
        // 2. Check user exists
        boolean emailExists = userRepository.existsByEmail(loginRequest.getEmail());
        if (!emailExists) {
            return ResponseEntity.status(401).body("Email không tồn tại");
        }
        
        // 3. Authenticate với Spring Security
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), 
                loginRequest.getPassword())
        );
        
        // 4. Generate JWT token
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        // 5. Get user details
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        
        // 6. Return response
        return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getName(), 
                                               user.getEmail(), user.getRole()));
        
    } catch (BadCredentialsException e) {
        return ResponseEntity.status(401).body("Sai mật khẩu");
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
    }
}
```

**Bước 3: Repository & Database Query**
```java
// UserRepository.java - Database access
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA tự động tạo SQL query:
    // SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
    
    // Spring Data JPA tự động tạo SQL query:
    // SELECT COUNT(*) > 0 FROM users WHERE email = ?
    Boolean existsByEmail(String email);
}

// Spring Boot tự động execute:
// 1. Create connection pool to PostgreSQL
// 2. Execute SQL query
// 3. Map result to Java object
// 4. Return to controller
```

### 📊 **LUỒNG DỮ LIỆU API HOÀN CHỈNH (Complete API Data Flow)**

#### **Frontend → Backend Request Flow:**
```
1. User click "Login" button
   ↓
2. React component calls authAPI.login()
   ↓
3. api.js creates HTTP request with headers
   ↓
4. Vite proxy forwards: localhost:5173/api/auth/login → localhost:8080/api/auth/login
   ↓
5. Spring Boot receives request
   ↓
6. JwtAuthenticationFilter processes (if token exists)
   ↓
7. @RequestMapping routes to AuthController.authenticateUser()
   ↓
8. @Valid validates LoginRequest DTO
   ↓
9. Controller business logic:
   - Check email exists (UserRepository.existsByEmail())
   - Authenticate credentials (AuthenticationManager)
   - Generate JWT token (JwtUtils.generateJwtToken())
   ↓
10. JPA Repository executes SQL query to PostgreSQL
    ↓
11. Database returns result
    ↓
12. Controller returns JwtResponse
```

#### **Backend → Frontend Response Flow:**
```
1. Spring Boot serializes JwtResponse to JSON
   ↓
2. HTTP response sent back through Vite proxy
   ↓
3. Frontend api.js receives response
   ↓
4. AuthContext processes login success:
   - Store token in localStorage
   - Update user state
   - Trigger 'auth:login' event
   ↓
5. React components re-render:
   - Update navigation bar
   - Redirect to protected routes
   - Show user profile
```

### 🔐 **API SECURITY MECHANISMS**

#### **1. JWT Token Authentication**
```java
// Token generation process
public String generateJwtToken(Authentication authentication) {
    UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
    
    return Jwts.builder()
        .setSubject(userPrincipal.getUsername())    // Email as subject
        .setIssuedAt(new Date())                    // Current timestamp
        .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))  // 24h expiry
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // HMAC SHA256 signature
        .compact();
}

// Token validation process
public boolean validateJwtToken(String authToken) {
    try {
        Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(authToken);  // Verify signature & expiration
        return true;
    } catch (ExpiredJwtException | MalformedJwtException | UnsupportedJwtException e) {
        return false;
    }
}
```

#### **2. CORS Configuration**
```java
// Allow frontend origin
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

#### **3. Input Validation**
```java
// DTO validation annotations
public class LoginRequest {
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;
    
    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, max = 40, message = "Password phải từ 6-40 ký tự")
    private String password;
}

// Controller validation
@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
    // @Valid tự động validate và throw MethodArgumentNotValidException nếu invalid
}
```

### 🎯 **API ENDPOINTS MAPPING**

#### **Authentication APIs:**
```
POST /api/auth/login          → AuthController.authenticateUser()
POST /api/auth/register       → AuthController.registerUser()
POST /api/auth/google-login   → AuthController.googleLogin()
```

#### **Product APIs:**
```
GET    /api/products              → ProductController.getAllProducts()
GET    /api/products/{id}         → ProductController.getProductById()
POST   /api/products              → ProductController.createProduct()
PUT    /api/products/{id}         → ProductController.updateProduct()
DELETE /api/products/{id}         → ProductController.deleteProduct()
GET    /api/products/search       → ProductController.searchProducts()
GET    /api/products/flash-sale   → ProductController.getFlashSaleProducts()
```

#### **Cart APIs:**
```
GET    /api/cart                  → CartController.getCart()
POST   /api/cart/add              → CartController.addToCart()
PUT    /api/cart/update           → CartController.updateCartItem()
DELETE /api/cart/remove/{id}      → CartController.removeFromCart()
DELETE /api/cart/clear            → CartController.clearCart()
```

### 🔄 **ERROR HANDLING & RESPONSE FORMAT**

#### **Success Response Format:**
```json
// Login success
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
}

// Products list
{
    "content": [...],
    "totalElements": 100,
    "totalPages": 10,
    "size": 10,
    "number": 0
}
```

#### **Error Response Format:**
```json
// Validation error
{
    "timestamp": "2025-08-07T10:30:00",
    "status": 400,
    "error": "Bad Request",
    "message": "Email không đúng định dạng",
    "path": "/api/auth/login"
}

// Authentication error
{
    "timestamp": "2025-08-07T10:30:00",
    "status": 401,
    "error": "Unauthorized",
    "message": "Sai mật khẩu",
    "path": "/api/auth/login"
}
```

═══════════════════════════════════════════════════════════════════════════════

## 🛠️ CÔNG NGHỆ VÀ PATTERNS ÁP DỤNG

### Frontend Patterns:
- **Component-Based Architecture**: Tái sử dụng UI components
- **Context API**: Global state management
- **Custom Hooks**: Logic tái sử dụng
- **Error Boundaries**: Error handling
- **Code Splitting**: Lazy loading (có thể mở rộng)

### Backend Patterns:
- **MVC Pattern**: Model-View-Controller
- **Repository Pattern**: Data access abstraction  
- **DTO Pattern**: Data transfer objects
- **Dependency Injection**: Spring IoC container
- **RESTful API**: Standard HTTP methods

### Security Patterns:
- **JWT Authentication**: Stateless authentication
- **Role-Based Access Control**: Authorization
- **CORS Configuration**: Cross-origin security
- **Input Validation**: XSS và injection prevention

### Database Patterns:
- **ORM Mapping**: JPA/Hibernate
- **Entity Relationships**: Foreign keys, joins
- **Migration Scripts**: Database versioning
- **Connection Pooling**: Performance optimization

═══════════════════════════════════════════════════════════════════════════════

## 📈 KẾT LUẬN

Dự án LiteBuy là một hệ thống e-commerce hoàn chỉnh với:
- **Kiến trúc hiện đại**: React + Spring Boot + PostgreSQL
- **Tính bảo mật cao**: JWT, Spring Security, input validation
- **Trải nghiệm người dùng tốt**: Responsive design, error handling
- **Khả năng mở rộng**: Microservice-ready, component-based
- **Automation**: Batch scripts cho deployment
- **Best Practices**: Clean code, separation of concerns, testing support

Dự án thể hiện đầy đủ quy trình phát triển full-stack web application từ frontend đến backend, database và deployment automation.

═══════════════════════════════════════════════════════════════════════════════

## 🎓 KIẾN THỨC LIÊN QUAN ĐẾN DỰ ÁN

### 💻 **KIẾN THỨC FRONTEND (React/JavaScript)**

#### **1. JavaScript ES6+ Features**
```javascript
// Arrow Functions - Cú pháp ngắn gọn cho functions
const apiCall = async (endpoint, options = {}) => {
    const response = await fetch(endpoint, options);
    return response.json();
};

// Destructuring - Trích xuất dữ liệu từ objects/arrays  
const { name, email, role } = user;
const [products, setProducts] = useState([]);

// Template Literals - Xử lý string với variables
const message = `Hello ${name}, welcome to LiteBuy!`;

// Async/Await - Xử lý bất đồng bộ thay thế Promise chains
const fetchProducts = async () => {
    try {
        const data = await productsAPI.getAll();
        setProducts(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Modules - Import/Export để tổ chức code
export default ProductCard;
import { AuthProvider } from './context/AuthContext';
```

#### **2. React Core Concepts**
```jsx
// JSX - JavaScript XML syntax
function ProductCard({ product }) {
    return (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
        </div>
    );
}

// State Management với useState Hook
const [cart, setCart] = useState([]);
const [loading, setLoading] = useState(false);

// Side Effects với useEffect Hook
useEffect(() => {
    fetchProducts();
}, []); // Empty dependency array = chỉ chạy once khi mount

// Event Handling
const handleAddToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
};

// Conditional Rendering
{loading ? <Spinner /> : <ProductList products={products} />}

// Lists và Keys
{products.map(product => (
    <ProductCard key={product.id} product={product} />
))}
```

#### **3. React Router DOM**
```jsx
// Routing Setup
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

// Programmatic Navigation
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
const handleLogin = () => {
    // After successful login
    navigate('/dashboard');
};
```

#### **4. Context API cho State Management**
```jsx
// Create Context
const AuthContext = createContext(null);

// Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const login = async (credentials) => {
        const response = await authAPI.login(credentials);
        setUser(response.user);
        localStorage.setItem('token', response.token);
    };
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };
    
    const value = {
        user,
        login,
        logout,
        loading
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook để sử dụng Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Sử dụng trong Component
function Navbar() {
    const { user, logout } = useAuth();
    
    return (
        <nav>
            {user ? (
                <div>
                    <span>Hello, {user.name}</span>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
}
```

#### **5. Custom Hooks**
```jsx
// useProductData Hook
export const useProductData = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchProducts = async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await productsAPI.search(filters);
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchProducts();
    }, []);
    
    return {
        products,
        loading,
        error,
        refetch: fetchProducts
    };
};

// useLocalStorage Hook
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });
    
    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };
    
    return [storedValue, setValue];
};
```

### ☕ **KIẾN THỨC BACKEND (Spring Boot/Java)**

#### **1. Java 17 Features**
```java
// Records - Immutable data classes
public record ProductDTO(
    Long id, 
    String name, 
    BigDecimal price, 
    String category
) {}

// Text Blocks - Multi-line strings
String sqlQuery = """
    SELECT p.*, c.name as category_name 
    FROM products p 
    JOIN categories c ON p.category_id = c.id 
    WHERE p.active = true
    """;

// Pattern Matching for instanceof
public String formatPrice(Object price) {
    return switch (price) {
        case BigDecimal bd -> "$" + bd.toString();
        case Double d -> "$" + String.format("%.2f", d);
        case String s -> "$" + s;
        default -> "Invalid price";
    };
}

// Sealed Classes - Restricted inheritance
public sealed class OrderStatus 
    permits Pending, Confirmed, Shipped, Delivered, Cancelled {
}
```

#### **2. Spring Boot Annotations**
```java
// Main Application Class
@SpringBootApplication  // = @Configuration + @EnableAutoConfiguration + @ComponentScan
public class EcommerceBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(EcommerceBackendApplication.class, args);
    }
}

// Controller Layer
@RestController         // = @Controller + @ResponseBody
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
@Validated
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @Valid @RequestBody ProductFilterRequest filters
    ) {
        // Implementation
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")  // Method-level security
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductRequest request) {
        // Implementation
    }
}

// Service Layer
@Service
@Transactional  // Transaction management
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Cacheable("products")  // Caching
    public List<Product> getActiveProducts() {
        return productRepository.findByActiveTrue();
    }
}

// Repository Layer
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring Data JPA auto-generates implementation
}
```

#### **3. JPA/Hibernate Concepts**
```java
// Entity Mapping
@Entity
@Table(name = "products", indexes = {
    @Index(columnList = "category"),
    @Index(columnList = "active, created_at")
})
@EntityListeners(AuditingEntityListener.class)  // Auditing
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    @NotBlank(message = "Product name is required")
    private String name;
    
    @Column(precision = 10, scale = 2)
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();
    
    // Auditing fields
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

// Custom Repository Methods
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Query Methods - Spring Data JPA auto-generates queries
    List<Product> findByCategory(String category);
    Page<Product> findByActiveTrue(Pageable pageable);
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    // Custom JPQL Queries
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:name% AND p.active = true")
    List<Product> searchByName(@Param("name") String name);
    
    @Query(value = "SELECT * FROM products WHERE price < :maxPrice ORDER BY created_at DESC LIMIT :limit", 
           nativeQuery = true)
    List<Product> findCheapProducts(@Param("maxPrice") BigDecimal maxPrice, @Param("limit") int limit);
    
    // Modifying Queries
    @Modifying
    @Query("UPDATE Product p SET p.active = false WHERE p.stock = 0")
    int deactivateOutOfStockProducts();
}
```

#### **4. Spring Security Configuration**
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)  // Enable method-level security
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);  // Strength 12
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
                .accessDeniedHandler(new JwtAccessDeniedHandler())
            )
            .build();
    }
}

// JWT Token Processing
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String token = extractTokenFromRequest(request);
        
        if (token != null && jwtUtils.validateToken(token)) {
            String email = jwtUtils.getEmailFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            
            UsernamePasswordAuthenticationToken auth = 
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### 🗄️ **KIẾN THỨC DATABASE (PostgreSQL)**

#### **1. SQL Advanced Queries**
```sql
-- Complex Joins với Multiple Tables
SELECT 
    p.name as product_name,
    p.price,
    c.name as category_name,
    COUNT(oi.id) as total_orders,
    SUM(oi.quantity * oi.price) as total_revenue
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'COMPLETED'
GROUP BY p.id, p.name, p.price, c.name
HAVING COUNT(oi.id) > 0
ORDER BY total_revenue DESC;

-- Window Functions - Analytics
SELECT 
    product_name,
    category,
    revenue,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) as rank_in_category,
    PERCENT_RANK() OVER (ORDER BY revenue) as revenue_percentile,
    LAG(revenue) OVER (ORDER BY revenue) as previous_revenue
FROM product_revenue_view;

-- Common Table Expressions (CTEs)
WITH monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', o.created_at) as month,
        SUM(o.total_amount) as total_sales,
        COUNT(*) as order_count
    FROM orders o
    WHERE o.status = 'COMPLETED'
    GROUP BY DATE_TRUNC('month', o.created_at)
),
sales_growth AS (
    SELECT 
        month,
        total_sales,
        LAG(total_sales) OVER (ORDER BY month) as previous_month_sales,
        (total_sales - LAG(total_sales) OVER (ORDER BY month)) / 
        LAG(total_sales) OVER (ORDER BY month) * 100 as growth_rate
    FROM monthly_sales
)
SELECT * FROM sales_growth WHERE growth_rate IS NOT NULL;

-- Recursive CTEs - Hierarchical Data
WITH RECURSIVE category_hierarchy AS (
    -- Base case: root categories
    SELECT id, name, parent_id, 0 as level, name as path
    FROM categories 
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case
    SELECT c.id, c.name, c.parent_id, ch.level + 1, 
           ch.path || ' > ' || c.name
    FROM categories c
    JOIN category_hierarchy ch ON c.parent_id = ch.id
)
SELECT * FROM category_hierarchy ORDER BY path;
```

#### **2. Database Performance Optimization**
```sql
-- Indexes cho Performance
CREATE INDEX CONCURRENTLY idx_products_category_active 
ON products(category, active) 
WHERE active = true;

CREATE INDEX idx_orders_user_status 
ON orders(user_id, status, created_at);

-- Partial Index
CREATE INDEX idx_products_flash_sale 
ON products(flash_sale_end) 
WHERE is_flash_sale = true AND flash_sale_end > NOW();

-- Full-text Search
CREATE INDEX idx_products_search 
ON products USING gin(to_tsvector('english', name || ' ' || description));

-- Query với Full-text Search
SELECT *, ts_rank(to_tsvector('english', name || ' ' || description), query) as rank
FROM products, plainto_tsquery('english', 'laptop gaming') query
WHERE to_tsvector('english', name || ' ' || description) @@ query
ORDER BY rank DESC;

-- EXPLAIN ANALYZE để tối ưu queries
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
SELECT p.*, c.name as category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.active = true 
AND p.price BETWEEN 100 AND 1000
ORDER BY p.created_at DESC
LIMIT 20;
```

#### **3. Database Constraints và Data Integrity**
```sql
-- Check Constraints
ALTER TABLE products 
ADD CONSTRAINT chk_price_positive 
CHECK (price > 0);

ALTER TABLE products 
ADD CONSTRAINT chk_stock_non_negative 
CHECK (stock >= 0);

-- Foreign Key Constraints với Cascading
ALTER TABLE order_items 
ADD CONSTRAINT fk_order_items_order_id 
FOREIGN KEY (order_id) REFERENCES orders(id) 
ON DELETE CASCADE;

-- Unique Constraints
ALTER TABLE users 
ADD CONSTRAINT uk_users_email 
UNIQUE (email);

-- Triggers cho Auditing
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 🔧 **KIẾN THỨC DEVOPS & TOOLS**

#### **1. Maven Build Tool**
```xml
<!-- pom.xml - Project Object Model -->
<project>
    <modelVersion>4.0.0</modelVersion>
    
    <!-- Project coordinates -->
    <groupId>com.litebuy</groupId>
    <artifactId>ecommerce-backend</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <!-- Parent dependency for Spring Boot -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <!-- Properties -->
    <properties>
        <java.version>17</java.version>
        <junit.version>5.9.0</junit.version>
    </properties>
    
    <!-- Dependencies -->
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <!-- Build configuration -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

#### **2. Vite Build Tool Configuration**
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    
    // Development server configuration
    server: {
        port: 5173,
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    
    // Build configuration
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                }
            }
        }
    },
    
    // Environment variables
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    
    // Path aliases
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@pages': path.resolve(__dirname, './src/pages'),
        }
    }
});
```

#### **3. Batch Scripts Automation**
```batch
:: start-project.bat - Windows Batch Script
@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo [INFO] Starting LiteBuy E-commerce Platform...

:: Check system requirements
echo [1/5] Checking Java...
java -version >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Java not found. Please install Java 17+
    pause
    exit /b 1
)

echo [2/5] Checking Maven...
mvn -version >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Maven not found. Please install Maven 3.6+
    pause
    exit /b 1
)

echo [3/5] Checking Node.js...
node --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
)

echo [4/5] Starting Backend...
cd backend-java
start "Backend Server" cmd /k "mvn spring-boot:run"
cd ..

:: Wait for backend to start
timeout /t 10 /nobreak >nul

echo [5/5] Starting Frontend...
start "Frontend Server" cmd /k "npm run dev"

echo [SUCCESS] Both servers are starting...
echo [INFO] Frontend: http://localhost:5173
echo [INFO] Backend: http://localhost:8080
pause
```

### 🔐 **KIẾN THỨC SECURITY**

#### **1. JWT (JSON Web Tokens)**
```javascript
// Frontend - JWT handling
class TokenManager {
    static setToken(token) {
        localStorage.setItem('authToken', token);
    }
    
    static getToken() {
        return localStorage.getItem('authToken');
    }
    
    static removeToken() {
        localStorage.removeItem('authToken');
    }
    
    static isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    }
    
    static getTokenPayload(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            return null;
        }
    }
}

// API interceptor với token refresh
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
});

apiClient.interceptors.request.use((config) => {
    const token = TokenManager.getToken();
    if (token && !TokenManager.isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            TokenManager.removeToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

#### **2. Password Hashing & Validation**
```java
// Backend - Password security
@Service
public class PasswordService {
    
    private final PasswordEncoder passwordEncoder;
    
    public PasswordService() {
        this.passwordEncoder = new BCryptPasswordEncoder(12); // High strength
    }
    
    public String hashPassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }
    
    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }
    
    // Password strength validation
    public boolean isValidPassword(String password) {
        return password != null &&
               password.length() >= 8 &&
               password.matches(".*[A-Z].*") &&     // Uppercase
               password.matches(".*[a-z].*") &&     // Lowercase  
               password.matches(".*\\d.*") &&       // Digit
               password.matches(".*[!@#$%^&*()].*"); // Special char
    }
}

// Custom validation annotation
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = StrongPasswordValidator.class)
public @interface StrongPassword {
    String message() default "Password must be at least 8 characters with uppercase, lowercase, number and special character";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {
    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        return password != null &&
               password.length() >= 8 &&
               password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
    }
}
```

### 🧪 **KIẾN THỨC TESTING**

#### **1. Frontend Testing (Jest + React Testing Library)**
```javascript
// ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../components/ProductCard';

describe('ProductCard Component', () => {
    const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 99.99,
        imageUrl: 'test-image.jpg',
        description: 'Test description'
    };
    
    const mockOnAddToCart = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('renders product information correctly', () => {
        render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
        
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
        expect(screen.getByAltText('Test Product')).toHaveAttribute('src', 'test-image.jpg');
    });
    
    test('calls onAddToCart when add to cart button is clicked', async () => {
        const user = userEvent.setup();
        render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
        
        const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
        await user.click(addToCartButton);
        
        expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
        expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    });
});

// API mocking
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
    rest.get('/api/products', (req, res, ctx) => {
        return res(ctx.json([mockProduct]));
    }),
    
    rest.post('/api/auth/login', (req, res, ctx) => {
        return res(ctx.json({
            token: 'mock-jwt-token',
            user: { id: 1, name: 'Test User', email: 'test@example.com' }
        }));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### **2. Backend Testing (JUnit + Spring Boot Test)**
```java
// ProductControllerTest.java
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class ProductControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ProductService productService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    @WithMockUser(roles = "ADMIN")
    void createProduct_ValidInput_ReturnsCreatedProduct() throws Exception {
        // Given
        ProductRequest request = new ProductRequest("Test Product", new BigDecimal("99.99"));
        Product savedProduct = new Product(1L, "Test Product", new BigDecimal("99.99"));
        
        when(productService.createProduct(any(ProductRequest.class))).thenReturn(savedProduct);
        
        // When & Then
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Product"))
                .andExpect(jsonPath("$.price").value(99.99));
        
        verify(productService).createProduct(any(ProductRequest.class));
    }
    
    @Test
    void createProduct_InvalidInput_ReturnsBadRequest() throws Exception {
        ProductRequest invalidRequest = new ProductRequest("", new BigDecimal("-10"));
        
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").exists());
    }
}

// Repository Testing
@DataJpaTest
class ProductRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Test
    void findByActiveTrue_ReturnsOnlyActiveProducts() {
        // Given
        Product activeProduct = new Product("Active Product", new BigDecimal("50.00"));
        activeProduct.setActive(true);
        
        Product inactiveProduct = new Product("Inactive Product", new BigDecimal("30.00"));
        inactiveProduct.setActive(false);
        
        entityManager.persistAndFlush(activeProduct);
        entityManager.persistAndFlush(inactiveProduct);
        
        // When
        List<Product> activeProducts = productRepository.findByActiveTrue();
        
        // Then
        assertThat(activeProducts).hasSize(1);
        assertThat(activeProducts.get(0).getName()).isEqualTo("Active Product");
    }
}
```

### 🎯 **KẾT LUẬN KIẾN THỨC**

Dự án LiteBuy bao phủ đầy đủ các kiến thức cần thiết cho một **Full-stack Developer**:

#### **Frontend Skills:**
- ✅ **JavaScript ES6+**: Modern syntax, async/await, modules
- ✅ **React Ecosystem**: Hooks, Context API, Router, Testing
- ✅ **Build Tools**: Vite configuration, bundling, optimization
- ✅ **State Management**: Context API, custom hooks
- ✅ **API Integration**: Fetch, axios, error handling

#### **Backend Skills:**
- ✅ **Java 17**: Modern Java features, records, pattern matching
- ✅ **Spring Boot**: Auto-configuration, dependency injection, MVC
- ✅ **Spring Security**: JWT, authentication, authorization
- ✅ **JPA/Hibernate**: ORM mapping, relationships, queries
- ✅ **RESTful APIs**: CRUD operations, status codes, best practices

#### **Database Skills:**
- ✅ **PostgreSQL**: Advanced SQL, indexes, performance tuning
- ✅ **Database Design**: Normalization, constraints, relationships
- ✅ **Query Optimization**: EXPLAIN plans, indexing strategies

#### **DevOps & Tools:**
- ✅ **Build Tools**: Maven, Vite, automation scripts
- ✅ **Version Control**: Git workflows, branching strategies
- ✅ **Environment Management**: Development, staging, production configs

#### **Security & Testing:**
- ✅ **Security**: JWT, password hashing, CORS, input validation
- ✅ **Testing**: Unit tests, integration tests, mocking
- ✅ **Code Quality**: Clean code, SOLID principles, design patterns

**Dự án này là một excellent portfolio piece** thể hiện khả năng xây dựng ứng dụng production-ready với đầy đủ tính năng của một hệ thống thương mại điện tử hiện đại!