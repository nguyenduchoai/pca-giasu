-- =====================================================================
-- OYLG ("All Your Life") Custom Schema on EzyPlatform
-- Tuân thủ chuẩn SSOT: Tái sử dụng ezy_users, ezy_user_meta, ezy_admins,
-- ezy_medias, ecommerce_orders, ecommerce_shop_branches, ezyarticle_posts
-- =====================================================================

CREATE TABLE IF NOT EXISTS `oylg_student_profiles` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `user_id` bigint unsigned NOT NULL DEFAULT 0 COMMENT 'FK -> ezy_users.id (STUDENT)',
    `parent_user_id` bigint unsigned NOT NULL DEFAULT 0 COMMENT 'FK -> ezy_users.id (PARENT)',
    `student_code` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `current_grade` int NOT NULL DEFAULT 1,
    `school_name` varchar(250) COLLATE utf8mb4_unicode_520_ci,
    `target_school` varchar(250) COLLATE utf8mb4_unicode_520_ci,
    `target_major` varchar(250) COLLATE utf8mb4_unicode_520_ci,
    `riasec_code` varchar(16) COLLATE utf8mb4_unicode_520_ci,
    `overall_health_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'NORMAL',
    `allergies_json` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `medical_notes` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_student_code` (`student_code`),
    UNIQUE KEY `key_user_id` (`user_id`),
    INDEX `index_parent_user_id_id` (`parent_user_id`, `id`),
    INDEX `index_current_grade_id` (`current_grade`, `id`),
    INDEX `index_overall_health_status_id` (`overall_health_status`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_expert_profiles` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `user_id` bigint unsigned NOT NULL DEFAULT 0 COMMENT 'FK -> ezy_users.id (CAREER_EXPERT / LIFE_COACH / SUBJECT_EXPERT / SUBJECT_LEAD)',
    `expert_code` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `expert_role` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'SUBJECT_EXPERT',
    `tier` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'STANDARD',
    `subjects_json` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `landing_page_slug` varchar(160) COLLATE utf8mb4_unicode_520_ci COMMENT 'Liên kết ezyarticle PAGE chuẩn Consulting Theme',
    `base_payout_per_session` decimal(18,2) NOT NULL DEFAULT 250000.00,
    `review_rate_per_item` decimal(18,2) NOT NULL DEFAULT 15000.00,
    `verified_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'VERIFIED',
    `rating_avg` decimal(5,2) NOT NULL DEFAULT 5.00,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_expert_code` (`expert_code`),
    UNIQUE KEY `key_user_id` (`user_id`),
    INDEX `index_expert_role_tier` (`expert_role`, `tier`),
    INDEX `index_verified_status_id` (`verified_status`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_curriculum_units` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `unit_code` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT 'Mã YCCĐ GDPT 2018 Kết nối tri thức',
    `subject_code` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT 'MATH, PHYS, CHEM, ENG, LIT',
    `grade` int NOT NULL,
    `semester` int NOT NULL DEFAULT 1,
    `topic_name` varchar(300) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `yccd_description` mediumtext COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `cognitive_levels_json` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `approval_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'APPROVED',
    `approved_by_admin_id` bigint unsigned NOT NULL DEFAULT 0 COMMENT 'FK -> ezy_admins.id (CONTENT_APPROVER)',
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_unit_code` (`unit_code`),
    INDEX `index_subject_grade` (`subject_code`, `grade`),
    INDEX `index_approval_status` (`approval_status`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_curriculum_prerequisites` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `unit_id` bigint unsigned NOT NULL,
    `prerequisite_unit_id` bigint unsigned NOT NULL,
    `dependency_weight` decimal(5,2) NOT NULL DEFAULT 1.00,
    `created_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_unit_prereq` (`unit_id`, `prerequisite_unit_id`),
    INDEX `index_unit_id` (`unit_id`),
    INDEX `index_prerequisite_unit_id` (`prerequisite_unit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_mastery_states` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `student_user_id` bigint unsigned NOT NULL,
    `unit_id` bigint unsigned NOT NULL,
    `mastery_score` int NOT NULL DEFAULT 0 COMMENT '0 - 100',
    `mastery_level` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'NOT_STARTED',
    `is_root_cause_gap` tinyint(1) NOT NULL DEFAULT 0,
    `last_tested_at` datetime,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_student_unit` (`student_user_id`, `unit_id`),
    INDEX `index_student_root_gap` (`student_user_id`, `is_root_cause_gap`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_learning_cases` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `case_code` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `student_user_id` bigint unsigned NOT NULL,
    `parent_user_id` bigint unsigned NOT NULL,
    `career_expert_user_id` bigint unsigned NOT NULL DEFAULT 0,
    `life_coach_user_id` bigint unsigned NOT NULL DEFAULT 0,
    `care_agent_admin_id` bigint unsigned NOT NULL DEFAULT 0,
    `current_tier` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'TIER_1_CAREER',
    `case_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'ACTIVE',
    `r1_report_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'PENDING_AI_DRAFT',
    `r2_report_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'LOCKED',
    `r3_report_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'LOCKED',
    `remedial_ratio_percent` int NOT NULL DEFAULT 60,
    `current_grade_ratio_percent` int NOT NULL DEFAULT 40,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_case_code` (`case_code`),
    INDEX `index_student_user_id` (`student_user_id`, `id`),
    INDEX `index_parent_user_id` (`parent_user_id`, `id`),
    INDEX `index_current_tier_status` (`current_tier`, `case_status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_lesson_records` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `case_id` bigint unsigned NOT NULL,
    `student_user_id` bigint unsigned NOT NULL,
    `expert_user_id` bigint unsigned NOT NULL,
    `subject_code` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `delivery_mode` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'ONLINE_ZOOM' COMMENT 'ONLINE_ZOOM, AT_CENTER, AT_HOME',
    `class_type` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'ONE_ON_ONE' COMMENT 'ONE_ON_ONE, SMALL_GROUP, LARGE_GROUP',
    `branch_id` bigint unsigned NOT NULL DEFAULT 0 COMMENT 'FK -> ecommerce_shop_branches.id',
    `session_price` decimal(18,2) NOT NULL DEFAULT 0.00,
    `expert_payout_amount` decimal(18,2) NOT NULL DEFAULT 0.00,
    `covered_unit_ids_json` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `structured_notes` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `sanitized_parent_summary` mediumtext COLLATE utf8mb4_unicode_520_ci COMMENT 'Đã lọc SĐT/Zalo theo Guardrail #1',
    `dlp_masked_count` int NOT NULL DEFAULT 0,
    `submitted_within_24h` tinyint(1) NOT NULL DEFAULT 1,
    `payout_eligible` tinyint(1) NOT NULL DEFAULT 1,
    `scheduled_at` datetime NOT NULL,
    `completed_at` datetime,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `index_case_id_scheduled_at` (`case_id`, `scheduled_at`),
    INDEX `index_expert_user_id_completed_at` (`expert_user_id`, `completed_at`),
    INDEX `index_student_user_id_id` (`student_user_id`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_safety_flags` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `student_user_id` bigint unsigned NOT NULL,
    `case_id` bigint unsigned NOT NULL DEFAULT 0,
    `source_module` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT 'B3_SCREENING, AI_CHAT, LESSON_NOTE, BOARDING',
    `severity` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'AMBER' COMMENT 'GREEN, AMBER, RED_URGENT',
    `trigger_excerpt` mediumtext COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `ai_risk_analysis` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `emergency_hotline_shown` varchar(64) COLLATE utf8mb4_unicode_520_ci DEFAULT '111 / 115',
    `status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'PENDING_EXPERT_VERIFY',
    `verified_by_user_id` bigint unsigned NOT NULL DEFAULT 0,
    `parent_notified_at` datetime,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `index_severity_status` (`severity`, `status`),
    INDEX `index_student_user_id_id` (`student_user_id`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_order_attributions` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `order_id` bigint unsigned NOT NULL COMMENT 'FK -> ecommerce_orders.id',
    `customer_user_id` bigint unsigned NOT NULL,
    `sales_rep_user_id` bigint unsigned NOT NULL DEFAULT 0 COMMENT 'CTV Tầng 1 (10%) hoặc Leader tự bán (15%)',
    `sales_leader_user_id` bigint unsigned NOT NULL DEFAULT 0 COMMENT 'Leader Tầng 2 (5%)',
    `attribution_channel` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'REFERRAL_LINK',
    `referral_code` varchar(64) COLLATE utf8mb4_unicode_520_ci,
    `is_self_purchase` tinyint(1) NOT NULL DEFAULT 0,
    `is_renewal_or_care_upsell` tinyint(1) NOT NULL DEFAULT 0,
    `first_payment_amount` decimal(18,2) NOT NULL DEFAULT 0.00,
    `six_month_contract_value` decimal(18,2) NOT NULL DEFAULT 0.00,
    `dthh_commission_base` decimal(18,2) NOT NULL DEFAULT 0.00 COMMENT 'max(first_payment, 6_month_value)',
    `collected_amount_to_date` decimal(18,2) NOT NULL DEFAULT 0.00,
    `lock_expires_at` datetime NOT NULL,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_order_id` (`order_id`),
    INDEX `index_sales_rep_user_id` (`sales_rep_user_id`, `id`),
    INDEX `index_sales_leader_user_id` (`sales_leader_user_id`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_commissions` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `attribution_id` bigint unsigned NOT NULL,
    `order_id` bigint unsigned NOT NULL,
    `beneficiary_user_id` bigint unsigned NOT NULL,
    `tier_type` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT 'TIER_1_REP_10, TIER_2_LEADER_5, LEADER_DIRECT_15',
    `commission_rate_percent` decimal(5,2) NOT NULL,
    `total_entitled_amount` decimal(18,2) NOT NULL,
    `unlocked_payable_amount` decimal(18,2) NOT NULL DEFAULT 0.00 COMMENT 'PAY_AS_COLLECTED theo tỷ lệ thực thu',
    `paid_amount` decimal(18,2) NOT NULL DEFAULT 0.00,
    `hold_until_at` datetime NOT NULL COMMENT 'Giữ 14 ngày chờ qua kỳ hoàn tiền 100%',
    `status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'HOLD_14_DAYS',
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `index_beneficiary_status` (`beneficiary_user_id`, `status`),
    INDEX `index_order_id` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_residencies` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `student_user_id` bigint unsigned NOT NULL,
    `branch_id` bigint unsigned NOT NULL COMMENT 'FK -> ecommerce_shop_branches.id',
    `residency_type` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'DAY_BOARDING' COMMENT 'FULL_BOARDING, DAY_BOARDING',
    `room_code` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `bed_code` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `warden_admin_id` bigint unsigned NOT NULL DEFAULT 0,
    `meal_opt_out_json` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `avg_sleep_hours` decimal(4,1) NOT NULL DEFAULT 8.0,
    `status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'ACTIVE',
    `start_date` date NOT NULL,
    `end_date` date,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `index_branch_status` (`branch_id`, `status`),
    INDEX `index_student_user_id` (`student_user_id`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_authorized_pickups` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `student_user_id` bigint unsigned NOT NULL,
    `guardian_full_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `relationship` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `phone_number` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `national_id_masked` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `photo_media_id` bigint unsigned NOT NULL DEFAULT 0 COMMENT 'FK -> ezy_medias.id',
    `qr_pass_token` varchar(128) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `is_active` tinyint(1) NOT NULL DEFAULT 1,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_qr_pass_token` (`qr_pass_token`),
    INDEX `index_student_active` (`student_user_id`, `is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_boarding_checkins` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `residency_id` bigint unsigned NOT NULL,
    `student_user_id` bigint unsigned NOT NULL,
    `checkpoint_type` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT 'ARRIVE, LEAVE, NIGHT_ROLLCALL, MORNING_WAKEUP',
    `authorized_pickup_id` bigint unsigned NOT NULL DEFAULT 0,
    `verified_by_admin_id` bigint unsigned NOT NULL DEFAULT 0,
    `verification_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'VERIFIED_SAFE',
    `sleep_hours_logged` decimal(4,1) NOT NULL DEFAULT 0.0,
    `notes` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `checked_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `index_student_checked_at` (`student_user_id`, `checked_at`),
    INDEX `index_residency_checkpoint` (`residency_id`, `checkpoint_type`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_service_packages` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `ecommerce_product_id` bigint unsigned NOT NULL DEFAULT 0 COMMENT 'FK -> ecommerce_products.id',
    `package_code` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `package_tier` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'TIER_1_CAREER' COMMENT 'TIER_1_CAREER, TIER_2_SCREENING, TIER_3_COMPANION, BOARDING',
    `title` varchar(250) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `session_credits_granted` int NOT NULL DEFAULT 0,
    `billing_term_months` int NOT NULL DEFAULT 1,
    `discount_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
    `list_price_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `net_price_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'ACTIVE',
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_package_code` (`package_code`),
    INDEX `index_ecommerce_product_id` (`ecommerce_product_id`),
    INDEX `index_package_tier_status` (`package_tier`, `status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_ecommerce_order_wallets` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `ecommerce_order_id` bigint unsigned NOT NULL COMMENT 'FK -> ecommerce_orders.id',
    `order_code` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `parent_user_id` bigint unsigned NOT NULL DEFAULT 0,
    `student_user_id` bigint unsigned NOT NULL DEFAULT 0,
    `voucher_code` varchar(64) COLLATE utf8mb4_unicode_520_ci,
    `referral_code` varchar(64) COLLATE utf8mb4_unicode_520_ci,
    `subtotal_amount_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `discount_amount_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `net_paid_amount_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `total_sessions_granted` int NOT NULL DEFAULT 0,
    `consumed_sessions_count` int NOT NULL DEFAULT 0,
    `payment_channel` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'VIETQR_PAYOS',
    `payment_status` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'PAID',
    `refund_guaranteed_until` datetime NOT NULL,
    `refunded_amount_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_order_code` (`order_code`),
    INDEX `index_parent_student` (`parent_user_id`, `student_user_id`),
    INDEX `index_payment_status` (`payment_status`, `created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
