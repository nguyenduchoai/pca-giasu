# Nền Tảng OYLG (All Your Life) — AI-First Platform (v1.0)

Hệ thống Hướng nghiệp, Cố vấn Cuộc sống & Đồng hành Học sinh từ Lớp 1 đến Lớp 12 theo đặc tả [DAC_TA_NEN_TANG_OYLG.md](./DAC_TA_NEN_TANG_OYLG.md) (Bản chốt v1.0 – 21 Phân hệ `M01`–`M21`).

---

## 1. Kiến Trúc Monorepo (TypeScript)

```text
pca-giasu/
├── apps/
│   └── web/                        # Ứng dụng Web AI-First (Next.js App Router, Tailwind CSS v4)
│       ├── src/app/page.tsx        # Cổng điều hành đa vai trò (6 AI-First Workspaces + Command Bar ⌘K)
│       ├── src/app/api/engine/     # REST API tính giá B6, hoa hồng PAY_AS_COLLECTED, truy ngược YCCĐ & Guardrails
│       ├── src/components/         # 6 Không gian làm việc AI-First theo vai trò
│       └── src/data/               # Dữ liệu mẫu chuẩn chương trình GDPT 2018 & Hồ sơ đồng hành
├── packages/
│   ├── database/                   # Prisma Schema đầy đủ cho M01..M21 (Multi-tenant tenant_id, pgvector)
│   └── shared/                     # Core Business & AI Guardrail Engines (có Unit Tests tự động)
└── DAC_TA_NEN_TANG_OYLG.md         # Tài liệu đặc tả gốc v1.0
```

---

## 2. Sáu Không Gian Giao Diện Chuẩn Hóa Thời AI (AI-First Workspaces)

1. **Tháp Điều Khiển Cố Vấn & Gia Sư (`LIFE_COACH` · `SUBJECT_EXPERT` · `CAREER_EXPERT` — `M05`, `M06`, `M07`, `M14`, `M20`)**:
   - **Bản đồ nhiệt Kiến thức 4D (`Time-Slider`)**: Kéo thanh trượt từ `Tuần 1` → `Tuần 12` để quan sát các lỗ hổng gốc (`isRootGap: true`) chuyển từ Đỏ → Vàng → Xanh ngọc.
   - **Split-Screen Human-in-the-Loop AI Copilot**: Cột trái hiển thị điểm định lượng, payload ẩn danh gửi Claude API (`[HS-2026-0089]`) và trích dẫn nguồn chính thống (`Bộ GD&ĐT GDPT 2018`, `UNICEF`, `Thư viện Playbook OYLG`); cột phải duyệt báo cáo với **2 lớp hiển thị tâm lý B3** (Bản nội bộ Cố vấn vs Bản tóm tắt gửi Phụ huynh).
   - **Biên bản buổi học 60 giây + Rào chắn thời gian thực**: Tự động che SĐT/Zalo (kể cả SĐT viết bằng chữ tiếng Việt) và kích hoạt **Cảnh báo An toàn Tâm lý M14 (Hotline 111 / 115)**.
2. **Ban Điều Hành & Ma Trận Giá Hệ Số B6 (`ADMIN` · `ACCOUNTANT` — `M01`, `M03`, `M09.2`, `M10`, `M11`, `M15`)**:
   - **4 Chỉ số Buổi sáng (Phụ lục B5-45)**: Doanh thu & Học sinh mới; Học sinh cần can thiệp; Chất lượng dịch vụ (CSAT/SLA); Tiến bộ học tập.
   - **Mô phỏng Ma trận Giá Hệ số B6**: `Giá gốc × Cấp chuyên gia (1.0/1.3/1.7) × Cấp học (0.8/1.0/1.2/1.4) × Hình thức (Zoom 1.0 / Trung tâm 1.2 / Tại nhà 1.5) × Kiểu lớp (1-1 1.0 / Nhóm nhỏ 0.6 / Nhóm lớn 0.35)` + Ưu đãi đóng dài (`-3% / -7% / -12%`).
   - **Thù lao cố định + Thưởng KPI Quý tối đa 10% (`M11`)** & **Điều phối Lớp nhóm chờ khai giảng (`M09.2`)**.
3. **Studio Duyệt Học Liệu Hàng Loạt (`CONTENT_APPROVER` Cố vấn Tracie Anh & `SUBJECT_LEAD` — `M04`)**:
   - Duyệt nhanh câu hỏi AI sinh cho 4 bộ công cụ (`B1`–`B4`), hiển thị công thức LaTeX, cảnh báo câu có độ phân biệt IRT âm và câu kích hoạt cờ an toàn `M14`.
4. **Cổng Phụ Huynh & Trợ Lý AI CSKH 24/7 (`PARENT` — `M02`, `M09.1`, `M12`, `M13`, `M19.1`)**:
   - **Feed "1 Tin Tổng Hợp/Ngày"**: Chống làm phiền phụ huynh, gộp tin vui vào Bản tin tuần.
   - **Đổi hình thức học linh hoạt theo từng buổi (`Zoom ↔ Trung tâm ↔ Tại nhà`)** tự tính chênh lệch ví buổi học.
   - **Trợ lý AI CSKH 24/7 với Generative UI Cards**: Chỉ trả lời từ `kb_answers` đã duyệt, hiển thị trực tiếp **Thẻ Dời Lịch 1-chạm**, **Thẻ VietQR PayOS Công ty OYLG**, và **Thẻ Chuyển Người (Ticket)** khi ngoài phạm vi.
5. **Không Gian Học Sinh Thích Ứng (`STUDENT` — `M05`, `M10.3`, `M20.11`)**:
   - Chuyển đổi giao diện theo độ tuổi (**THCS/THPT Lớp 6–12** vs **Tiểu học Lớp 1–5**).
   - Trải nghiệm trực tiếp thuật toán **Adaptive Knowledge Tracing**: trả lời sai câu Lớp 9 → hệ thống tự động lùi về Lớp 8 và Lớp 7 để khoanh vùng đúng **Lỗ hổng gốc**, kèm gợi ý **Socratic AI**.
6. **Hoa Hồng 2 Cấp Đúng Pháp Luật & Kiosk Nội Trú/Bán Trú (`SALES_LEADER` · `SALES_AGENT` · `BOARDING_STAFF` — `M18`, `M19`, `M21`)**:
   - Mô phỏng **Hoa hồng 2 cấp (`PAY_AS_COLLECTED`)** tính trên `DTHH = max(Kỳ đầu, Giá trị 6 tháng)`, tự hủy phần chưa thu nếu phụ huynh dừng sớm.
   - **Kiosk Quản sinh Nội trú & Bán trú (`M21`)**: Điểm danh QR, cảnh báo dị ứng thực phẩm và **xác thực người đón hợp lệ (`authorized_pickups`)** – tự động chặn người lạ và báo phụ huynh.

---

## 3. Hướng Dẫn Chạy Dự Án

```bash
# 1. Chạy kiểm thử tự động các Engine nghiệp vụ & Guardrails
pnpm test

# 2. Khởi chạy ứng dụng Web AI-First ở chế độ Development (http://localhost:3000)
pnpm dev

# 3. Build Production
pnpm build
```
