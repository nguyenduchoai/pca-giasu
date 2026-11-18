-- =====================================================================
-- OYLG ("All Your Life") Native Schema on EzyPlatform
-- SSOT: Reuses ezy_users, ezy_user_meta, ezy_admins, ezy_settings, ezy_medias,
-- ecommerce_products, ecommerce_orders, ecommerce_shop_branches, ezyarticle_posts
-- =====================================================================

CREATE TABLE IF NOT EXISTS `oylg_student_profiles` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `user_id` bigint unsigned NOT NULL DEFAULT 0,
    `parent_user_id` bigint unsigned NOT NULL DEFAULT 0,
    `student_code` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `full_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `parent_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `parent_phone` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `current_grade` int NOT NULL DEFAULT 9,
    `school_name` varchar(250) COLLATE utf8mb4_unicode_520_ci,
    `target_school` varchar(250) COLLATE utf8mb4_unicode_520_ci,
    `target_major` varchar(250) COLLATE utf8mb4_unicode_520_ci,
    `riasec_code` varchar(32) COLLATE utf8mb4_unicode_520_ci,
    `session_credits_remaining` int NOT NULL DEFAULT 0,
    `streak_days` int NOT NULL DEFAULT 0,
    `xp_points` int NOT NULL DEFAULT 0,
    `mood_status` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'STEADY',
    `overall_health_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'NORMAL',
    `allergies_json` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `daily_tasks_json` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_student_code` (`student_code`),
    INDEX `index_parent_user_id_id` (`parent_user_id`, `id`),
    INDEX `index_current_grade_id` (`current_grade`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_expert_profiles` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `user_id` bigint unsigned NOT NULL DEFAULT 0,
    `expert_code` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `display_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `role_title` varchar(200) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `expert_role` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'SUBJECT_EXPERT',
    `tier` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'SENIOR',
    `subjects_json` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `bio_summary` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `highlight_metric` varchar(250) COLLATE utf8mb4_unicode_520_ci,
    `portrait_url` varchar(500) COLLATE utf8mb4_unicode_520_ci,
    `landing_page_slug` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `base_payout_per_session` decimal(18,2) NOT NULL DEFAULT 250000.00,
    `review_rate_per_item` decimal(18,2) NOT NULL DEFAULT 15000.00,
    `student_count` int NOT NULL DEFAULT 0,
    `verified_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'VERIFIED',
    `rating_avg` decimal(5,2) NOT NULL DEFAULT 4.95,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_expert_code` (`expert_code`),
    UNIQUE KEY `key_landing_page_slug` (`landing_page_slug`),
    INDEX `index_expert_role_tier` (`expert_role`, `tier`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_curriculum_units` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `unit_code` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `subject_code` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `grade` int NOT NULL,
    `prerequisite_code` varchar(64) COLLATE utf8mb4_unicode_520_ci,
    `topic_name` varchar(300) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `yccd_description` mediumtext COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `exam_weight` int NOT NULL DEFAULT 8,
    `approval_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'APPROVED',
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_unit_code` (`unit_code`),
    INDEX `index_subject_grade` (`subject_code`, `grade`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_mastery_states` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `student_id` bigint unsigned NOT NULL,
    `unit_code` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `mastery_score` int NOT NULL DEFAULT 0,
    `mastery_level` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'NOT_STARTED',
    `is_root_cause_gap` tinyint(1) NOT NULL DEFAULT 0,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_student_unit` (`student_id`, `unit_code`),
    INDEX `index_student_root_gap` (`student_id`, `is_root_cause_gap`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_learning_cases` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `case_code` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `student_user_id` bigint unsigned NOT NULL,
    `parent_user_id` bigint unsigned NOT NULL DEFAULT 0,
    `career_expert_user_id` bigint unsigned NOT NULL DEFAULT 0,
    `life_coach_user_id` bigint unsigned NOT NULL DEFAULT 0,
    `care_agent_admin_id` bigint unsigned NOT NULL DEFAULT 0,
    `current_tier` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'TIER_3_COMPANION',
    `case_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'ACTIVE',
    `traffic_light` varchar(16) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'YELLOW',
    `weekly_hours_used` decimal(4,1) NOT NULL DEFAULT 9.5,
    `weekly_hours_quota` decimal(4,1) NOT NULL DEFAULT 14.0,
    `attendance_rate` int NOT NULL DEFAULT 96,
    `r1_report_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'APPROVED',
    `r2_report_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'PENDING_COACH_APPROVAL',
    `r3_report_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'LOCKED',
    `remedial_ratio_percent` int NOT NULL DEFAULT 60,
    `current_grade_ratio_percent` int NOT NULL DEFAULT 40,
    `internal_b3_note` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `parent_b3_summary` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_case_code` (`case_code`),
    INDEX `index_student_user_id` (`student_user_id`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_lesson_records` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `case_id` bigint unsigned NOT NULL DEFAULT 0,
    `student_id` bigint unsigned NOT NULL,
    `student_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `expert_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `subject_label` varchar(120) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `unit_code` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `topic_title` varchar(250) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `schedule_label` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `room_or_link` varchar(250) COLLATE utf8mb4_unicode_520_ci,
    `delivery_mode` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'AT_CENTER',
    `class_type` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'ONE_ON_ONE',
    `lesson_status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'SCHEDULED',
    `understanding_level` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'MASTERED',
    `mood_observed` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'Tập trung cao',
    `focus_score` int NOT NULL DEFAULT 5,
    `session_price` decimal(18,2) NOT NULL DEFAULT 0.00,
    `expert_payout_amount` decimal(18,2) NOT NULL DEFAULT 0.00,
    `structured_notes` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `sanitized_parent_summary` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `dlp_masked_count` int NOT NULL DEFAULT 0,
    `submitted_within_24h` tinyint(1) NOT NULL DEFAULT 1,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `index_student_status` (`student_id`, `lesson_status`),
    INDEX `index_lesson_status` (`lesson_status`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_safety_flags` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `student_user_id` bigint unsigned NOT NULL,
    `case_id` bigint unsigned NOT NULL DEFAULT 0,
    `source_module` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `severity` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'AMBER',
    `trigger_excerpt` mediumtext COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `ai_risk_analysis` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `emergency_hotline_shown` varchar(64) COLLATE utf8mb4_unicode_520_ci DEFAULT '111 / 115',
    `status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'PENDING_EXPERT_VERIFY',
    `verified_by_user_id` bigint unsigned NOT NULL DEFAULT 0,
    `parent_notified_at` datetime,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `index_severity_status` (`severity`, `status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_service_packages` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `ecommerce_product_id` bigint unsigned NOT NULL DEFAULT 0,
    `package_code` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `package_tier` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `tier_badge` varchar(120) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `title` varchar(250) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `summary` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `features_json` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `session_credits_granted` int NOT NULL DEFAULT 0,
    `billing_term_months` int NOT NULL DEFAULT 1,
    `discount_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
    `list_price_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `net_price_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `six_month_reference_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `featured` tinyint(1) NOT NULL DEFAULT 0,
    `status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'ACTIVE',
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_package_code` (`package_code`),
    INDEX `index_package_tier_status` (`package_tier`, `status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_ecommerce_order_wallets` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `ecommerce_order_id` bigint unsigned NOT NULL DEFAULT 0,
    `order_code` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `student_id` bigint unsigned NOT NULL DEFAULT 1,
    `parent_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `parent_phone` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `student_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `package_title` varchar(250) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `voucher_code` varchar(64) COLLATE utf8mb4_unicode_520_ci,
    `referral_code` varchar(64) COLLATE utf8mb4_unicode_520_ci,
    `subtotal_amount_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `discount_amount_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `net_paid_amount_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `dthh_base_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `rep_commission_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
    `leader_commission_vnd` decimal(18,2) NOT NULL DEFAULT 0.00,
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
    INDEX `index_student_id` (`student_id`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_consultation_leads` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `parent_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `phone` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `student_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `grade` int NOT NULL DEFAULT 9,
    `province` varchar(120) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'Đắk Lắk',
    `service_interest` varchar(300) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `channel` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'ONLINE',
    `referral_code` varchar(64) COLLATE utf8mb4_unicode_520_ci,
    `assigned_expert` varchar(160) COLLATE utf8mb4_unicode_520_ci,
    `quoted_amount_vnd` decimal(18,2) NOT NULL DEFAULT 4500000.00,
    `stage` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'NEW',
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `index_stage_id` (`stage`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_question_items` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `question_code` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `tool_group` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `subject_label` varchar(120) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `unit_code` varchar(120) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `author_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `stem_text` mediumtext COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `formula_latex` varchar(500) COLLATE utf8mb4_unicode_520_ci,
    `options_json` mediumtext COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `irt_discrimination` decimal(5,2) NOT NULL DEFAULT 0.42,
    `triggers_safety_flag` tinyint(1) NOT NULL DEFAULT 0,
    `approval_status` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'PENDING_APPROVAL',
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_question_code` (`question_code`),
    INDEX `index_approval_status` (`approval_status`, `id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_group_classes` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `group_code` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `title` varchar(250) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `expert_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `schedule_info` varchar(200) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `shared_gaps_csv` varchar(300) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `enrolled_count` int NOT NULL DEFAULT 2,
    `min_required` int NOT NULL DEFAULT 3,
    `max_capacity` int NOT NULL DEFAULT 5,
    `deadline_label` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `status` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'WAITING',
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_group_code` (`group_code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_residencies` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `student_id` bigint unsigned NOT NULL,
    `student_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `grade` int NOT NULL DEFAULT 9,
    `residency_type` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'DAY_BOARDING',
    `room_code` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `bed_code` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `allergy_warning` varchar(250) COLLATE utf8mb4_unicode_520_ci,
    `avg_sleep_hours` decimal(4,1) NOT NULL DEFAULT 7.8,
    `status` varchar(25) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'ACTIVE',
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `index_student_id` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_authorized_pickups` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `student_id` bigint unsigned NOT NULL,
    `guardian_full_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `relationship` varchar(120) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `phone_number` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `national_id_masked` varchar(64) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `qr_pass_token` varchar(128) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `is_authorized` tinyint(1) NOT NULL DEFAULT 1,
    `verification_note` varchar(250) COLLATE utf8mb4_unicode_520_ci,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_qr_pass_token` (`qr_pass_token`),
    INDEX `index_student_authorized` (`student_id`, `is_authorized`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

CREATE TABLE IF NOT EXISTS `oylg_boarding_checkins` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `student_id` bigint unsigned NOT NULL,
    `student_name` varchar(160) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `checkpoint_type` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `time_label` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `verification_status` varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'VERIFIED_SAFE',
    `notes` mediumtext COLLATE utf8mb4_unicode_520_ci,
    `checked_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `index_student_checked_at` (`student_id`, `checked_at`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
