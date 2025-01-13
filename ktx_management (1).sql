-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 10, 2025 at 01:20 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ktx_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `buildings`
--

CREATE TABLE `buildings` (
  `id` int NOT NULL,
  `name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `buildings`
--

INSERT INTO `buildings` (`id`, `name`) VALUES
(1, 'A'),
(2, 'B'),
(3, 'C'),
(4, 'D');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `registration_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_month` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_type` enum('room','utility') COLLATE utf8mb4_unicode_ci DEFAULT 'room',
  `payment_year` int DEFAULT NULL,
  `electricity_fee` decimal(10,2) DEFAULT '0.00',
  `water_fee` decimal(10,2) DEFAULT '0.00',
  `internet_fee` decimal(10,2) DEFAULT '0.00',
  `is_overdue` tinyint(1) DEFAULT '0',
  `late_fee` decimal(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `registration_id`, `amount`, `payment_month`, `payment_date`, `status`, `payment_type`, `payment_year`, `electricity_fee`, `water_fee`, `internet_fee`, `is_overdue`, `late_fee`) VALUES
(33, 23, '370.00', '1/2025', '2025-02-04 16:56:29', 'completed', 'room', NULL, '0.00', '0.00', '0.00', 0, '0.00'),
(34, 23, '370.00', '2/2025', '2025-02-04 16:56:39', 'completed', 'room', NULL, '0.00', '0.00', '0.00', 0, '0.00'),
(35, 24, '4000.00', '1/2025', '2025-01-04 17:41:09', 'completed', 'room', NULL, '0.00', '0.00', '0.00', 0, '0.00'),
(36, 24, '4000.00', '2/2025', '2025-02-04 17:59:25', 'completed', 'room', NULL, '0.00', '0.00', '0.00', 0, '0.00'),
(45, 31, '701166.67', NULL, '2025-02-07 20:22:06', 'completed', 'utility', NULL, '0.00', '0.00', '0.00', 0, '0.00'),
(80, 67, '5051666.67', '1/2025', '2025-02-10 20:10:42', 'completed', 'utility', NULL, '0.00', '0.00', '0.00', 0, '0.00'),
(81, 67, '701166.67', '2/2025', '2025-02-10 20:10:50', 'completed', 'utility', NULL, '0.00', '0.00', '0.00', 0, '0.00');

-- --------------------------------------------------------

--
-- Table structure for table `registrations`
--

CREATE TABLE `registrations` (
  `id` int NOT NULL,
  `room_id` int NOT NULL,
  `student_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_faculty` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registration_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `payment_status` enum('paid','unpaid') COLLATE utf8mb4_unicode_ci DEFAULT 'unpaid',
  `last_payment_date` datetime DEFAULT NULL,
  `warning_count` int DEFAULT '0',
  `last_warning_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `registrations`
--

INSERT INTO `registrations` (`id`, `room_id`, `student_name`, `student_id`, `student_phone`, `student_email`, `student_faculty`, `registration_date`, `payment_status`, `last_payment_date`, `warning_count`, `last_warning_date`) VALUES
(10, 2, '1e3wq ưeq', '4', '0346869258', '4@4.4', 'CNNT', '2025-01-03 15:07:31', 'unpaid', NULL, 0, NULL),
(23, 2, 'Trần Đức Anh', '6', '0345957258', '6@6.6', 'CNNt', '2025-01-04 16:54:46', 'unpaid', NULL, 0, NULL),
(24, 1, 'TTT', '7', '0346869258', '7@7.7', 'CONG TRÌNH', '2025-01-04 17:38:25', 'unpaid', NULL, 0, NULL),
(31, 1, 'Nguyễn Văn Hòa', '2', '0345957258', '2@2.2', 'CNTT', '2025-01-07 20:21:52', 'unpaid', NULL, 0, NULL),
(43, 2, 'Nguyễn Văn B', '5', '0346869258', '5@5.5', 'KTMT', '2025-01-09 13:28:27', 'unpaid', NULL, 0, NULL),
(67, 1, 'Nguyễn Văn Hòa', '3', '0345957258', '3@3.3', '3', '2025-01-10 20:10:29', 'unpaid', NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int NOT NULL,
  `number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_id` int NOT NULL,
  `max_occupants` int NOT NULL,
  `current_occupants` int DEFAULT '0',
  `price` decimal(10,2) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `number`, `building_id`, `max_occupants`, `current_occupants`, `price`, `status`) VALUES
(1, '101', 1, 6, 3, '12000.00', 'available'),
(2, '102', 1, 4, 3, '1111.00', 'available'),
(3, '101', 2, 4, 0, '1200000.00', 'available'),
(4, '102', 4, 4, 0, '12222.00', 'repairs');

-- --------------------------------------------------------

--
-- Table structure for table `utility_prices`
--

CREATE TABLE `utility_prices` (
  `id` int NOT NULL,
  `electricity_price` decimal(10,2) NOT NULL,
  `water_price` decimal(10,2) NOT NULL,
  `internet_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `utility_prices`
--

INSERT INTO `utility_prices` (`id`, `electricity_price`, `water_price`, `internet_price`, `created_at`) VALUES
(1, '2167.00', '3500.00', '30000.00', '2025-01-03 09:24:30'),
(2, '2167.00', '3500.00', '30000.00', '2025-01-04 09:30:15');

-- --------------------------------------------------------

--
-- Table structure for table `utility_usage`
--

CREATE TABLE `utility_usage` (
  `id` int NOT NULL,
  `room_id` int NOT NULL,
  `electricity_usage` decimal(10,2) NOT NULL DEFAULT '0.00',
  `water_usage` decimal(10,2) NOT NULL DEFAULT '0.00',
  `month` int NOT NULL,
  `year` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `utility_usage`
--

INSERT INTO `utility_usage` (`id`, `room_id`, `electricity_usage`, `water_usage`, `month`, `year`, `created_at`) VALUES
(1, 1, '30.00', '1000.00', 1, 2025, '2025-01-03 09:22:42'),
(2, 2, '20.00', '100.00', 1, 2025, '2025-01-03 10:05:44'),
(3, 2, '121.00', '3131.00', 2, 2025, '2025-01-04 09:46:47'),
(4, 1, '111.00', '111.00', 2, 2025, '2025-02-04 10:59:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buildings`
--
ALTER TABLE `buildings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `registration_id` (`registration_id`);

--
-- Indexes for table `registrations`
--
ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `building_id` (`building_id`);

--
-- Indexes for table `utility_prices`
--
ALTER TABLE `utility_prices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `utility_usage`
--
ALTER TABLE `utility_usage`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `room_month_year` (`room_id`,`month`,`year`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `buildings`
--
ALTER TABLE `buildings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `registrations`
--
ALTER TABLE `registrations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `utility_prices`
--
ALTER TABLE `utility_prices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `utility_usage`
--
ALTER TABLE `utility_usage`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`);

--
-- Constraints for table `registrations`
--
ALTER TABLE `registrations`
  ADD CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`);

--
-- Constraints for table `utility_usage`
--
ALTER TABLE `utility_usage`
  ADD CONSTRAINT `utility_usage_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
