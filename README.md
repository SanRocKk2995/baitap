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

**📄 src/styles/admin.css** - Admin dashboard styling
**📄 src/styles/auth.css** - Authentication pages styling  
**📄 src/styles/carousel.css** - Carousel component styling
**📄 src/styles/cart.css** - Shopping cart styling
**📄 src/styles/checkout.css** - Checkout process styling
**📄 src/styles/flashSale.css** - Flash sale components styling
**📄 src/styles/footer.css** - Footer component styling
**📄 src/styles/home.css** - Homepage styling
**📄 src/styles/navbar.css** - Navigation bar styling
**📄 src/styles/orderStatus.css** - Order tracking styling
**📄 src/styles/popupPromotion.css** - Popup modal styling
**📄 src/styles/productDetail.css** - Product detail page styling
**📄 src/styles/productManagement.css** - Product management styling
**📄 src/styles/productReviews.css** - Reviews component styling
**📄 src/styles/products.css** - Products listing styling
**📄 src/styles/profile.css** - User profile styling
**📄 src/styles/seller.css** - Seller dashboard styling
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
