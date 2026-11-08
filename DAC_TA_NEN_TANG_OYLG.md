# ĐẶC TẢ NỀN TẢNG OYLG – HƯỚNG NGHIỆP & ĐỒNG HÀNH HỌC SINH

**Tài liệu dành cho:** đội lập trình (BA, Tech Lead, Backend, Frontend, AI/Data)
**Phiên bản:** 1.0 – bản chốt giao đội lập trình (07/11/2026). Các quyết định đã chốt tổng hợp tại **Phụ lục B**; đầu vào còn chờ (không chặn lập trình) ở **B9**.
- v0.2: bổ sung Bán hàng & Hoa hồng (M18), Chăm sóc khách hàng (M19), Phụ lục A – Cẩm nang vận hành CSKH.
- v0.3: chốt chính sách hoa hồng (Leader tự bán 15%, cơ sở tính = max(kỳ đầu, 6 tháng phí), không tính gia hạn, tính trên toàn bộ học phí); giải thích thiết kế hoa hồng 2 cấp đúng pháp luật (18.5b); bổ sung Giám sát lộ trình đào tạo học sinh (M20).
- v0.4: chốt chi hoa hồng dần theo tiền thực thu; đơn mua thêm do CSKH tư vấn không tính hoa hồng CTV, do CTV tư vấn thì tính như đơn mới; CTV tự mua được tính hoa hồng; M20 bổ sung kiểm tra & thi trên nền tảng (20.11), cảnh báo theo vai trò (20.12), gợi ý giải pháp & dự phòng rủi ro (20.13).
- v0.5: AI gợi ý giải pháp từ thư viện + kho tài liệu chính thống đã duyệt, bắt buộc ghi nguồn (20.13); hình thức học linh động trực tiếp / Zoom online theo từng buổi (9.1); câu hỏi mở chuyển sang Bộ câu hỏi chốt yêu cầu.
- v0.9: chốt 45 câu hỏi (Phụ lục B); 3 hình thức học online/trung tâm/tại nhà với giá khác nhau (9.1); lớp 1-1/nhóm nhỏ/nhóm lớn, đủ sĩ số mới khai giảng (9.2); trợ lý AI CSKH 24/7 (19.1); thêm M21 Nội trú & Bán trú; 4 điều nền tảng không làm (1.4); lộ trình theo ngân sách dưới 300 triệu (11.2).
- v1.0: thù lao chuyên gia cố định theo buổi + thưởng KPI quý tối đa 10% (M11); ưu đãi đóng dài 3%/7%/12%; trưởng môn kiêm duyệt; chi phí hạ tầng 10–20 triệu/tháng; lưu ghi hình đến hết gói + 30 ngày; pháp chế nội bộ rà soát pháp lý (B8, B9).
**Nguồn yêu cầu:** ghi âm `Dự Án Hướng Nghiệp_1.m4a` (yêu cầu gốc của chủ dự án), hai cuộc gọi `ALO 01.11.2026` (bối cảnh kinh doanh, mô hình nhượng quyền, thị trường Đắk Lắk) và yêu cầu bổ sung bằng văn bản của chủ dự án về bán hàng – CSKH.

> **Quy ước đọc tài liệu**
> - **[YC]**: yêu cầu nêu trực tiếp trong ghi âm, bắt buộc làm.
> - **[ĐX]**: đề xuất kỹ thuật/nghiệp vụ bổ sung để hệ thống chạy được. Chủ dự án cần xác nhận trước khi chốt.
> - **[GĐ2]**: để giai đoạn sau, không nằm trong MVP.
> - Các câu hỏi chưa có lời giải được gom ở **Mục 12** – cần chủ dự án trả lời trước khi code phần liên quan.

---

## MỤC LỤC

1. Tổng quan & mục tiêu
2. Vai trò người dùng (Actors)
3. Hành trình tổng thể (End-to-end flow)
4. Danh sách phân hệ
5. Đặc tả chi tiết từng phân hệ
6. Động cơ AI: nguyên lý vận hành
7. Mô hình dữ liệu (Data model)
8. Máy trạng thái (State machines)
9. Phân quyền chi tiết (RBAC matrix)
10. Yêu cầu phi chức năng, bảo mật & pháp lý
11. Kiến trúc kỹ thuật đề xuất & lộ trình triển khai
12. Câu hỏi mở cần chủ dự án quyết định
13. Phụ lục A – Cẩm nang vận hành Chăm sóc khách hàng
14. Phụ lục B – Tổng hợp quyết định đã chốt (v1.0)

---

## 1. TỔNG QUAN & MỤC TIÊU

### 1.1. Bài toán
Phụ huynh muốn con **biết mình sẽ làm nghề gì**, **có người đồng hành** về tinh thần, thể chất, kỹ năng sống, và **lấp được lỗ hổng kiến thức** để đỗ vào trường/ngành mong muốn. Hiện chưa có một đơn vị làm bài bản cho nhóm học sinh từ lớp 6 trở lên tại Đắk Lắk (theo nhận định trong cuộc gọi 02).

### 1.2. Sản phẩm
Một nền tảng web (và về sau là app) kết nối **Phụ huynh – Học sinh – Chuyên gia**. Nền tảng vận hành theo 3 tầng dịch vụ nối tiếp nhau:

```
 TẦNG 1: HƯỚNG NGHIỆP          TẦNG 2: CỐ VẤN CUỘC SỐNG           TẦNG 3: CHUYÊN GIA BỘ MÔN
 (Chuyên gia hướng nghiệp)  →  (Cố vấn cuộc sống / Life Coach) →  (Gia sư / Giáo viên từng môn)
 "Con sẽ trở thành ai?"         "Con đang ở đâu? Đi thế nào?"       "Lấp lỗ hổng, luyện thi"
  → Báo cáo hướng nghiệp         → Báo cáo sức khỏe 3 mặt            → Buổi học theo lộ trình
  → Bản đồ thành công            → Lộ trình học tập & phát triển     → Báo cáo tiến độ
```

### 1.3. Đối tượng phục vụ [YC]
Học sinh **lớp 1 – lớp 12**, mở rộng sang **sinh viên/sau đại học** và **học nghề**.
**Chốt v0.9** [YC]: giai đoạn đầu phục vụ **lớp 1 – 12**, **5 môn: Toán, Lý, Hóa, Anh, Văn**, **online toàn quốc** (trực tiếp tại trung tâm/nhà học sinh ở nơi có đội ngũ). Quy mô dự kiến **dưới 100 học sinh** trong 6 tháng đầu. Do phạm vi nội dung rộng, nội dung được **mở dần theo môn × cấp lớp** khi đã duyệt xong (xem 11.2).

### 1.4. Nguyên tắc sản phẩm
1. **Mọi giao dịch đi qua nền tảng** [YC]: đăng ký, đặt lịch, thanh toán. Không giao dịch ngoài.
2. **AI hỗ trợ, con người quyết định** [ĐX]: AI sinh câu hỏi và nháp báo cáo, chuyên gia duyệt rồi mới gửi phụ huynh.
3. **Cá nhân hóa** [YC]: câu hỏi xuất hiện thích ứng theo từng học sinh. Mỗi câu trả lời trở thành dữ liệu.
4. **Bám chương trình GDPT 2018 / SGK mới nhất của Bộ GD&ĐT** [YC]. Giai đoạn đầu bám bộ **Kết nối tri thức với cuộc sống** và hướng tới **bộ SGK thống nhất toàn quốc**; dữ liệu gắn theo "yêu cầu cần đạt" của chương trình nên đổi bộ sách không phải làm lại hệ thống.
5. **Sẵn sàng nhân bản (nhượng quyền)** [YC]: **dùng chung một nền tảng (multi-tenant)**, mỗi đơn vị nhượng quyền có khu vực dữ liệu riêng.

**Bốn điều nền tảng tuyệt đối không làm** [YC – chốt v0.9]
6. **Không để gia sư/chuyên gia liên hệ riêng với phụ huynh**: không hiển thị số điện thoại, email, Zalo cá nhân của hai bên cho nhau; mọi trao đổi qua tin nhắn trong nền tảng; hệ thống **tự phát hiện và che** số điện thoại, link mạng xã hội trong tin nhắn, biên bản, ghi chú gửi phụ huynh.
7. **Không gửi quá nhiều tin cho phụ huynh**: tối đa **1 tin tổng hợp/ngày** (trừ cảnh báo Đỏ và nhắc lịch học), tin vui gộp vào bản tin tuần.
8. **Không để AI tự gửi nội dung chưa duyệt** ra ngoài: báo cáo, cảnh báo, gợi ý giải pháp do AI soạn phải qua người duyệt. Riêng **trợ lý AI CSKH** chỉ được trả lời bằng **kho câu trả lời đã duyệt sẵn** (M19), ngoài phạm vi đó thì chuyển người.
9. **Không thu tiền ngoài nền tảng**: chuyên gia, CTV, CSKH không thu tiền trực tiếp; mọi khoản đi qua tài khoản công ty **All Your Life (OYLG)** với mã đơn.

---

## 2. VAI TRÒ NGƯỜI DÙNG (ACTORS)

| Mã | Vai trò | Mô tả | Nguồn |
|---|---|---|---|
| `PARENT` | Phụ huynh | Đăng ký cho con, mua gói, thanh toán, xem báo cáo, chọn chuyên gia | [YC] |
| `STUDENT` | Học sinh | Trả lời bộ câu hỏi, tham gia phiên tư vấn/học, xem lộ trình của mình | [YC] |
| `CAREER_EXPERT` | Chuyên gia hướng nghiệp | Thực hiện phiên hướng nghiệp, duyệt báo cáo hướng nghiệp | [YC] |
| `LIFE_COACH` | Cố vấn cuộc sống | Tầm soát 3 mặt sức khỏe, lập & điều chỉnh lộ trình, đồng hành định kỳ | [YC] |
| `SUBJECT_EXPERT` | Chuyên gia bộ môn (gia sư) | Có profile công khai, nhận học sinh theo môn, dạy theo lộ trình | [YC] |
| `ADMIN` | Quản trị viên | Duyệt đăng ký, xếp lịch, quản lý chuyên gia, gói, giá, nội dung | [YC] |
| `CONTENT_EDITOR` | Biên tập học liệu | Quản lý ngân hàng câu hỏi, duyệt câu hỏi AI sinh ra | [ĐX] |
| `ACCOUNTANT` | Kế toán | Đối soát, xác nhận tiền mặt, chi trả cho chuyên gia và hoa hồng, xuất hóa đơn | [ĐX] |
| `SALES_LEADER` | Trưởng nhóm bán hàng (Leader) | Quản lý một nhóm CTV, tự bán trực tiếp, hưởng hoa hồng cấp Leader trên doanh số của nhóm | [YC] |
| `SALES_AGENT` | Cộng tác viên tư vấn (CTV) | Tư vấn trực tiếp, có mã/link giới thiệu, tạo đơn offline, hưởng hoa hồng trực tiếp | [YC] |
| `OFFICE_STAFF` | Nhân viên văn phòng / lễ tân | Tiếp khách tại văn phòng và hội thảo, tạo đơn offline, check-in sự kiện, thu tiền theo quy trình | [ĐX] |
| `CARE_AGENT` | Nhân viên CSKH | Phụ trách một danh sách gia đình, thực hiện điểm chạm, xử lý yêu cầu (ticket) | [YC] |
| `CARE_LEAD` | Trưởng CSKH | Phân công, giám sát SLA, xử lý khiếu nại cấp 2, báo cáo chất lượng | [ĐX] |
| `AI_SUPERVISOR` | Quản lý hệ thống AI CSKH | Duyệt kho câu trả lời, xem nhật ký hội thoại, sửa câu trả lời sai | [YC] |
| `SUBJECT_LEAD` | Trưởng môn / trưởng mảng (gia sư Cấp 3 kiêm) | Duyệt chuyên môn nội dung môn/mảng mình trước khi chuyển duyệt cuối | [YC] |
| `CONTENT_APPROVER` | Người duyệt cuối nội dung chuyên môn | Duyệt cuối bộ công cụ, bộ câu hỏi (hiện tại: **Cố vấn Tracie Anh**) | [YC] |
| `BOARDING_MANAGER` | Quản lý cơ sở nội trú/bán trú | Phòng, hợp đồng lưu trú, phí, lịch trực, báo cáo | [YC] |
| `BOARDING_STAFF` | Quản sinh | Điểm danh, đưa đón, ăn uống, nhật ký sự việc | [YC] |
| `SUPER_ADMIN` | Quản trị hệ thống | Cấu hình toàn hệ thống, quản lý tenant | [ĐX] |
| `TENANT_ADMIN` | Quản trị đơn vị nhượng quyền | Quản lý chuyên gia, học sinh trong phạm vi tỉnh/chi nhánh | [GĐ2] |

> Một người có thể giữ nhiều vai trò (ví dụ một chuyên gia vừa là Cố vấn cuộc sống vừa dạy Toán). Hệ thống phải hỗ trợ **multi-role trên một tài khoản**.

---

## 3. HÀNH TRÌNH TỔNG THỂ (END-TO-END FLOW)

```
[1] Phụ huynh đăng ký trên web ──► [2] Admin tiếp nhận, xác minh, xếp lịch
        │                                         │
        ▼                                         ▼
[3] Tạo hồ sơ học sinh            [4] Phiên HƯỚNG NGHIỆP (Chuyên gia hướng nghiệp)
    (thông tin cá nhân,                 - Bộ câu hỏi hướng nghiệp thích ứng (AI)
     trường, lớp, khu vực,              - Thu thập câu trả lời
     phụ huynh)                         ▼
                                  [5] AI phân tích → Nháp BÁO CÁO HƯỚNG NGHIỆP
                                        - Nghề mục tiêu, bức tranh tương lai
                                        - Khung năng lực, điều kiện thành công
                                        - Mục tiêu trường/ngành
                                        ▼
                                  [6] Chuyên gia duyệt → Gửi phụ huynh
                                        ▼
[7] Phụ huynh mua GÓI CỐ VẤN CUỘC SỐNG ──► [8] Phiên TẦM SOÁT (Cố vấn cuộc sống)
                                              - Sức khỏe tinh thần
                                              - Sức khỏe thể chất
                                              - Sức khỏe kiến thức (scan từ lớp 1 → lớp hiện tại,
                                                theo các môn của khối thi mục tiêu)
                                              ▼
                                        [9] AI → BÁO CÁO SỨC KHỎE 3 MẶT + BẢN ĐỒ LỖ HỔNG
                                              ▼
                                        [10] AI gợi ý → LỘ TRÌNH (Cố vấn duyệt/chỉnh)
                                              - Lấy lại kiến thức cũ song song học hiện tại
                                              - Kế hoạch rèn luyện thể chất, kỹ năng sống
                                              ▼
[11] Phụ huynh/Học sinh chọn CHUYÊN GIA BỘ MÔN trên marketplace (theo lộ trình)
                                              ▼
[12] Học theo lịch → Cập nhật tiến độ → Tầm soát lại định kỳ → Điều chỉnh lộ trình
                                              ▼
[13] Mục tiêu: thi đỗ trường/ngành mong muốn, hoặc vào nghề đã định hướng
```

---

## 4. DANH SÁCH PHÂN HỆ

| # | Phân hệ | Mã | Ưu tiên |
|---|---|---|---|
| M01 | Tài khoản, xác thực & phân quyền | `IAM` | MVP |
| M02 | Hồ sơ học sinh & phụ huynh | `PROFILE` | MVP |
| M03 | Tiếp nhận đăng ký & điều phối (Admin) | `INTAKE` | MVP |
| M04 | Ngân hàng câu hỏi & khung chương trình | `QBANK` | MVP |
| M05 | Phiên đánh giá thích ứng (Assessment) | `ASSESS` | MVP |
| M06 | Phân tích & Báo cáo | `REPORT` | MVP |
| M07 | Lộ trình & Kế hoạch (Roadmap) | `ROADMAP` | MVP |
| M08 | Chuyên gia & Marketplace | `EXPERT` | MVP |
| M09 | Lịch & Phiên làm việc (Booking/Session) | `BOOKING` | MVP |
| M10 | Gói dịch vụ, Đơn hàng & Thanh toán | `BILLING` | MVP |
| M11 | Đối soát & Chi trả chuyên gia | `PAYOUT` | MVP (bản đơn giản) |
| M12 | Thông báo & Nhắn tin | `NOTIFY` | MVP |
| M13 | Theo dõi tiến độ & Dashboard | `PROGRESS` | MVP |
| M14 | Cảnh báo an toàn tâm lý | `SAFETY` | **MVP – bắt buộc** |
| M15 | Quản trị hệ thống, CMS & Báo cáo vận hành | `ADMIN` | MVP |
| M16 | Nhượng quyền / Đa đơn vị (Multi-tenant) | `TENANT` | GĐ2 (kiến trúc sẵn từ MVP) |
| M17 | Chiến dịch tầm soát tại trường (B2B) | `CAMPAIGN` | GĐ2 |
| M18 | Bán hàng (online & offline) & Hoa hồng 2 cấp | `SALES` | MVP |
| M19 | Chăm sóc khách hàng | `CARE` | MVP |
| M20 | Giám sát lộ trình đào tạo học sinh | `MONITOR` | MVP (bản cơ bản) |
| M21 | Nội trú & Bán trú | `BOARDING` | MVP (bản cơ bản) [YC – cần ngay] |

---

## 5. ĐẶC TẢ CHI TIẾT TỪNG PHÂN HỆ

### M01 – Tài khoản, xác thực & phân quyền (`IAM`)

**Chức năng**
- Đăng ký/đăng nhập bằng số điện thoại (OTP) và email + mật khẩu. [ĐX] Hỗ trợ đăng nhập Google/Zalo.
- Phụ huynh là chủ tài khoản. **Tài khoản học sinh do phụ huynh tạo** và liên kết (1 phụ huynh – N con; 1 con có thể có 2 phụ huynh).
- Chuyên gia **không tự đăng ký công khai**: nộp hồ sơ ứng tuyển, Admin duyệt rồi mới cấp vai trò.
- Phân quyền RBAC + kiểm tra theo **quan hệ phân công** (chuyên gia chỉ xem được học sinh đang được giao cho mình).
- Ghi nhật ký đăng nhập, đổi mật khẩu, 2FA bắt buộc với Admin.

**Quy tắc nghiệp vụ**
- BR-IAM-01: Học sinh dưới 13 tuổi đăng nhập qua tài khoản phụ huynh hoặc mã đăng nhập do phụ huynh cấp. Không dùng email riêng.
- BR-IAM-02: Chuyên gia mất quyền truy cập hồ sơ học sinh **ngay khi** hết phân công (hết gói/đổi chuyên gia). Báo cáo đã viết vẫn còn trong hệ thống.

---

### M02 – Hồ sơ học sinh & phụ huynh (`PROFILE`)

**Dữ liệu thu thập** [YC]
- Học sinh: họ tên, **ngày sinh**, giới tính (tùy chọn), **lớp**, **trường**, **khu vực** (tỉnh/xã theo danh mục hành chính mới), ảnh (tùy chọn).
- Phụ huynh: họ tên, quan hệ, số điện thoại, email, nghề nghiệp (tùy chọn), địa chỉ.
- [ĐX] Bổ sung: khối thi/môn thế mạnh tự đánh giá, sở thích, mục tiêu ban đầu của phụ huynh và của con (để so sánh), điểm tổng kết các năm (upload học bạ – tùy chọn), tình trạng sức khỏe đặc biệt cần lưu ý.

**Chức năng**
- Hồ sơ là **"bệnh án học tập"** xuyên suốt: mọi phiên, báo cáo, lộ trình, buổi học đều gắn vào hồ sơ học sinh theo dòng thời gian (timeline).
- Phiên bản hóa thông tin quan trọng (lớp, trường thay đổi theo năm học).
- Phụ huynh xem, sửa thông tin cơ bản. Chuyên gia xem theo quyền (xem M09 – RBAC).
- Ghi nhận **đồng ý xử lý dữ liệu** của phụ huynh (và của học sinh khi đủ tuổi) trước khi tạo hồ sơ – xem Mục 10.

---

### M03 – Tiếp nhận đăng ký & điều phối (`INTAKE`)

> **Quan hệ với M18/M19:** M18 lo phần **bán** (lead → đơn hàng → thanh toán → cấp tài khoản). M03 lo phần **điều phối dịch vụ sau khi đã bán** (phân công chuyên gia, xếp lịch). M19 lo **quan hệ khách hàng** suốt vòng đời. Lead chưa mua vẫn nằm ở M18.

**Luồng** [YC: "phụ huynh đăng ký với admin thông qua trang để được test cho con"]
1. Phụ huynh điền form đăng ký (landing page hoặc trong tài khoản), chọn dịch vụ quan tâm.
2. Hệ thống tạo **Lead/Yêu cầu** ở trạng thái `NEW`. Thông báo cho Admin.
3. Admin gọi xác minh, tư vấn gói, rồi chuyển sang `QUALIFIED`.
4. Admin **phân công chuyên gia** (hướng nghiệp hoặc cố vấn) và **xếp lịch** [YC: "thông qua các lịch sắp xếp của admin"].
5. Phụ huynh thanh toán (nếu dịch vụ trả trước), rồi lịch được xác nhận.

**Chức năng Admin**
- Bảng Kanban lead: `NEW → CONTACTED → QUALIFIED → SCHEDULED → CONVERTED / LOST`.
- Gợi ý chuyên gia phù hợp theo: khu vực, lịch trống, chuyên môn, tải hiện tại [ĐX].
- Ghi chú cuộc gọi, nguồn lead (Facebook, giới thiệu, trường học, sự kiện…) để đo hiệu quả marketing.

---

### M04 – Ngân hàng câu hỏi & khung chương trình (`QBANK`)

Đây là **tài sản trí tuệ cốt lõi** của dự án. Có 4 bộ công cụ:

| Bộ | Người sử dụng | Mục đích | Nguồn |
|---|---|---|---|
| **B1 – Hướng nghiệp** | Chuyên gia hướng nghiệp | Tìm sở thích, năng lực, giá trị, tính cách, "sứ mệnh" của con | [YC] |
| **B2 – Tầm soát kiến thức** | Cố vấn cuộc sống | Scan kiến thức từng môn **từ lớp 1 đến lớp hiện tại**, bám SGK mới | [YC] |
| **B3 – Sức khỏe tinh thần** | Cố vấn cuộc sống | Phát hiện căng thẳng, khó khăn, khủng hoảng tâm lý, thay đổi tâm sinh lý | [YC] |
| **B4 – Sức khỏe thể chất & kỹ năng sống** | Cố vấn cuộc sống | Thói quen vận động, ngủ, ăn uống; kỹ năng tự lập, tự học, phản biện | [YC] |

#### 4.1. Khung chương trình (Curriculum Graph) – nền móng của B2
Muốn "scan kiến thức từ lớp 1" thì phải số hóa chương trình thành **đồ thị kiến thức**:

```
Môn học (Toán)
 └── Lớp (Lớp 7)
      └── Chủ đề / Chương (Số hữu tỉ)
           └── Đơn vị kiến thức / Yêu cầu cần đạt (YCCĐ) (So sánh hai số hữu tỉ)
                ├── điều_kiện_tiên_quyết → [YCCĐ lớp 6: So sánh phân số]
                └── câu_hỏi[] (nhiều mức độ: Nhận biết / Thông hiểu / Vận dụng / Vận dụng cao)
```

- Đơn vị nhỏ nhất là **Yêu cầu cần đạt (YCCĐ)** theo Chương trình GDPT 2018. Mỗi YCCĐ có mã duy nhất, ví dụ `TOAN.07.SHT.03`.
- **Quan hệ tiên quyết (prerequisite)** giữa các YCCĐ là chìa khóa để AI **truy ngược lỗ hổng**: học sinh lớp 11 sai phần hàm số, hệ thống lần ngược về lớp 9, lớp 8 xem hổng từ đâu.
- Gắn nhãn **bộ sách** (Kết nối tri thức / Chân trời sáng tạo / Cánh Diều) cho câu hỏi khi cần, vì trường dùng bộ sách khác nhau [ĐX].

#### 4.2. Cấu trúc một câu hỏi
| Trường | Mô tả |
|---|---|
| `id`, `code` | Mã câu hỏi |
| `toolkit` | B1/B2/B3/B4 |
| `type` | Có/Không [YC], Thang điểm (1–5 hoặc 1–10) [YC], Trắc nghiệm 1 đáp án, Nhiều đáp án, Tự luận ngắn, Xếp hạng, Câu hỏi mở cho phỏng vấn |
| `content` | Nội dung (hỗ trợ công thức LaTeX, hình ảnh) |
| `options[]`, `answer_key` | Đáp án (với câu kiến thức) |
| `skill_tags[]` | Gắn YCCĐ (B2) hoặc chiều đo (B1: ví dụ RIASEC-R, giá trị-An toàn…) |
| `difficulty` | Mức độ (Nhận biết → Vận dụng cao) hoặc tham số IRT |
| `grade_range` | Phù hợp lớp nào |
| `audience` | Học sinh tự trả lời / Chuyên gia hỏi và nhập |
| `source` | `HUMAN` / `AI_GENERATED` |
| `status` | `DRAFT → IN_REVIEW → APPROVED → RETIRED` |
| `stats` | Số lần dùng, tỉ lệ đúng, độ phân biệt (tự cập nhật) |

#### 4.3. Quy trình sản xuất câu hỏi
> **Chốt v0.9** [YC]: **AI soạn** toàn bộ bộ công cụ và bộ câu hỏi (hướng nghiệp B1, tầm soát kiến thức B2, tinh thần B3, thể chất – kỹ năng B4) và **số hóa chương trình** (YCCĐ + quan hệ tiên quyết), vận dụng kiến thức chuyên gia hàng đầu từng lĩnh vực, kinh nghiệm giáo viên giỏi từng môn và **bộ SGK thống nhất**. Đội giáo viên rà soát chuyên môn; **Cố vấn Tracie Anh duyệt cuối** (vai trò `CONTENT_APPROVER`) trước khi đưa vào hệ thống. Hệ thống cần một **màn hình duyệt hàng loạt** (lọc theo môn/lớp/bộ công cụ, xem nhanh, duyệt hoặc trả lại kèm ghi chú) để người duyệt cuối xử lý khối lượng lớn.

1. Chuyên gia/biên tập soạn tay, **hoặc** AI sinh nháp hàng loạt theo YCCĐ.
2. Câu do AI sinh **bắt buộc** qua duyệt của `CONTENT_EDITOR` (chuyên môn đúng môn) trước khi `APPROVED`.
3. Chỉ câu `APPROVED` mới được dùng trong phiên đánh giá thật.
4. Hệ thống tự gắn cờ câu có thống kê bất thường (ví dụ 100% sai, hoặc độ phân biệt âm) để xem lại.

#### 4.4. Bộ B1 – Hướng nghiệp: các chiều đo đề xuất [ĐX]
Để báo cáo có cơ sở khoa học, bộ câu hỏi nên đo theo các khung đã kiểm chứng (đội chuyên môn chọn và Việt hóa, lưu ý bản quyền công cụ):
- **Sở thích nghề nghiệp**: mô hình Holland (RIASEC).
- **Năng lực/trí thông minh nổi trội**: tham khảo đa trí tuệ, kết quả học tập thực tế (từ B2).
- **Tính cách**: Big Five (bản dành cho thanh thiếu niên).
- **Giá trị nghề nghiệp & động lực**: điều con coi trọng (thu nhập, sáng tạo, giúp người, ổn định…).
- **Bối cảnh**: điều kiện gia đình, mong muốn phụ huynh, khu vực, khả năng tài chính cho học tập.
- **Câu hỏi phỏng vấn mở** để chuyên gia khai thác "sứ mệnh", hình mẫu, ước mơ.

> Lưu ý: sinh trắc vân tay, thần số học **không** nên dùng làm cơ sở báo cáo vì không có giá trị khoa học, dễ gây rủi ro uy tín [ĐX].

---

### M05 – Phiên đánh giá thích ứng (`ASSESS`)

**Mục tiêu** [YC]: câu hỏi "xuất hiện cá nhân hóa với từng học sinh"; mỗi câu trả lời thành dữ liệu để AI chọn câu tiếp theo phù hợp nhất.

**Hai chế độ**
1. **Chuyên gia dẫn dắt (Guided)** [YC]: chuyên gia ngồi cùng học sinh (trực tiếp/online), màn hình chuyên gia hiển thị câu hỏi gợi ý, chuyên gia đọc và **nhập câu trả lời** (cả ghi chú quan sát). Phù hợp B1, B3.
2. **Học sinh tự làm (Self)** [ĐX]: gửi link bài cho học sinh làm (có giới hạn thời gian, chống chuyển tab cơ bản). Phù hợp B2 (kiến thức), B4.

**Nguyên lý chọn câu hỏi (adaptive)** – xem chi tiết Mục 6.2
- B2 (kiến thức): bắt đầu ở lớp hiện tại, sai thì **lần ngược theo quan hệ tiên quyết** xuống lớp dưới, đúng thì bỏ qua nhánh con. Nhờ vậy giảm từ hàng nghìn YCCĐ xuống vài chục câu cho mỗi môn.
- B1, B3, B4: AI chọn/biến tấu câu hỏi tiếp theo dựa trên câu trả lời trước, **chỉ từ ngân hàng câu đã duyệt** (hoặc biến thể có kiểm soát).

**Phạm vi phiên** [YC]
- Có thể tầm soát **1 môn**, **3 môn của khối thi**, hoặc **số môn tùy mục tiêu**. Khi tạo phiên, chuyên gia chọn: học sinh, bộ công cụ, môn, phạm vi lớp.

**Chức năng**
- Lưu từng câu trả lời ngay lập tức (autosave), có thể tạm dừng và làm tiếp.
- Ghi thời gian trả lời từng câu (tín hiệu "đoán bừa" hoặc "hiểu chắc").
- Kết thúc phiên thì chuyển sang M06 để phân tích.

---

### M06 – Phân tích & Báo cáo (`REPORT`)

**Các loại báo cáo**

| Báo cáo | Sinh từ | Nội dung chính | Người duyệt |
|---|---|---|---|
| **R1 – Báo cáo hướng nghiệp** [YC] | Phiên B1 | Hồ sơ năng lực – sở thích – tính cách; **bức tranh tương lai** (mô tả chi tiết công việc con hướng tới); **khung năng lực** cần có; điều kiện thành công; 3 nghề/ngành gợi ý xếp hạng; trường/ngành mục tiêu và điểm chuẩn tham khảo; **Bản đồ thành công** (các cột mốc lớn) | Chuyên gia hướng nghiệp |
| **R2 – Báo cáo sức khỏe 3 mặt** [YC] | Phiên B2+B3+B4 | **Kiến thức**: bản đồ nhiệt (heatmap) theo môn × lớp × chủ đề, chỉ rõ "hổng ở đâu, từ lớp mấy"; **Tinh thần**: mức độ căng thẳng, điểm cần quan tâm; **Thể chất & kỹ năng**: thói quen, kỹ năng còn thiếu | Cố vấn cuộc sống |
| **R3 – Báo cáo khoảng cách mục tiêu** [ĐX] | R1 + R2 | So sánh "hiện tại" với "yêu cầu để đỗ trường/ngành mục tiêu", ước lượng mức độ khả thi và thời gian cần | Cố vấn cuộc sống |
| **R4 – Báo cáo tiến độ định kỳ** [ĐX] | M13 | Tiến độ theo lộ trình, nhận xét của chuyên gia bộ môn, kết quả tầm soát lại | Cố vấn cuộc sống |

**Nguyên lý vận hành**
1. Phiên kết thúc → hệ thống tính **điểm định lượng** (deterministic, có công thức rõ ràng) → AI viết **phần diễn giải, khuyến nghị** dựa trên điểm số và ghi chú chuyên gia.
2. Báo cáo ở trạng thái `AI_DRAFT` → chuyên gia **xem, sửa, bổ sung** → `APPROVED` → gửi phụ huynh (`PUBLISHED`).
3. **Không bao giờ** gửi bản AI chưa duyệt cho phụ huynh/học sinh.
4. Báo cáo có bản xem trên web (đẹp, có biểu đồ) và **xuất PDF** có logo/thương hiệu (và logo đơn vị nhượng quyền ở GĐ2).
5. Lưu phiên bản: mỗi lần sửa sau khi đã phát hành tạo phiên bản mới, giữ lịch sử.
6. Nội dung tinh thần nhạy cảm (B3) có **2 lớp hiển thị**: bản chi tiết cho chuyên gia; bản cho phụ huynh/học sinh được diễn đạt phù hợp, do cố vấn quyết định mức chia sẻ [ĐX].

---

### M07 – Lộ trình & Kế hoạch (`ROADMAP`)

[YC] "Gợi ý một lộ trình để con giải luyện các môn… lấy lại kiến thức cũ như thế nào, trong bao lâu, phương pháp nào, mà vẫn theo được kiến thức hiện tại."

**Cấu trúc lộ trình**
```
Lộ trình (Roadmap) – gắn 1 học sinh, 1 mục tiêu (trường/ngành/nghề), có ngày bắt đầu – ngày thi
 ├── Giai đoạn (Phase)  ví dụ: "Lấp nền lớp 6–9" | "Củng cố lớp 10–11" | "Luyện đề"
 │    ├── Mục tiêu đo được (KPI)  ví dụ: "Đạt ≥80% YCCĐ Đại số lớp 8 ở lần tầm soát lại"
 │    └── Hạng mục (Item)
 │         ├── Loại: HỌC_KIẾN_THỨC | RÈN_THỂ_CHẤT | KỸ_NĂNG_SỐNG | TINH_THẦN | TRẢI_NGHIỆM_NGHỀ
 │         ├── Liên kết YCCĐ cần lấy lại (với loại kiến thức)
 │         ├── Tần suất & thời lượng (ví dụ 2 buổi/tuần × 90 phút)
 │         ├── Người phụ trách: Chuyên gia bộ môn X | Cố vấn | Học sinh tự học
 │         └── Trạng thái: TODO | IN_PROGRESS | DONE | BLOCKED
 └── Mốc tầm soát lại (Checkpoint) định kỳ, ví dụ mỗi 4–6 tuần
```

**Nguyên lý tạo lộ trình**
1. Đầu vào: R2 (lỗ hổng), R1 (mục tiêu), **quỹ thời gian thực tế** của học sinh (lịch học chính khóa, số giờ rảnh/tuần), ngân sách gói của phụ huynh.
2. Thuật toán xếp thứ tự lỗ hổng: ưu tiên **YCCĐ gốc** (tiên quyết của nhiều phần khác) và YCCĐ có **trọng số cao trong kỳ thi mục tiêu**.
3. Nguyên tắc "song song" [YC]: phân bổ thời gian lấp nền **xen kẽ** với bài đang học trên lớp, không dồn hết vào ôn cũ. Mặc định khoảng 60% lấp nền / 40% theo chương trình hiện tại, cố vấn chỉnh được [ĐX].
4. AI sinh **nháp lộ trình**, cố vấn cuộc sống chỉnh và duyệt, phụ huynh xác nhận.
5. Mỗi checkpoint: tầm soát lại → so sánh → AI đề xuất điều chỉnh → cố vấn duyệt.
6. Sau khi lộ trình được duyệt, việc **thực thi và giám sát hằng ngày** (kế hoạch từng môn, biên bản buổi học, cảnh báo sớm, phối hợp cố vấn – gia sư) do **M20** đảm nhiệm.

---

### M08 – Chuyên gia & Marketplace (`EXPERT`)

[YC] "Phụ huynh cũng như học sinh lên nền tảng để chọn chuyên gia đang có profile… lựa chọn chuyên gia của từng môn."

**Hồ sơ chuyên gia**
- Thông tin: ảnh, giới thiệu, bằng cấp/chứng chỉ (upload, Admin xác minh), kinh nghiệm, môn & cấp lớp dạy, hình thức (online/offline, khu vực), lịch trống, **mức phí** (theo buổi/gói), video giới thiệu (tùy chọn).
- Chỉ số tin cậy: số học sinh đã đồng hành, đánh giá sao và nhận xét (chỉ từ phụ huynh đã thực sự học), **tỉ lệ cải thiện điểm tầm soát** của học sinh (chỉ số khách quan) [ĐX].
- Huy hiệu: "Đã xác minh", "Chuyên gia hướng nghiệp", "Cố vấn cuộc sống", "Bộ môn: Toán THPT"…

**Quy trình gia nhập chuyên gia**
`APPLIED → DOCS_VERIFIED → INTERVIEWED → TRAINED (đào tạo quy trình OYLG) → ACTIVE → SUSPENDED/INACTIVE`

**Tìm kiếm & gợi ý**
- Lọc: môn, lớp, khu vực, online/offline, khung giờ, khoảng giá, đánh giá.
- **Gợi ý theo lộ trình** [ĐX]: từ hạng mục lộ trình "Lấp nền Hình học lớp 8–9", hệ thống đề xuất chuyên gia phù hợp. Cố vấn cuộc sống có thể "giới thiệu" chuyên gia cho phụ huynh.

---

### M09 – Lịch & Phiên làm việc (`BOOKING`)

**Loại phiên**
| Loại | Ai thực hiện | Đặc điểm |
|---|---|---|
| `CAREER_SESSION` | Chuyên gia hướng nghiệp | Gắn bộ B1, sinh R1 |
| `SCREENING_SESSION` | Cố vấn cuộc sống | Gắn bộ B2/B3/B4, sinh R2 |
| `COACHING_SESSION` | Cố vấn cuộc sống | Phiên đồng hành định kỳ theo gói |
| `TUTORING_SESSION` | Chuyên gia bộ môn | Buổi học theo hạng mục lộ trình |

**Chức năng**
- Chuyên gia khai báo lịch trống (lặp theo tuần + ngoại lệ).
- Admin xếp lịch [YC] **hoặc** phụ huynh tự đặt khung trống (cấu hình theo loại phiên) [ĐX].
- Phiên online: tự tạo link họp (Google Meet/Zoom) [ĐX]. Phiên offline: địa điểm.
- Sau mỗi phiên, chuyên gia **bắt buộc** nhập **biên bản phiên** (nội dung, nhận xét, bài tập, tâm trạng học sinh) trong 24h, vì đây là điều kiện ghi nhận công để chi trả.
- Điểm danh, xác nhận hoàn thành từ 2 phía. Chính sách hủy/đổi lịch (ví dụ báo trước ≥ 12h) cấu hình được.
- Nhắc lịch tự động (M12).

#### 9.1. Ba hình thức linh động: Online Zoom – Tại trung tâm – Tại nhà học sinh [YC – chốt v0.9]
Mọi phiên của **Cố vấn cuộc sống**, **Gia sư** và **Chuyên gia hướng nghiệp** chọn được 1 trong 3 hình thức, và **chọn theo từng buổi**, không cố định cho cả gói:

| Hình thức | Mã | Giá (hệ số so với online) [ĐX hệ số] |
|---|---|---|
| Online qua Zoom | `ONLINE_ZOOM` | **Rẻ nhất** – hệ số 1,0 |
| Tại trung tâm | `AT_CENTER` | **Trung bình** – ví dụ hệ số 1,2 |
| Tại nhà học sinh | `AT_HOME` | **Cao nhất** – ví dụ hệ số 1,5 |

**Thiết lập**
- **Chuyên gia khai báo**: hình thức nhận dạy (một, hai hoặc cả ba); với tại nhà thì khai **khu vực/bán kính** nhận dạy; khung giờ cho từng hình thức.
- **Gói dịch vụ** có **hình thức mặc định** do phụ huynh chọn khi mua; từng buổi vẫn đổi được.
- **Giá theo hình thức** [YC]: online < tại trung tâm < tại nhà. Bảng giá cấu hình theo cấp chuyên gia × hình thức × kiểu lớp (Phụ lục B).

**Đặt lịch và đổi hình thức**
- Lịch do **kết hợp** [YC]: phiên hướng nghiệp và tầm soát do Admin xếp; buổi gia sư và cố vấn định kỳ phụ huynh tự chọn khung trống, Admin can thiệp khi cần.
- Khi đặt buổi tại nhà, hệ thống tính cả thời gian di chuyển giữa 2 buổi của gia sư.
- **Đổi hình thức bất cứ lúc nào nếu hai bên đồng ý** [YC]: một bên gửi yêu cầu, bên kia xác nhận trên hệ thống. Hệ thống **tự tính chênh lệch giá** (trừ thêm hoặc hoàn lại vào ví buổi học) và tự đổi phòng Zoom ↔ địa điểm.
- Lịch sử hình thức của từng buổi được lưu để thống kê.

**Dời và hủy buổi** [YC]
- Học sinh báo trước **12 giờ** thì được dời buổi; tối đa **2 lần dời/tháng/môn**. Vắng không báo hoặc báo sát giờ thì tính là đã học.
- Gia sư hủy sát giờ (dưới 12 giờ): học sinh được **bù 1 buổi miễn phí** [ĐX theo khuyến nghị], ghi nhận vào chỉ số kỷ luật của gia sư.

**Buổi online qua Zoom**
- Hệ thống **tự tạo phòng Zoom** cho mỗi buổi qua Zoom API, dùng **tài khoản Zoom trả phí của công ty** [YC]. Link vào học hiện trong lịch và gửi kèm tin nhắc. Phòng có mật khẩu và phòng chờ.
- **Điểm danh tự động** từ báo cáo người tham gia của Zoom; gia sư xác nhận lại trong biên bản.
- **Ghi hình tất cả các buổi** để kiểm soát chất lượng [YC]. Phụ huynh đồng ý ghi hình **ngay khi đăng ký** (điều khoản bắt buộc trong hợp đồng dịch vụ). Bản ghi lưu đến **hết gói học + 30 ngày** [YC – chốt v1.0] rồi tự xóa, chỉ phụ huynh, cố vấn, gia sư của buổi đó và bộ phận kiểm soát chất lượng xem được; mọi lượt xem ghi audit log.
- Bài kiểm tra trong buổi online: học sinh làm trực tiếp trên nền tảng (M20 – 20.11).

**Buổi tại trung tâm / tại nhà**
- Tại trung tâm: chọn phòng, chống trùng phòng; điểm danh quét QR.
- Tại nhà học sinh: địa chỉ lưu trong hồ sơ, chỉ chuyên gia của buổi đó xem được; điểm danh bằng phụ huynh xác nhận trên app hoặc mã OTP gia sư đưa.
- Bài kiểm tra: làm trên máy tính bảng/điện thoại, hoặc làm giấy rồi gia sư nhập kết quả từng câu (20.11).

**Quy tắc chung cho cả 3 hình thức**
- Biên bản, bài kiểm tra, cảnh báo và chi trả cho chuyên gia **giống hệt nhau**; chỉ khác giá và thù lao theo hình thức.
- Báo cáo thống kê tỉ lệ từng hình thức và kết quả học tập theo hình thức.

#### 9.2. Kiểu lớp: 1 kèm 1 – Nhóm nhỏ – Nhóm lớn [YC – chốt v0.9]
Phụ huynh tự chọn kiểu lớp. Nếu chọn nhóm thì **đủ người mới khai giảng**.

| Kiểu lớp | Sĩ số [ĐX, cấu hình được] | Giá/học sinh (hệ số so với 1 kèm 1) [ĐX] |
|---|---|---|
| 1 kèm 1 | 1 | 1,0 |
| Nhóm nhỏ | 2–5 | ví dụ 0,6 |
| Nhóm lớn | 6–20 | ví dụ 0,35 |

**Quy trình lớp nhóm**
1. Admin hoặc hệ thống **mở lớp chờ**: môn, cấp lớp/trình độ, hình thức (online/trung tâm), lịch dự kiến, gia sư, sĩ số tối thiểu – tối đa, **hạn chốt khai giảng**.
2. Phụ huynh **đăng ký và giữ chỗ** (thanh toán hoặc đặt cọc theo cấu hình). Ghép lớp ưu tiên học sinh có **lỗ hổng kiến thức tương đồng** (dựa trên bản đồ YCCĐ) [ĐX].
3. **Đủ sĩ số tối thiểu → tự khai giảng**, thông báo cho phụ huynh, tạo lịch và phòng Zoom/phòng học.
4. **Đến hạn mà chưa đủ**: phụ huynh chọn **chờ thêm**, **chuyển lớp khác**, **chuyển sang 1 kèm 1** (bù chênh lệch) hoặc **hoàn tiền 100%**.
5. Đủ sĩ số tối đa thì đóng đăng ký, mở danh sách chờ.
- Trong lớp nhóm, **mỗi học sinh vẫn có hồ sơ đồng hành, kế hoạch và kết quả kiểm tra riêng** (M20). Gia sư nhập biên bản chung cho buổi và nhận xét riêng từng em.
- Lớp nhóm tại nhà học sinh: [ĐX] không mở (chỉ online hoặc tại trung tâm), trừ khi Admin cấu hình khác.

---

### M10 – Gói dịch vụ, Đơn hàng & Thanh toán (`BILLING`)

[YC] "Mọi giao dịch thanh toán đều thông qua sự chính thống của dự án."

**Danh mục gói (cấu hình được, ví dụ minh họa)**
| Nhóm | Ví dụ gói | Đơn vị tính |
|---|---|---|
| Hướng nghiệp | Gói Hướng nghiệp cơ bản / chuyên sâu (1–2 phiên + R1) | Trọn gói |
| Tầm soát | Tầm soát 1 môn / 3 môn khối thi / toàn diện 3 mặt | Trọn gói |
| Cố vấn cuộc sống [YC] | 1 phiên/tuần × 1h; 2 phiên/tuần; 3 phiên/tuần; **Toàn diện** (đồng hành bất kỳ lúc nào) | Theo tháng/quý |
| Chuyên gia bộ môn | Theo buổi, gói 8/12/24 buổi | Theo giá của chuyên gia |
| Combo [ĐX] | Hướng nghiệp + Tầm soát + 3 tháng cố vấn | Trọn gói |

**Chức năng**
- Đơn hàng → thanh toán qua cổng VN (VNPay / MoMo / PayOS – chuyển khoản QR tự đối soát) [ĐX]. Hỗ trợ trả theo kỳ (tháng).
- **Ví buổi học (credit)**: gói nhiều buổi lưu dưới dạng số buổi còn lại, mỗi phiên hoàn thành trừ 1 buổi.
- Gia hạn tự động/nhắc gia hạn; hoàn tiền theo chính sách; mã giảm giá; giá theo khu vực/tenant (GĐ2).
- Xuất hóa đơn điện tử [ĐX].

---

### M11 – Đối soát & Chi trả chuyên gia (`PAYOUT`)

**Cách tính thù lao – chốt v1.0** [YC]
1. **Thù lao cố định theo buổi**: bảng thù lao theo **cấp chuyên gia × hình thức (online / trung tâm / tại nhà) × kiểu lớp (1-1 / nhóm nhỏ / nhóm lớn) × loại phiên** (gia sư, cố vấn, hướng nghiệp, tầm soát). Lưu trong `expert_pay_rates`, có ngày hiệu lực; Admin chỉnh không cần lập trình. Không trả theo % học phí.
2. Mỗi buổi **hoàn thành** (có biên bản trong 24h, có điểm danh, không khiếu nại trong 3 ngày) thì ghi nhận thù lao buổi đó. Học sinh vắng không báo (tính là đã học) thì gia sư vẫn được trả. Gia sư hủy sát giờ thì không trả buổi đó và buổi bù cho học sinh cũng không trả. [YC – chốt v1.0]
3. **Thưởng KPI theo quý**: tối đa **10% tổng thù lao cố định của quý**, chấm theo 4 tiêu chí (trọng số đề xuất, cấu hình được):
   | Tiêu chí | Trọng số | Nguồn dữ liệu |
   |---|---|---|
   | Tiến bộ học sinh | 40% | Tốc độ lấp lỗ hổng, cải thiện tầm soát so với xuất phát điểm (M20) |
   | Kỷ luật | 20% | Biên bản đúng hạn, đúng giờ, ít hủy buổi (M09, M20) |
   | Hài lòng (CSAT) | 20% | Điểm CSAT sau buổi (M19) |
   | Giữ chân / gia hạn | 20% | Tỉ lệ học sinh gia hạn với chính chuyên gia đó (M10) |
   Điểm KPI = tổng (điểm tiêu chí × trọng số), quy ra % thưởng (100 điểm = 10%). Chuyên gia có quá ít học sinh trong quý (ví dụ dưới 3) thì không xét tiêu chí tiến bộ và gia hạn [ĐX].
4. **Trưởng môn kiêm duyệt** (`SUBJECT_LEAD`): thêm thù lao duyệt theo khối lượng (số câu hỏi / bộ công cụ duyệt), cấu hình đơn giá riêng.
- **Kỳ chi trả: mỗi tháng 1 lần** [YC]: kế toán duyệt bảng kê thù lao cố định của tháng → chi trả → chuyên gia xem sao kê. Thưởng KPI chi cùng kỳ chi trả của tháng đầu quý sau.
- Phí hoa hồng nền tảng, khấu trừ thuế TNCN (nếu áp dụng) [ĐX].
- **GĐ2**: phân chia doanh thu 3 bên: Nền tảng – Đơn vị nhượng quyền – Chuyên gia.

---

### M12 – Thông báo & Nhắn tin (`NOTIFY`)

- Kênh: in-app, email, SMS/**Zalo OA (ZNS)** [ĐX] (phụ huynh Việt Nam dùng Zalo nhiều nhất).
- Sự kiện: đăng ký mới, xác nhận lịch, nhắc lịch (24h & 1h trước), báo cáo đã phát hành, sắp hết gói, thanh toán thành công/thất bại, cảnh báo an toàn (M14 – kênh ưu tiên).
- Nhắn tin trong nền tảng giữa phụ huynh – chuyên gia – cố vấn (lưu lịch sử, không chia sẻ số điện thoại cá nhân nếu chính sách yêu cầu) [ĐX].
- Mẫu thông báo quản lý trong CMS.

---

### M13 – Theo dõi tiến độ & Dashboard (`PROGRESS`)

| Dashboard | Nội dung |
|---|---|
| **Phụ huynh** | Tổng quan các con; mục tiêu; % hoàn thành lộ trình; điểm tầm soát qua các lần (biểu đồ); lịch sắp tới; báo cáo; gói còn lại |
| **Học sinh** | Mục tiêu tương lai (truyền động lực); việc cần làm tuần này; tiến bộ của mình; huy hiệu/streak [ĐX] |
| **Chuyên gia** | Danh sách học sinh được giao; lịch; biên bản cần nhập; báo cáo chờ duyệt; thu nhập |
| **Cố vấn cuộc sống** | Như chuyên gia, cộng thêm: học sinh lệch lộ trình, học sinh có cờ cảnh báo, checkpoint sắp đến |
| **Admin** | Lead, doanh thu, số phiên, tỉ lệ chuyển đổi, tải chuyên gia, chỉ số chất lượng |

---

### M14 – Cảnh báo an toàn tâm lý (`SAFETY`) – **BẮT BUỘC TRONG MVP**

[YC – gốc] "Kịp thời phát hiện… những khủng hoảng gì về mặt tâm lý… để hỗ trợ con vượt qua."
Vì nền tảng làm việc với **trẻ vị thành niên** và có thu thập thông tin tinh thần, phân hệ này là điều kiện an toàn, không phải tính năng phụ.

**Nguyên lý**
1. **Phát hiện**: một số câu trả lời trong B3 được đánh dấu "câu kích hoạt" (ví dụ dấu hiệu tự hại, bị bạo lực, bị xâm hại, bỏ ăn kéo dài). Ngoài ra AI quét ghi chú phiên/tin nhắn để **gắn cờ nghi vấn** (không tự kết luận).
2. **Phân cấp**: `LOW` (theo dõi) / `MEDIUM` (cố vấn liên hệ trong 24h) / `HIGH` (nguy hiểm tức thời: thông báo ngay cố vấn + quản lý chuyên môn, hướng dẫn liên hệ phụ huynh và đường dây hỗ trợ khẩn cấp, ví dụ Tổng đài quốc gia bảo vệ trẻ em **111**).
3. **Con người xử lý**: AI **không** tự trả lời, tư vấn học sinh trong tình huống khủng hoảng. Mọi cờ đều cần người xác nhận và ghi nhận cách xử lý.
4. **Nhật ký sự vụ** (incident log) truy vết đầy đủ, chỉ nhóm chuyên môn được phân quyền xem.
5. Có **quy trình xử lý (SOP)** do đội chuyên môn tâm lý soạn; lập trình viên hiện thực hóa thành workflow.

---

### M15 – Quản trị hệ thống, CMS & Báo cáo vận hành (`ADMIN`)

- Quản lý người dùng, vai trò, khóa/mở tài khoản.
- Quản lý danh mục: môn, lớp, khối thi (A00, A01, B00, C00, D01…), trường ĐH/CĐ và ngành, **điểm chuẩn tham khảo** theo năm, danh mục nghề nghiệp (mô tả, khung năng lực, mức thu nhập tham khảo), tỉnh/xã.
- Quản lý gói, giá, mã giảm giá, chính sách hủy/hoàn.
- CMS: landing page, bài viết, mẫu báo cáo, mẫu thông báo.
- Cấu hình AI: prompt mẫu, ngưỡng, bật/tắt tính năng AI theo phân hệ (xem Mục 6).
- Nhật ký hệ thống (audit log) mọi thao tác trên dữ liệu học sinh.
- Báo cáo vận hành: doanh thu theo gói/chuyên gia/khu vực, phễu chuyển đổi, NPS, tỉ lệ gia hạn.

---

### M16 – Nhượng quyền / Đa đơn vị (`TENANT`) – [GĐ2, kiến trúc sẵn từ MVP]

Nguồn: cuộc gọi 02, mô hình OYLG "dòng tiền đến từ nhượng quyền", nhân bản mô hình cho các tỉnh/xã/đối tác.

- **Từ MVP**: mọi bảng dữ liệu nghiệp vụ có cột `tenant_id`; MVP chỉ có 1 tenant (OYLG gốc).
- GĐ2: mỗi đơn vị nhượng quyền có: thương hiệu phụ (logo trên báo cáo), chuyên gia riêng, học sinh riêng, bảng giá riêng (trong khung trần/sàn do OYLG đặt), báo cáo doanh thu và phí nhượng quyền.
- **Ngân hàng câu hỏi & thuật toán dùng chung** do OYLG sở hữu (tài sản cốt lõi); tenant không xem/xuất được toàn bộ ngân hàng câu hỏi.
- Chuẩn chất lượng: OYLG xem được chỉ số chất lượng của từng tenant.

### M17 – Chiến dịch tầm soát tại trường (`CAMPAIGN`) – [GĐ2]

Nguồn: cuộc gọi 02, mang "bộ tầm soát" đến trường, thu dữ liệu, tặng kết quả, chuyển đổi thành khách hàng.
- Tạo chiến dịch theo trường/lớp, sinh link/QR cho học sinh làm bài tầm soát rút gọn.
- Kết quả rút gọn gửi phụ huynh (có đồng ý), kèm lời mời tư vấn chi tiết, tạo lead tự động vào M03.
- Báo cáo tổng hợp **ẩn danh** cho nhà trường (lớp nào yếu phần nào).

---

### M18 – Bán hàng (online & offline) & Hoa hồng 2 cấp (`SALES`)

Nguồn: yêu cầu bổ sung của chủ dự án. Hai kênh bán, cùng đổ về **một đơn hàng chung (M10)** và **một cách tính hoa hồng chung**.

#### 18.1. Kênh ONLINE [YC] – Đăng ký → Thanh toán → Xác nhận → Cấp user
```
[Landing page / trang gói / link giới thiệu của CTV (…?ref=MÃ_CTV)]
        ▼
[1] Chọn gói (M10) ──► [2] Điền form: phụ huynh, học sinh, đồng ý xử lý dữ liệu (M02)
        ▼
[3] Thanh toán qua cổng (VNPay / MoMo / PayOS QR)      ← đơn ở trạng thái PENDING, hết hạn sau 24h
        ▼  (webhook cổng thanh toán báo thành công)
[4] XÁC NHẬN tự động: đơn → PAID, gửi biên nhận điện tử
        ▼
[5] CẤP USER tự động: tạo tài khoản phụ huynh + hồ sơ học sinh (nếu chưa có),
    gửi thông tin đăng nhập qua Zalo ZNS/SMS/email, bắt buộc đổi mật khẩu lần đầu
        ▼
[6] Bàn giao: tạo việc cho M03 (phân công chuyên gia, xếp lịch) + giao CSKH phụ trách (M19)
    + ghi nhận người bán & tạo hoa hồng (18.5)
```
- **Ghi nhận CTV trên kênh online**: link `?ref=` lưu cookie 30 ngày [ĐX], hoặc khách tự nhập **mã giới thiệu** ở form. Mã nhập tay được ưu tiên hơn cookie.
- **Đơn bỏ dở** (điền form nhưng chưa thanh toán): sau 1 giờ tự tạo lead nhắc cho CTV giới thiệu (nếu có) hoặc cho nhóm bán hàng gọi lại [ĐX].
- Khách đã có tài khoản thì đăng nhập rồi mua thêm, không tạo tài khoản trùng (đối chiếu theo số điện thoại).

#### 18.2. Kênh OFFLINE [YC] – Văn phòng & Hội thảo
**a) Tại văn phòng**
1. `OFFICE_STAFF` hoặc CTV mở **màn hình bán hàng tại quầy** (chế độ POS trên máy tính/máy tính bảng).
2. Tìm khách theo số điện thoại (có rồi thì dùng lại), hoặc nhập mới thông tin phụ huynh – học sinh.
3. Chọn gói, áp ưu đãi (trong hạn mức được phép), chọn **người tư vấn** (CTV) để ghi nhận hoa hồng.
4. Phụ huynh ký đồng ý xử lý dữ liệu ngay trên máy tính bảng (hoặc ký giấy rồi chụp tải lên).
5. Thanh toán bằng một trong ba cách:
   - **QR chuyển khoản theo mã đơn**: hệ thống tự xác nhận khi tiền về (khuyến nghị).
   - **Quẹt thẻ (POS)**: nhân viên nhập mã giao dịch, kế toán đối soát.
   - **Tiền mặt**: in **phiếu thu** có mã đơn, cuối ngày **chốt quỹ**, kế toán xác nhận thì đơn mới chuyển `PAID`.
6. Đơn `PAID` thì cấp user tự động như kênh online (bước [5]–[6]).

**b) Tại hội thảo / sự kiện**
- Tạo **Sự kiện** (tên, địa điểm, thời gian, sức chứa, chi phí, ưu đãi riêng của sự kiện).
- **Đăng ký trước** qua link sự kiện. Mỗi CTV có link mời riêng nên biết ai mời ai.
- **Check-in bằng QR** tại cửa (hoặc tìm theo số điện thoại). Khách vãng lai được đăng ký nhanh tại chỗ.
- **Bán tại chỗ** bằng màn hình POS như ở văn phòng, đơn gắn `event_id`. Ưu đãi sự kiện tự hết hạn sau sự kiện (hoặc sau X ngày).
- Người tham dự chưa mua thì tự chuyển thành lead để CTV đã mời chăm sóc tiếp.
- **Báo cáo sự kiện**: số đăng ký, số đến, số mua, doanh thu, chi phí, hoa hồng, ROI, xếp hạng CTV trong sự kiện.

**Nguyên tắc dòng tiền (bắt buộc)** [ĐX]
- **CTV và Leader không thu tiền cá nhân.** Mọi khoản thanh toán vào **tài khoản công ty**, nội dung chuyển khoản có mã đơn.
- Tiền mặt chỉ do người được phân quyền thu, có phiếu thu, chốt quỹ hằng ngày.
- Đơn chưa xác nhận tiền thì không cấp dịch vụ và không phát sinh hoa hồng.

#### 18.3. Tổ chức đội bán hàng 2 cấp
```
Công ty
 └── Leader A  (SALES_LEADER, mã: LDA01)
      ├── CTV A1 (SALES_AGENT, mã: A1xx)
      ├── CTV A2
      └── …
 └── Leader B
      └── …
```
- **Gia nhập CTV**: đăng ký → ký **hợp đồng cộng tác viên** (điện tử) → khai CCCD, mã số thuế cá nhân, tài khoản ngân hàng → học **đào tạo sản phẩm & quy tắc tư vấn** (bắt buộc hoàn thành) → được kích hoạt, cấp **mã/link giới thiệu**.
- Mỗi CTV thuộc **đúng 1 Leader** tại một thời điểm. Admin có thể chuyển CTV sang Leader khác; hoa hồng Leader tính theo Leader **tại thời điểm đơn được thanh toán**.
- Leader xem được khách, đơn, doanh số và hoa hồng của **nhóm mình**. CTV chỉ xem của **mình**.

#### 18.4. Quy tắc ghi nhận người bán (attribution)
1. Mỗi đơn có **tối đa 1 CTV trực tiếp**.
2. Thứ tự ưu tiên: mã giới thiệu nhập tay → người tư vấn chọn ở đơn offline → cookie link `ref` → không có (khách tự đến).
3. **Khóa chủ khách hàng** [ĐX]: khi một CTV đã ghi nhận khách (đăng ký lead/đơn), khách được "giữ" cho CTV đó trong **30 ngày** [YC – chốt v0.9] (cấu hình được). CTV khác không thể ghi nhận đè trong thời gian này.
4. Tranh chấp do Admin xử lý, có ghi lý do và audit log.
5. Khách tự đến không qua CTV thì **không phát sinh hoa hồng**.

#### 18.5. Chính sách hoa hồng [YC – đã chốt v0.3]
| Trường hợp | Người nhận | Tỉ lệ mặc định | Ghi chú |
|---|---|---|---|
| CTV bán | CTV tư vấn trực tiếp | **10%** | Cấp 1 – trực tiếp |
| CTV bán | Leader của CTV đó | **5%** | Cấp 2 – quản lý nhóm |
| **Leader tự bán** | Leader | **15%** | Leader nhận cả 10% trực tiếp và 5% quản lý [YC] |
| Khách tự đến, không qua CTV | — | 0% | Không phát sinh hoa hồng |

**Cơ sở tính hoa hồng (Doanh thu tính hoa hồng – DTHH)** [YC]
> **DTHH = số lớn hơn giữa (a) số tiền phụ huynh đóng ở kỳ đầu tiên và (b) giá trị 6 tháng phí dịch vụ của đơn đó.**

- **(a) Kỳ đóng đầu tiên**: số tiền phụ huynh thực trả ở lần thanh toán đầu của đơn mới (sau giảm giá, chưa gồm VAT nếu có, không tính phí cổng thanh toán).
- **(b) Giá trị 6 tháng** [ĐX – cách quy đổi, cần xác nhận]:
  - Gói tính theo tháng: phí 1 tháng × 6.
  - Gói tính theo buổi (chuyên gia bộ môn): số buổi đăng ký mỗi tuần × đơn giá buổi × 26 tuần.
  - Gói trọn gói một lần (hướng nghiệp, tầm soát): giá trị 6 tháng = giá gói (vì không có kỳ tiếp theo).
  - Gói dài hơn 6 tháng đóng một lần: (a) lớn hơn nên lấy (a).
- **Tính trên toàn bộ học phí** [YC], kể cả gói chuyên gia bộ môn (không trừ phần chia cho chuyên gia).
- **Chỉ tính một lần cho đơn mua mới.** **Đơn gia hạn không tính hoa hồng** [YC].
- **Đơn mua thêm do nhân viên CSKH tư vấn** (ví dụ thêm môn mới cho học sinh đang học) **không tính hoa hồng cho CTV** [YC]. Hệ thống ghi trường `advised_by_role` trên đơn: đơn tạo bởi/ghi nhận cho `CARE_AGENT` thì không phát sinh hoa hồng CTV, kể cả khi khách ban đầu do CTV mang về.
- Đơn mua thêm do **CTV trực tiếp tư vấn** và được ghi nhận đúng quy tắc 18.4: **tính hoa hồng như đơn mới** [YC] (cơ sở tính, tỉ lệ và cách chi dần áp dụng như đơn mới).
- Học sinh thứ hai của cùng gia đình là đơn mới.
- **CTV mua cho con/người nhà mình**: **được tính hoa hồng** như chính sách áp dụng cho các CTV khác [YC].

**Ví dụ**
| Tình huống | (a) Kỳ đầu | (b) 6 tháng | DTHH | CTV 10% | Leader 5% |
|---|---|---|---|---|---|
| Gói cố vấn 4 triệu/tháng, đóng theo tháng, CTV A1 bán | 4.000.000 | 24.000.000 | 24.000.000 | 2.400.000 | 1.200.000 |
| Cùng gói, phụ huynh đóng trước 12 tháng = 45 triệu, CTV A1 bán | 45.000.000 | 24.000.000 | 45.000.000 | 4.500.000 | 2.250.000 |
| Gia sư Toán 2 buổi/tuần × 300.000đ, đóng theo tháng, **Leader A tự bán** | 2.400.000 | 15.600.000 | 15.600.000 | — | Leader nhận 15% = 2.340.000 |
| Tháng thứ 7 phụ huynh gia hạn | — | — | — | 0 | 0 |

**Thời điểm chi hoa hồng – chi dần theo tiền thực thu** [YC – đã chốt v0.4]
Khi DTHH lấy theo giá trị 6 tháng mà phụ huynh mới đóng tháng đầu, nếu chi ngay toàn bộ thì công ty sẽ chi trên số tiền **chưa thu được**. Vì vậy:
- **Tổng hoa hồng được chốt ngay** khi đơn thanh toán kỳ đầu (lưu trong `order_attributions`).
- **Chi theo từng kỳ phụ huynh đóng tiền**: mỗi lần thu tiền của đơn, hệ thống tạo một dòng hoa hồng = tổng hoa hồng × (số tiền kỳ này ÷ DTHH), cho đến khi đủ tổng.
- **Phụ huynh dừng sớm** thì chỉ chi đến kỳ cuối cùng đã thu. Phần còn lại tự hủy, không phải thu hồi.
- **Phụ huynh đóng một lần nhiều tháng** (ví dụ cả năm) thì kỳ đầu đã ≥ DTHH, chi đủ ngay sau thời gian giữ.
- Ví dụ dòng 1 ở bảng trên: mỗi tháng phụ huynh đóng 4 triệu thì CTV nhận 400.000đ, Leader 200.000đ; sau 6 tháng đủ 2,4 triệu và 1,2 triệu. Phụ huynh dừng ở tháng 3 thì CTV nhận tổng 1,2 triệu, Leader 600.000đ.
- Các khoản thu **sau khi đã chi đủ tổng** (tháng 7 trở đi) không phát sinh hoa hồng.

**Các quy tắc khác**
- **Tỉ lệ điều chỉnh được** [YC]: cấu hình trong **Chính sách hoa hồng** có **ngày hiệu lực**; có thể đặt riêng theo nhóm gói, kênh, sự kiện.
- **Chốt tỉ lệ và DTHH tại thời điểm đơn thanh toán kỳ đầu**: đổi chính sách sau đó **không** làm thay đổi hoa hồng của đơn cũ.
- **Thời gian giữ (hold)**: hoa hồng ở trạng thái `PENDING` trong **X ngày** (bằng thời hạn được hoàn tiền theo chính sách, ví dụ 14 ngày), hết hạn mà không hoàn thì chuyển `APPROVED`.
- **Hoàn tiền**: đơn bị hoàn trước khi duyệt thì hủy hoa hồng. Hoa hồng đã chi thì **thu hồi (clawback)**, trừ vào kỳ chi trả sau.
- **Kỳ chi trả**: hằng tháng (ví dụ ngày 05 chi cho tháng trước). Kế toán duyệt bảng kê → chi trả → CTV/Leader xem **sao kê hoa hồng** trong tài khoản.
- **Thuế TNCN**: hệ thống hỗ trợ khấu trừ theo cấu hình. Theo quy định hiện hành thường khấu trừ 10% với khoản chi từ 2 triệu đồng/lần cho cá nhân không ký hợp đồng lao động; **kế toán cần xác nhận cách áp dụng**. Cuối năm xuất chứng từ khấu trừ thuế.
- **Cảnh báo biên lợi nhuận** [ĐX]: vì hoa hồng tính trên toàn bộ học phí, với gói chuyên gia bộ môn tổng hoa hồng có thể lên đến 15% học phí. Ví dụ nếu chuyên gia nhận 70% học phí thì nền tảng giữ 30%, trả hoa hồng 15% thì còn 15% (trong 6 tháng đầu). Hệ thống cần báo cáo **lợi nhuận gộp sau hoa hồng theo từng gói** để ban điều hành theo dõi.

#### 18.5b. Thiết kế hoa hồng 2 cấp đúng pháp luật – vì sao "không thưởng cho việc tuyển người"
**Bối cảnh pháp lý** (cần luật sư xác nhận):
- Ở Việt Nam, **kinh doanh theo phương thức đa cấp** chịu quản lý chặt theo Nghị định 40/2018/NĐ-CP (đã sửa đổi): phải có giấy chứng nhận đăng ký, ký quỹ, và theo hiểu biết của mình chỉ áp dụng cho **hàng hóa**, không áp dụng cho dịch vụ như giáo dục. Hoạt động đa cấp sai quy định có thể bị xử phạt hành chính, nặng có thể bị xử lý hình sự (Điều 217a Bộ luật Hình sự).
- Vì vậy mạng lưới CTV của dự án phải được thiết kế **để không mang đặc điểm của đa cấp**. Đặc điểm nhận diện chính của đa cấp là: **người tham gia kiếm tiền nhờ tuyển thêm người** và nhờ doanh số của nhiều tầng bên dưới, chứ không chỉ nhờ bán cho khách thật.

**"Thưởng cho việc tuyển người" là những kiểu sau – KHÔNG ĐƯỢC LÀM:**
1. Thưởng tiền khi giới thiệu được một CTV mới (ví dụ "giới thiệu 1 CTV nhận 500.000đ").
2. Thu **phí gia nhập**, bán "gói khởi nghiệp", bắt CTV mua khóa học hay mua dịch vụ cho con mình mới được làm CTV hoặc giữ cấp bậc.
3. Hoa hồng, cấp bậc, danh hiệu phụ thuộc vào **số người tuyển được** (ví dụ "tuyển đủ 5 CTV thì lên Leader").
4. Người tuyển nhận % từ doanh số của **nhiều tầng** bên dưới (tầng 3, 4…).
5. CTV tự lập nhánh, tự phong Leader, tự tuyển tầng dưới mà công ty không kiểm soát.
6. Quảng bá cơ hội làm CTV như "kênh làm giàu nhờ xây hệ thống" thay vì bán dịch vụ.

**Cách dự án làm – ĐƯỢC LÀM:**
1. **Mọi đồng hoa hồng đều gắn với một đơn hàng thật của phụ huynh thật.** Không có đơn thì không có tiền, dù tuyển bao nhiêu người.
2. **Cố định đúng 2 cấp**: CTV và Leader. Hệ thống **không cho** tạo cấp thứ 3.
3. **Leader do công ty bổ nhiệm** theo tiêu chí năng lực (kinh nghiệm tư vấn, doanh số cá nhân, kỹ năng đào tạo), **không** theo số người tuyển được. **CTV do công ty xét duyệt và phân vào nhóm**, kể cả khi CTV đó do Leader giới thiệu.
4. 5% của Leader được ghi trong hợp đồng là **thù lao quản lý nhóm**, gắn với **nghĩa vụ cụ thể**: đào tạo, kèm cặp, giám sát chất lượng tư vấn của CTV trong nhóm. Leader không hoàn thành nghĩa vụ thì công ty có quyền điều chỉnh hoặc rút vai trò.
5. **CTV không mất bất kỳ khoản phí nào** để tham gia. Đào tạo CTV miễn phí.
6. **Đơn tự mua** (CTV mua cho con/người nhà mình): được tính hoa hồng như khách khác [YC]. Để giữ đúng tinh thần "không phải đa cấp": **không bao giờ bắt buộc** CTV mua dịch vụ để được tham gia hay giữ vai trò, và hệ thống gắn nhãn đơn tự mua để theo dõi trong báo cáo kiểm soát.
7. Hợp đồng CTV là **hợp đồng cộng tác/đại lý dịch vụ** thông thường, có điều khoản cấm hứa hẹn thu nhập, cấm tuyển người với cam kết lợi nhuận.

**Hệ thống hỗ trợ tuân thủ** [ĐX]: không có trường "người tuyển" ảnh hưởng đến tiền; không có thưởng theo số CTV; giới hạn cứng 2 cấp; mọi bút toán hoa hồng truy được về `order_id` và `payment_id`; báo cáo hoa hồng xuất được cho kiểm toán.

#### 18.6. Quản lý lead & pipeline bán hàng
- Lead đến từ: form online, đơn bỏ dở, hội thảo, CTV tự nhập, giới thiệu, chiến dịch trường (M17).
- Pipeline: `NEW → CONTACTED → CONSULTED (đã tư vấn) → NEGOTIATING → WON (đã thanh toán) / LOST (có lý do)`.
- CTV ghi lịch sử chăm sóc lead (gọi, nhắn, hẹn), đặt lịch nhắc gọi lại.
- **Kịch bản tư vấn chuẩn** và **bảng giá, ưu đãi chính thức** hiển thị trong app CTV. CTV **không được tự đặt giá** hay hứa ngoài chính sách.

#### 18.7. Báo cáo bán hàng
- Doanh số theo **kênh** (online / văn phòng / hội thảo), theo **gói**, theo **CTV**, **nhóm Leader**, **sự kiện**, **khu vực**.
- Phễu chuyển đổi (lead → tư vấn → mua), tỉ lệ chốt theo CTV, giá trị đơn trung bình, thời gian chốt trung bình.
- Bảng xếp hạng CTV/Leader (có thể bật hiển thị trong app để tạo động lực).
- Chi phí hoa hồng / doanh thu theo kỳ.

---

### M19 – Chăm sóc khách hàng (`CARE`)

Mục tiêu: mỗi gia đình được chăm sóc **chủ động, nhất quán, có ghi nhận**, để giữ chân và gia hạn. Phần **cách vận hành** (quy trình, SLA, KPI, định biên) nằm ở **Phụ lục A**. Phần dưới đây là các chức năng hệ thống cần có để vận hành được như vậy.

**Chức năng hệ thống**
1. **Hồ sơ khách hàng 360°** (theo gia đình): thông tin phụ huynh & các con, gói đang dùng, lịch sử đơn và thanh toán, lịch học và chuyên cần, báo cáo đã phát hành (chỉ tiêu đề và trạng thái, không xem nội dung tinh thần), lịch sử liên hệ, ticket, điểm khảo sát, **chỉ số sức khỏe khách hàng**.
2. **Phân công CSKH phụ trách**: mỗi gia đình có **1 nhân viên CSKH phụ trách**, tự động giao khi đơn đầu tiên `PAID` (chia đều hoặc theo khu vực, tải hiện tại). Chuyển giao có ghi chú.
3. **Kịch bản điểm chạm tự động** (touchpoint playbook): hệ thống **tự sinh việc** cho CSKH theo các mốc trong vòng đời (chào mừng, sau phiên đầu, khi báo cáo phát hành, hằng tháng, trước khi hết gói…). Mỗi việc có hạn, kịch bản gợi ý, ô ghi kết quả. Admin cấu hình được (xem Phụ lục A3).
4. **Hộp thư hợp nhất & Ticket**: mọi yêu cầu từ Zalo OA, hotline, chat trong app, email, form đều thành **ticket**. Có phân loại, mức ưu tiên, người xử lý, **hạn SLA** tự tính, cảnh báo sắp trễ/trễ hạn, chuyển cấp (escalate).
5. **Ghi nhận cuộc gọi**: tích hợp tổng đài ảo (ví dụ Stringee) [ĐX] để gọi từ hệ thống, tự lưu lịch sử và ghi âm (có thông báo cho khách). Giai đoạn đầu có thể ghi tay.
6. **Khảo sát**: **CSAT** tự gửi sau mỗi phiên (1 câu, 1–5 sao); **NPS** hằng quý; khảo sát khi khách không gia hạn (lý do).
7. **Chỉ số sức khỏe khách hàng (health score)**: tính tự động hằng ngày từ chuyên cần, CSAT gần nhất, tiến độ lộ trình, mức phản hồi của phụ huynh, ticket khiếu nại đang mở, tình trạng thanh toán. Xếp **Xanh / Vàng / Đỏ**; chuyển sang Đỏ thì tạo việc ưu tiên cho CSKH.
8. **Gia hạn**: danh sách gói sắp hết hạn (21 ngày, 7 ngày), đề xuất gói tiếp theo dựa trên lộ trình, tạo đơn gia hạn ngay trên hồ sơ khách.
9. **Khiếu nại, đổi chuyên gia & hoàn tiền**: quy trình có phê duyệt theo **hạn mức thẩm quyền** (xem Phụ lục A6). Hoàn tiền liên thông M10 (hoàn tiền) và M18 (thu hồi hoa hồng).
10. **Thư viện kịch bản & mẫu tin nhắn**, **câu hỏi thường gặp (FAQ)** dùng chung cho CSKH và hiển thị cho khách trên web.
11. **Dashboard CSKH**: việc hôm nay, ticket theo SLA, khách Đỏ, gói sắp hết hạn, CSAT/NPS, tỉ lệ gia hạn theo nhân viên.

#### 19.1. Trợ lý AI CSKH 24/7 [YC – chốt v0.9]
CSKH vận hành **24/7 bằng AI**, có **người quản lý hệ thống AI**; nhân viên xử lý các việc AI chuyển sang **trong giờ làm việc**.

**AI làm được**
- Trả lời trên **Zalo OA** (cần lập), chat trên web/app, và (sau này) hotline tổng đài tự động.
- Chỉ trả lời bằng **kho câu trả lời đã duyệt** [YC – không để AI gửi nội dung chưa duyệt]: FAQ, chính sách, bảng giá, hướng dẫn sử dụng; và **dữ liệu của chính khách đó** (lịch học, số buổi còn lại, trạng thái thanh toán, link Zoom buổi tới) lấy từ hệ thống.
- Thao tác tự phục vụ: xem/dời lịch (theo quy tắc 2 lần/tháng), đổi hình thức học (gửi yêu cầu cho bên kia xác nhận), gửi lại link thanh toán, gửi lại link Zoom, đăng ký tư vấn.
- Ghi nhận mọi yêu cầu thành **ticket**, gắn đúng phân loại.

**AI không làm – chuyển người**
- Khiếu nại, yêu cầu hoàn tiền (mọi hoàn tiền do **Ban giám đốc** duyệt), đổi chuyên gia, câu hỏi chuyên môn, mọi câu không có trong kho đã duyệt.
- Ngoài giờ làm việc: AI xác nhận đã nhận và **hẹn thời điểm phản hồi** (đầu giờ làm việc kế tiếp). Ticket vào hàng đợi, SLA tính theo giờ làm việc.

**Tình huống an toàn học sinh ngoài giờ** [ĐX – bắt buộc tối thiểu]
Theo lựa chọn "chỉ xử lý trong giờ làm việc", hệ thống vẫn phải có các bước tự động sau để không bỏ sót tình huống nguy hiểm:
1. AI nhận diện dấu hiệu nguy hiểm thì **ngay lập tức hiển thị số khẩn cấp** (Tổng đài bảo vệ trẻ em **111**, cấp cứu **115**) và hướng dẫn phụ huynh/học sinh liên hệ người lớn gần nhất.
2. Tạo **cờ an toàn mức Cao (M14)** và gửi **thông báo đẩy + SMS** cho cố vấn phụ trách và người phụ trách tâm lý của dự án (người này tự quyết có xử lý ngoài giờ hay không).
3. Không để AI tự tư vấn tâm lý.

**Quản lý hệ thống AI**
- Người quản lý AI duyệt và cập nhật kho câu trả lời; xem nhật ký hội thoại; đánh dấu câu trả lời sai để sửa kho.
- Báo cáo: số hội thoại, tỉ lệ AI tự giải quyết, tỉ lệ chuyển người, các câu hỏi chưa có trong kho (để bổ sung).

**Quy tắc bảo mật riêng cho CSKH**
- CSKH **không xem** nội dung báo cáo tinh thần (B3) hay biên bản tâm lý. Chỉ thấy "đã có báo cáo/đã có phiên".
- Nếu khách chia sẻ dấu hiệu nguy hiểm với CSKH thì tạo **cờ an toàn (M14)**, không tự xử lý.

---

### M20 – Giám sát lộ trình đào tạo học sinh (`MONITOR`)

Nguồn: yêu cầu bổ sung của chủ dự án [YC]. Sau khi Chuyên gia hướng nghiệp và Cố vấn cuộc sống đã cho ra **lộ trình đồng hành toàn diện** (M07), phân hệ này giúp **thực thi và giám sát** lộ trình đó hằng ngày, hằng tuần cho đến khi học sinh đạt mục tiêu.

> **Phân biệt với M07 và M13**: M07 *lập* lộ trình. M13 *hiển thị* tiến độ. **M20 là bộ máy vận hành**: chia lộ trình thành kế hoạch từng môn, ghi nhận từng buổi học, đo tiến bộ, phát cảnh báo sớm và điều phối giữa cố vấn với các gia sư.

#### 20.1. Mô hình vai trò – "Hồ sơ đồng hành" của mỗi học sinh
Mỗi học sinh có **một Hồ sơ đồng hành** (case), giống như hồ sơ bệnh án có bác sĩ điều trị chính và các bác sĩ chuyên khoa.

| Vai trò trong hồ sơ | Người | Trách nhiệm |
|---|---|---|
| **Chủ hồ sơ** | Cố vấn cuộc sống (1 người) | **Lập kế hoạch và giám sát toàn diện**: lộ trình tổng, cân bằng việc học với sức khỏe tinh thần và thể chất, duyệt kế hoạch môn, theo dõi cảnh báo, điều chỉnh lộ trình, báo cáo phụ huynh [YC] |
| **Thành viên chuyên môn** | Gia sư từng môn (mỗi môn 1 người) | **Bám sát tình trạng hiện tại** của học sinh ở môn mình; thực hiện **lộ trình bổ trợ lấy lại kiến thức** và **nâng cao**; ghi nhận sau mỗi buổi [YC] |
| Tham vấn | Chuyên gia hướng nghiệp | Xem tiến độ so với mục tiêu nghề/trường; tham gia khi cần đánh giá lại mục tiêu |
| Quan sát | Phụ huynh | Xem tiến độ, báo cáo, nhận cảnh báo cần phối hợp |
| Thực hiện | Học sinh | Xem việc cần làm, nộp bài tập, tự đánh giá |

#### 20.2. Cấu trúc kế hoạch 3 tầng
```
TẦNG 1 – LỘ TRÌNH TỔNG (Cố vấn cuộc sống làm chủ – từ M07)
  Mục tiêu: trường/ngành, mốc thời gian, các giai đoạn, KPI từng giai đoạn
  Các mảng: Kiến thức | Thể chất | Kỹ năng sống | Tinh thần
        │
        ▼  cố vấn giao từng môn cho gia sư
TẦNG 2 – KẾ HOẠCH MÔN (Gia sư lập → Cố vấn duyệt)
  Môn Toán – Gia sư X
   ├── Luồng BỔ TRỢ (lấy lại kiến thức): danh sách YCCĐ bị hổng, xếp thứ tự theo
   │      quan hệ tiên quyết, ước lượng số buổi cho mỗi cụm
   ├── Luồng THEO CHƯƠNG TRÌNH HIỆN TẠI: bám bài đang học trên lớp, không để hổng mới
   ├── Luồng NÂNG CAO: luyện dạng bài thi, đề thi thử (khi nền đã vững)
   └── Tỉ lệ phân bổ thời gian giữa 3 luồng (ví dụ 60/30/10, thay đổi theo giai đoạn)
        │
        ▼  gia sư chia theo tuần
TẦNG 3 – KẾ HOẠCH TUẦN & BUỔI HỌC (Gia sư)
  Tuần 5: Buổi 1 – YCCĐ TOAN.08.HDT.02 (bổ trợ) + bài 3 SGK lớp 10 (hiện tại)
          Buổi 2 – …
  Bài tập về nhà, bài kiểm tra nhanh cuối chủ đề
```
- Kế hoạch môn **phải liên kết với YCCĐ** (M04) để hệ thống tự đo tiến độ lấp lỗ hổng.
- AI gợi ý nháp kế hoạch môn và nội dung buổi tiếp theo từ bản đồ lỗ hổng [ĐX]; gia sư quyết định.

#### 20.3. Ghi nhận sau mỗi buổi học (biên bản có cấu trúc)
Gia sư điền trong **24 giờ** sau buổi (thay cho ghi chú tự do ở M09), mất khoảng 3 phút trên điện thoại:

| Trường | Kiểu | Mục đích |
|---|---|---|
| Nội dung đã dạy | Chọn YCCĐ + luồng (bổ trợ / hiện tại / nâng cao) | Đo tiến độ kế hoạch |
| Mức nắm bài theo từng YCCĐ | Chưa hiểu / Hiểu một phần / Nắm vững | Cập nhật bản đồ kiến thức |
| Chuyên cần | Đúng giờ / Muộn / Vắng (có phép, không phép) | Cảnh báo chuyên cần |
| Thái độ, mức tập trung | Thang 1–5 | Tín hiệu sớm về động lực |
| Tâm trạng quan sát được | Bình thường / Mệt / Căng thẳng / Buồn bất thường | Tín hiệu cho cố vấn (và M14 nếu nghiêm trọng) |
| Bài tập về nhà | Nội dung, hạn nộp | Theo dõi tự học |
| Kết quả bài tập lần trước | Đã nộp? Điểm | Theo dõi tự học |
| Ghi chú cho cố vấn | Văn bản (chỉ nội bộ) | Phối hợp |
| Ghi chú cho phụ huynh | Văn bản (tùy chọn) | Minh bạch |

#### 20.4. Đo tiến bộ – 4 nguồn dữ liệu
> **Nguyên tắc [YC]**: **mọi bài kiểm tra và bài thi** do gia sư và cố vấn giao đều **thực hiện và ghi nhận trên nền tảng** (chi tiết ở 20.11). Không có kết quả "ngoài sổ".

1. **Kiểm tra nhanh cuối chủ đề (exit check)**: 3–5 câu từ ngân hàng câu hỏi theo YCCĐ vừa học, học sinh làm trên app. Kết quả **cập nhật trực tiếp mức thành thạo** (`mastery_states`).
2. **Biên bản buổi học** (20.3): đánh giá của gia sư.
3. **Tầm soát lại định kỳ (checkpoint)** mỗi 4–6 tuần (M05): đo khách quan, so sánh với lần trước.
4. **Kết quả trên lớp**: phụ huynh/học sinh nhập điểm kiểm tra ở trường (kèm ảnh bài) [ĐX], để đối chiếu tiến bộ trên nền tảng với kết quả thật.

**Bản đồ kiến thức theo thời gian**: bản đồ nhiệt môn × lớp × chủ đề có thanh trượt thời gian, thấy rõ ô "đỏ" chuyển dần sang "xanh". Đây là bằng chứng giá trị mạnh nhất cho phụ huynh.

#### 20.5. Chỉ số giám sát & cảnh báo sớm
**Chỉ số theo học sinh** (tính tự động hằng ngày)
| Chỉ số | Cách tính |
|---|---|
| Tiến độ kế hoạch môn | % hạng mục đã xong so với kế hoạch đến thời điểm hiện tại |
| Tốc độ lấp lỗ hổng | Số YCCĐ chuyển sang "Nắm vững" mỗi tuần |
| Dự báo kịp mục tiêu | Với tốc độ hiện tại, có lấp xong trước mốc thi không |
| Chuyên cần | % buổi có mặt trong 4 tuần gần nhất |
| Tự học | % bài tập nộp đúng hạn |
| Tải học tập | Tổng giờ học thêm/tuần (tất cả các môn) |
| Tâm trạng & tập trung | Xu hướng từ biên bản các buổi |

**Quy tắc cảnh báo** (ngưỡng cấu hình được) [ĐX]
| Cảnh báo | Điều kiện | Gửi cho | Mức |
|---|---|---|---|
| Chậm tiến độ | Kế hoạch môn chậm > 2 tuần | Gia sư + Cố vấn | Vàng |
| Không kịp mục tiêu | Dự báo không lấp xong trước mốc thi | Cố vấn | Đỏ |
| Bế tắc kiến thức | Cùng một YCCĐ kiểm tra không đạt 2 lần liên tiếp | Gia sư + Cố vấn | Vàng |
| Vắng học | Vắng 2 buổi liên tiếp, hoặc chuyên cần < 80% | Cố vấn + CSKH | Vàng |
| Bỏ bài tập | Không nộp 3 bài liên tiếp | Gia sư + Cố vấn | Vàng |
| Quá tải | Tổng giờ học thêm/tuần vượt ngưỡng cố vấn đặt | Cố vấn | Vàng |
| Tâm trạng xấu kéo dài | 3 buổi liên tiếp ghi "căng thẳng/buồn bất thường" | Cố vấn (→ M14 nếu nghiêm trọng) | Đỏ |
| Điểm trên lớp giảm | Điểm kiểm tra ở trường giảm mạnh so với kỳ trước | Cố vấn | Vàng |
| Gia sư trễ biên bản | Quá 24h chưa nhập biên bản | Gia sư; quá 72h báo cố vấn | Nhắc |

Mỗi cảnh báo phải được **xác nhận và ghi cách xử lý** (không chỉ "đã xem"). Cảnh báo Đỏ chưa xử lý sau 48h thì báo trưởng chuyên môn.

#### 20.6. Bảng điều khiển
**Cố vấn cuộc sống – "tháp điều khiển"**
- Danh sách học sinh mình phụ trách với **đèn trạng thái** (Xanh/Vàng/Đỏ) tổng hợp từ các chỉ số trên.
- Hộp cảnh báo cần xử lý, sắp xếp theo mức độ.
- Chi tiết một học sinh: dòng thời gian (buổi học, biên bản, bài kiểm tra, cảnh báo), bản đồ kiến thức theo thời gian, kế hoạch từng môn và tiến độ, nhận xét của các gia sư, tải học tập theo tuần, xu hướng tâm trạng.
- Lịch tổng của học sinh: lịch học trên trường + các buổi học thêm + rèn luyện thể chất, để **cân bằng tải**.

**Gia sư – "bàn làm việc"**
- Học sinh của mình, buổi học sắp tới, biên bản cần nhập.
- Kế hoạch môn và vị trí hiện tại trên kế hoạch.
- **Gợi ý nội dung buổi tới** dựa trên lỗ hổng còn lại và kết quả kiểm tra gần nhất [ĐX].
- Ngân hàng bài tập và bài kiểm tra nhanh theo YCCĐ.

**Phụ huynh** (qua M13): tiến độ tóm tắt, bản đồ kiến thức trước/sau, nhận xét gia sư (phần được chia sẻ), cảnh báo cần phụ huynh phối hợp (ví dụ con vắng học, bỏ bài tập).

#### 20.7. Phối hợp giữa Cố vấn và Gia sư
- **Kênh trao đổi nội bộ theo từng học sinh**: luồng tin nhắn riêng giữa cố vấn và các gia sư của học sinh đó. Phụ huynh và học sinh không thấy.
- **Họp rà soát hồ sơ (case review)** mỗi 2 tuần [ĐX]: cố vấn rà từng học sinh với các gia sư (có thể làm không đồng bộ: gia sư điền mẫu nhận xét 2 tuần, cố vấn tổng hợp). Hệ thống tạo lịch, mẫu nhận xét và lưu kết luận.
- **Yêu cầu điều chỉnh kế hoạch**: gia sư đề xuất (đổi thứ tự, thêm buổi, đổi tỉ lệ luồng) → cố vấn duyệt → nếu thay đổi lịch, số buổi hoặc chi phí thì **phụ huynh xác nhận** (liên thông M10 nếu phát sinh phí).
- **Đổi gia sư**: cố vấn đề xuất, có ghi lý do; dữ liệu kế hoạch và biên bản được chuyển cho gia sư mới để không đứt mạch.

#### 20.8. Báo cáo tiến độ cho phụ huynh
- **Hằng tháng**: AI soạn nháp từ biên bản, kết quả kiểm tra và chỉ số (M06 – R4), **cố vấn duyệt** rồi gửi. Nội dung: đã làm được gì, tiến bộ ở đâu, còn vướng gì, tháng tới tập trung gì, phụ huynh cần phối hợp gì.
- **Sau mỗi checkpoint**: báo cáo so sánh trước/sau và điều chỉnh lộ trình (nếu có).
- CSKH (M19) dùng báo cáo này cho cuộc gọi hằng tháng.

#### 20.9. Đánh giá chất lượng gia sư (đưa ngược về M08)
- **Hiệu quả**: tốc độ lấp lỗ hổng và mức cải thiện tầm soát của học sinh do mình dạy (có tính đến xuất phát điểm).
- **Kỷ luật**: tỉ lệ biên bản đúng hạn, đúng giờ, ít hủy buổi.
- **Hài lòng**: CSAT của phụ huynh và học sinh.
- Kết quả dùng cho xếp hạng trên marketplace, thưởng, đào tạo lại hoặc tạm dừng hợp tác.

#### 20.10. Nhịp vận hành chuẩn
| Chu kỳ | Việc | Người |
|---|---|---|
| Sau mỗi buổi | Biên bản trong 24h; học sinh làm bài kiểm tra nhanh (nếu hết chủ đề) | Gia sư, học sinh |
| Hằng tuần | Rà đèn trạng thái và cảnh báo của toàn bộ học sinh | Cố vấn |
| 2 tuần | Họp rà soát hồ sơ với gia sư | Cố vấn + gia sư |
| 4–6 tuần | Tầm soát lại (checkpoint), điều chỉnh lộ trình | Cố vấn |
| Hằng tháng | Báo cáo tiến độ cho phụ huynh; cuộc gọi CSKH | Cố vấn, CSKH |
| Mỗi học kỳ | Đánh giá lại mục tiêu (nếu cần, mời chuyên gia hướng nghiệp) | Cố vấn + chuyên gia hướng nghiệp |

#### 20.11. Kiểm tra & thi trên nền tảng [YC]
**Các loại bài**
| Loại | Ai giao | Khi nào | Mục đích |
|---|---|---|---|
| Kiểm tra đầu buổi (khởi động) | Gia sư | Đầu buổi, 5 phút | Xem bài cũ còn nhớ không |
| Kiểm tra nhanh cuối chủ đề | Gia sư | Hết mỗi cụm YCCĐ | Xác nhận đã lấp xong lỗ hổng |
| Bài tập về nhà | Gia sư | Sau mỗi buổi | Rèn tự học, đo mức tự làm |
| Kiểm tra định kỳ (tuần/tháng) | Gia sư | Theo kế hoạch môn | Đo tiến độ môn |
| Tầm soát lại (checkpoint) | Cố vấn | 4–6 tuần | Đo khách quan, điều chỉnh lộ trình |
| Thi thử | Cố vấn (phối hợp gia sư) | Theo mốc lộ trình | Đo sát kỳ thi mục tiêu (vào 10, tốt nghiệp THPT, đánh giá năng lực…) |

**Tạo đề**
- Chọn câu từ **ngân hàng câu hỏi** (M04) theo YCCĐ, mức độ, số câu; hoặc để hệ thống **tự ráp đề theo ma trận** (tỉ lệ YCCĐ × mức độ), đề thi thử theo **cấu trúc kỳ thi mục tiêu**.
- Gia sư được soạn câu riêng nhưng **mỗi câu bắt buộc gắn YCCĐ**. Câu riêng chỉ dùng cho học sinh của gia sư đó; biên tập viên duyệt thì mới đưa vào ngân hàng chung.

**Cách làm bài và chấm**
| Hình thức | Cách ghi nhận |
|---|---|
| Làm trực tuyến trên app/web | Tính giờ, tự chấm câu trắc nghiệm ngay khi nộp |
| Tự luận | Học sinh gõ hoặc **chụp/tải ảnh bài làm**; gia sư **chấm trên nền tảng theo thang chấm (rubric) từng câu** trong 48h |
| Làm trên giấy tại buổi học trực tiếp | Gia sư **nhập kết quả từng câu** bằng bảng nhập nhanh (đúng/sai/điểm), đính kèm ảnh bài |

**Bắt buộc**: kết quả phải ghi **theo từng câu và từng YCCĐ**, không chỉ tổng điểm. Đây là điều kiện để hệ thống cập nhật lộ trình và cảnh báo đúng chỗ.

**Chống gian lận cơ bản** [ĐX]: giới hạn thời gian, xáo trộn thứ tự câu và đáp án, ghi nhận số lần rời màn hình bài thi; thi thử quan trọng làm tại văn phòng hoặc trực tuyến có bật camera.

**Chuỗi xử lý tự động sau mỗi bài**
```
Học sinh nộp bài / gia sư nhập kết quả
   ▼
[1] Chấm: tự động (trắc nghiệm) hoặc chờ gia sư chấm (tự luận, hạn 48h)
   ▼
[2] Cập nhật mức thành thạo từng YCCĐ (mastery_states)
   ▼
[3] Cập nhật KẾ HOẠCH MÔN: hạng mục đạt → hoàn thành; chưa đạt → tự thêm buổi ôn;
    sai ở phần cần kiến thức nền → đẩy YCCĐ tiên quyết vào luồng bổ trợ
   ▼
[4] Cập nhật LỘ TRÌNH TỔNG: tiến độ giai đoạn, KPI, dự báo kịp mục tiêu
   ▼
[5] Chạy quy tắc CẢNH BÁO (20.5) → [6] Sinh GỢI Ý GIẢI PHÁP (20.13)
   ▼
[7] Gửi thông báo cho từng vai trò ĐÚNG PHÂN QUYỀN (20.12)
   ▼
[8] Lưu lịch sử bất biến: kết quả đã chốt không xóa; sửa điểm phải ghi lý do, có audit log
```
- Thay đổi tự động ở bước [3] được ghi là **"đề xuất tự động"**. Thay đổi nhỏ (thêm 1 buổi ôn trong kế hoạch) tự áp dụng. Thay đổi lớn (đổi tỉ lệ luồng, thêm buổi ngoài gói) tạo **yêu cầu điều chỉnh** chờ cố vấn duyệt (20.7).
- Học sinh xem kết quả và **lời giải từng câu** ngay sau khi chấm xong (cấu hình được: đề thi thử có thể ẩn lời giải đến khi cả nhóm làm xong).

#### 20.12. Cảnh báo đến từng vai trò theo đúng phân quyền [YC]
**Nguyên tắc**
1. **Mỗi vai trò chỉ nhận đúng phần việc của mình**:
   - **Học sinh**: giọng động viên, hướng vào việc cần làm tiếp; không so sánh với bạn khác, không dùng từ gây áp lực.
   - **Phụ huynh**: tóm tắt dễ hiểu và **việc phụ huynh cần phối hợp**; không nhận chi tiết chuyên môn rườm rà, không nhận nội dung tâm lý (trừ khi cố vấn quyết định chia sẻ).
   - **Gia sư**: chỉ **môn mình**, chi tiết đến từng câu và YCCĐ.
   - **Cố vấn**: **toàn cảnh tất cả các môn** và các mặt tinh thần, thể chất, tải học.
2. **Cảnh báo nghiêm trọng gửi phụ huynh phải qua cố vấn duyệt** [ĐX]: ví dụ "dự báo không kịp mục tiêu", "kết quả thi thử thấp". Hệ thống tạo nháp, cố vấn xem và kèm phương án rồi mới gửi. Tránh phụ huynh hoảng hoặc trách mắng con khi chưa có giải pháp.
3. **Chống làm phiền**: học sinh và phụ huynh nhận **tối đa 1 tin tổng hợp/ngày** (trừ cảnh báo Đỏ); tin vui và tiến bộ được gộp vào **bản tin tuần**.
4. **Kênh**: thông báo trong app + Zalo ZNS; Đỏ thêm cuộc gọi từ cố vấn hoặc CSKH.

**Ma trận cảnh báo theo vai trò**
| Sự kiện | Học sinh | Phụ huynh | Gia sư (môn đó) | Cố vấn |
|---|---|---|---|---|
| Có kết quả bài kiểm tra | Điểm, câu sai, lời giải, bài luyện thêm | Điểm tóm tắt trong bản tin tuần | Chi tiết từng câu, YCCĐ | Trong bảng điều khiển |
| Điểm thấp dưới ngưỡng / giảm mạnh | Lời động viên + bài ôn cụ thể | Thông báo + gợi ý cách hỗ trợ con ở nhà | Cảnh báo + gợi ý nội dung buổi tới | Cảnh báo Vàng |
| Kẹt ở một phần kiến thức (sai cùng YCCĐ 2 lần) | Chỉ thấy bài ôn mới | — | Cảnh báo + gợi ý đổi cách dạy / lùi về kiến thức nền | Cảnh báo Vàng |
| Không làm / quá hạn bài | Nhắc ngay | Báo từ lần thứ 2 | Thông báo | Báo từ lần thứ 3 |
| Thi thử dưới điểm mục tiêu | Kết quả + kế hoạch cải thiện (sau khi cố vấn duyệt) | Thông báo **kèm phương án**, qua cố vấn duyệt | Phân tích phần mất điểm môn mình | Cảnh báo Đỏ + nháp phương án |
| Dự báo không kịp mục tiêu | — | Qua cố vấn, kèm phương án | Thông báo phần môn mình | Cảnh báo Đỏ |
| Quá tải giờ học | Gợi ý nghỉ ngơi hợp lý | Thông báo nếu cần điều chỉnh lịch | — | Cảnh báo Vàng |
| Tiến bộ tốt / đạt mốc | Lời khen + huy hiệu | Tin vui trong bản tin tuần | Thông báo | Ghi nhận |
| Dấu hiệu tâm lý bất thường | — | Theo quyết định của cố vấn | — | Chỉ cố vấn + quy trình M14 |

#### 20.13. Gợi ý giải pháp & khuyến cáo dự phòng rủi ro [YC]
**Cách hệ thống đưa ra gợi ý**
- Đội chuyên môn xây **thư viện giải pháp** (playbook): mỗi loại rủi ro có danh sách giải pháp khuyến cáo **cho từng vai trò**.
- Khi có cảnh báo, AI **chọn và cá nhân hóa** giải pháp dựa trên dữ liệu học sinh (môn, YCCĐ, lịch, xu hướng) và **chỉ dựa trên 2 nguồn** [YC]:
  1. **Thư viện giải pháp** do đội chuyên môn xây dựng.
  2. **Kho tài liệu tham chiếu chính thống, uy tín, đáng tin cậy** đã được đội chuyên môn duyệt đưa vào hệ thống. Ví dụ: văn bản và tài liệu của Bộ GD&ĐT (chương trình GDPT 2018, hướng dẫn tư vấn tâm lý học đường), SGK hiện hành, tài liệu của các tổ chức như UNICEF, WHO về sức khỏe tinh thần vị thành niên, nghiên cứu khoa học giáo dục đã được bình duyệt, giáo trình của trường đại học sư phạm.
- **Quy tắc vận hành kho tài liệu** [ĐX]:
  - Mỗi tài liệu có: nguồn, tác giả/cơ quan ban hành, năm, người duyệt, ngày duyệt, ngày rà soát lại. Tài liệu hết hiệu lực được gỡ khỏi kho.
  - AI **không lấy thông tin từ internet tự do** khi sinh gợi ý. Chỉ truy xuất trong kho đã duyệt (kỹ thuật RAG, xem 6.4).
  - **Mỗi gợi ý phải ghi rõ nguồn** (giải pháp số mấy trong thư viện, hoặc tài liệu nào, trang/mục nào) để người nhận kiểm chứng được.
  - Gợi ý ghép từ tài liệu tham chiếu mà chưa có trong thư viện được gắn nhãn **"đề xuất mới"**, cố vấn xem trước khi áp dụng. Đề xuất mới hiệu quả được đội chuyên môn đưa vào thư viện.
  - Với **vấn đề tâm lý nghiêm trọng** vẫn chỉ xử lý theo quy trình M14, AI không đưa gợi ý tự động.
- Mỗi gợi ý có nút **Áp dụng** (tạo việc hoặc yêu cầu điều chỉnh kế hoạch) hoặc **Bỏ qua** (bắt buộc ghi lý do).
- **Đo hiệu quả**: sau 2–4 tuần, hệ thống so sánh chỉ số trước/sau để biết giải pháp có hiệu quả không. Dữ liệu này dùng để xếp hạng lại giải pháp trong thư viện.
- **Điểm rủi ro của mỗi học sinh** kết hợp đèn trạng thái hiện tại với **xu hướng** (đang xấu đi hay tốt lên), để phát hiện **trước khi** kết quả tụt hẳn.

**Thư viện rủi ro mẫu** (đội chuyên môn hoàn thiện)
| Rủi ro | Dấu hiệu sớm | Giải pháp khuyến cáo |
|---|---|---|
| Hổng kiến thức gốc | Sai lặp lại cùng YCCĐ; YCCĐ tiên quyết chưa đạt | **Gia sư**: lùi về kiến thức nền, đổi cách giảng (trực quan, ví dụ đời sống), bài luyện ngắn hằng ngày. **Cố vấn**: tạm tăng tỉ lệ luồng bổ trợ |
| Chậm tiến độ, nguy cơ không kịp mục tiêu | Tốc độ lấp lỗ hổng thấp hơn kế hoạch 2 tuần liên tiếp | **Cố vấn**: ưu tiên YCCĐ có trọng số thi cao, đề xuất tăng buổi, chuẩn bị **mục tiêu dự phòng** (trường/ngành phương án B) cùng chuyên gia hướng nghiệp. **Phụ huynh**: trao đổi về thời lượng học |
| Mất động lực | Tập trung giảm, bỏ bài tập, tự đánh giá thấp | **Cố vấn**: buổi trò chuyện về mục tiêu, chia nhỏ mục tiêu, cơ chế khen thưởng. **Học sinh**: thử thách ngắn, huy hiệu. **Phụ huynh**: khen đúng nỗ lực, tránh so sánh |
| Quá tải, kiệt sức | Giờ học cao + tâm trạng "mệt" + điểm giảm | **Cố vấn**: giảm tải, sắp lại lịch, thêm vận động và nghỉ ngơi. **Phụ huynh**: đảm bảo giấc ngủ, hạn chế học thêm ngoài kế hoạch |
| Lo âu thi cử | Điểm thi thử thấp hơn hẳn kiểm tra thường; căng thẳng trước thi | **Cố vấn**: luyện kỹ năng làm bài, thi thử trong điều kiện thật nhiều lần, kỹ thuật thư giãn. **Gia sư**: chiến lược phân bổ thời gian làm bài |
| Lệch với chương trình trên lớp | Tiến bộ trên nền tảng nhưng điểm trên lớp giảm | **Gia sư**: tăng luồng "theo chương trình hiện tại", bám lịch kiểm tra của trường |
| Không hợp gia sư | CSAT thấp; tiến bộ chậm hơn các học sinh tương tự | **Cố vấn**: họp 3 bên (phụ huynh – gia sư – cố vấn), cân nhắc đổi gia sư |
| Nguy cơ bỏ ngang dịch vụ | Vắng nhiều; phụ huynh không phản hồi | **CSKH (M19)**: gọi chăm sóc, xử lý vướng mắc |
| Vấn đề tâm lý nghiêm trọng | Dấu hiệu theo M14 | **Chỉ xử lý theo quy trình M14**, không dùng gợi ý tự động |

---

### M21 – Nội trú & Bán trú (`BOARDING`) [YC – cần ngay]

Nguồn: cuộc gọi 02 (mô hình học và ở tại nhà/trung tâm, học sinh học tầng dưới, ngủ tầng trên) và câu trả lời 40 "cần ngay".

**Hai hình thức**
| Hình thức | Mô tả |
|---|---|
| **Nội trú** | Học sinh ăn, ở, học tại cơ sở; về nhà theo lịch (cuối tuần/ngày lễ) |
| **Bán trú** | Học sinh học và ăn tại cơ sở trong ngày (ví dụ sau giờ học ở trường đến tối), phụ huynh đón về |

**Chức năng bản cơ bản (MVP)**
1. **Cơ sở – phòng – giường**: danh sách cơ sở, phòng ở, giường, phòng học; trạng thái trống/đang ở; nam/nữ.
2. **Hồ sơ lưu trú**: học sinh, hình thức (nội trú/bán trú), phòng/giường, ngày vào – ngày ra dự kiến, **người được phép đón** (tên, quan hệ, số điện thoại, ảnh), lưu ý sức khỏe – dị ứng – thuốc đang dùng, liên hệ khẩn cấp. Hợp đồng lưu trú ký điện tử.
3. **Phí lưu trú & ăn uống**: tiền phòng, tiền ăn, phí giám sát tự học, đóng theo tháng qua M10 (cùng cổng thanh toán, cùng chính sách ưu đãi đóng dài). Khoản phí này **không tính hoa hồng** trừ khi chính sách cấu hình khác [ĐX].
4. **Lịch sinh hoạt chuẩn**: khung giờ học với gia sư (M09), **tự học có giám sát**, ăn, nghỉ, vận động, ngủ. Lịch học với gia sư tại cơ sở tự động lấy hình thức "tại trung tâm".
5. **Điểm danh nhiều mốc**: đến/về (bán trú), điểm danh tối và sáng (nội trú), ra ngoài – trở về có lý do. Điểm danh bằng quét QR thẻ học sinh hoặc danh sách trên máy tính bảng của quản sinh.
6. **Đưa – đón an toàn (bán trú)**: chỉ người trong danh sách được phép đón; quản sinh xác nhận trên app; **phụ huynh nhận thông báo khi con đến và khi con được đón**. Người đón lạ thì chặn và gọi phụ huynh.
7. **Ăn uống**: thực đơn tuần, báo cắt suất ăn trước giờ quy định (tự trừ tiền ăn), ghi chú dị ứng.
8. **Nhật ký sự việc & sức khỏe**: ốm, sốt, chấn thương, vi phạm nội quy, mâu thuẫn; ghi nhận xử lý; sự việc nghiêm trọng thông báo phụ huynh ngay và tạo cờ M14 nếu liên quan an toàn tinh thần.
9. **Quản sinh trực**: lịch trực ca, bàn giao ca có ghi chú, danh sách học sinh trong ca.
10. **Báo cáo cho phụ huynh**: bản tin tuần gộp chung với bản tin học tập (giới hạn tin như nguyên tắc chung): chuyên cần, giờ tự học, ăn uống, sức khỏe, nhận xét của quản sinh.

**Vai trò mới**: `BOARDING_STAFF` (quản sinh) – điểm danh, đưa đón, nhật ký sự việc, ăn uống trong cơ sở mình phụ trách; `BOARDING_MANAGER` (quản lý cơ sở) – phòng, hợp đồng, phí, lịch trực, báo cáo.

**Liên thông**: tải học tập và giờ ngủ từ M21 đưa vào chỉ số "quá tải" của M20; sự việc sức khỏe đưa vào hồ sơ đồng hành để cố vấn theo dõi.

> **Lưu ý pháp lý** [ĐX]: cơ sở có học sinh ở lại qua đêm cần đáp ứng điều kiện về phòng cháy chữa cháy, an ninh trật tự, vệ sinh an toàn thực phẩm và quy định về cơ sở giáo dục/ở trọ có trẻ vị thành niên tại địa phương. Cần xác minh với cơ quan quản lý trước khi nhận học sinh nội trú.

---

## 6. ĐỘNG CƠ AI: NGUYÊN LÝ VẬN HÀNH

### 6.1. Vai trò của AI trong hệ thống
| Điểm dùng AI | AI làm gì | Con người làm gì |
|---|---|---|
| Sản xuất câu hỏi (M04) | Sinh nháp câu hỏi theo YCCĐ/chiều đo | Biên tập viên duyệt |
| Chọn câu hỏi (M05) | Chọn/biến tấu câu tiếp theo | Chuyên gia có thể bỏ qua, chọn câu khác |
| Phân tích (M06) | Diễn giải điểm số, viết nháp báo cáo | Chuyên gia sửa, duyệt |
| Lộ trình (M07) | Đề xuất lộ trình & điều chỉnh | Cố vấn duyệt, phụ huynh xác nhận |
| Gợi ý chuyên gia (M08) | Xếp hạng chuyên gia phù hợp | Phụ huynh chọn |
| An toàn (M14) | Gắn cờ nghi vấn | Cố vấn/chuyên môn xử lý |

### 6.2. Thuật toán tầm soát kiến thức (B2) – đề xuất
**Nguyên tắc: điểm số do thuật toán tính, AI chỉ diễn giải.**

```
Đầu vào: học sinh, môn M, lớp hiện tại G, đồ thị YCCĐ của môn M (lớp 1..G)

1. Chọn tập YCCĐ "trụ cột" của lớp G (các nút có nhiều nút phụ thuộc / trọng số thi cao).
2. Với mỗi YCCĐ được kiểm tra:
     hỏi 1–3 câu (mức Thông hiểu → Vận dụng)
     ước lượng mức thành thạo p ∈ [0,1]  (Bayesian Knowledge Tracing hoặc IRT đơn giản)
     nếu p ≥ ngưỡng_đạt (ví dụ 0.7):  đánh dấu ĐẠT, suy ra các tiên quyết của nó "có khả năng đạt"
                                        (giảm ưu tiên kiểm tra nhánh dưới)
     nếu p < ngưỡng_đạt:              đánh dấu CHƯA ĐẠT, ĐẨY các YCCĐ tiên quyết (lớp dưới) vào hàng đợi
3. Lặp đến khi: hết hàng đợi | đạt số câu tối đa (ví dụ 40 câu/môn) | độ chắc chắn đủ cao.
4. Kết quả: bản đồ {YCCĐ → trạng thái ĐẠT / CHƯA ĐẠT / SUY LUẬN / CHƯA KIỂM TRA, độ tin cậy}
   + "lỗ hổng gốc" = các YCCĐ CHƯA ĐẠT mà toàn bộ tiên quyết của nó đều ĐẠT (điểm bắt đầu lấp nền).
```
- Câu Có/Không, tự đánh giá thang điểm [YC] dùng như **tín hiệu phụ** (học sinh tự nhận "em chưa hiểu phần này"), kết hợp với câu kiểm tra thật để tăng độ chính xác.
- Giai đoạn đầu (chưa đủ dữ liệu), dùng luật đơn giản + ngưỡng cố định. Khi có dữ liệu, hiệu chỉnh tham số câu hỏi (độ khó, độ phân biệt) từ kết quả thực tế.

### 6.3. Hướng nghiệp (B1) – nguyên lý
1. Mỗi câu B1 gắn với 1 hoặc nhiều **chiều đo** (RIASEC, Big Five, giá trị…).
2. Tính **điểm từng chiều** bằng công thức cố định (có thể giải thích).
3. **Ghép nghề**: so khớp hồ sơ chiều đo của học sinh với **hồ sơ yêu cầu** của từng nghề trong danh mục (M15) và cộng thêm năng lực học tập thực tế (từ B2, nếu có).
4. AI viết **bức tranh tương lai**: mô tả một ngày làm việc, khung năng lực, con đường học tập, điều kiện thành công, dựa trên nghề đã xếp hạng và ghi chú phỏng vấn của chuyên gia.
5. Câu hỏi tiếp theo trong phiên: AI ưu tiên câu giúp **phân biệt rõ hơn giữa các nghề đang có điểm gần nhau**.

### 6.4. Kiến trúc tích hợp LLM [ĐX]
- Dùng Claude API (Anthropic). Gợi ý: **Claude Sonnet 5.5** (`claude-sonnet-5-5`) cho viết báo cáo/lộ trình; **Claude Haiku 5.5** (`claude-haiku-5-5`) cho phân loại nhanh, gắn cờ an toàn, gắn nhãn câu hỏi.
- Gọi LLM qua **một service riêng (AI Gateway)**: quản lý prompt có phiên bản, log đầu vào/đầu ra, đo chi phí, giới hạn tốc độ, bật/tắt theo tính năng.
- **Structured output (JSON schema)** cho mọi kết quả AI, kiểm tra hợp lệ trước khi lưu.
- **RAG**: khi viết báo cáo, nạp ngữ cảnh từ: danh mục nghề, điểm chuẩn, YCCĐ, tài liệu phương pháp của đội chuyên môn. Tránh AI "bịa" thông tin trường/ngành/điểm chuẩn.
- **Tối thiểu hóa dữ liệu gửi AI**: gửi mã học sinh ẩn danh, không gửi họ tên, số điện thoại, trường cụ thể khi không cần.
- Lưu `ai_generation` record cho mỗi lần sinh: prompt version, model, input hash, output, người duyệt, chỉnh sửa (để cải thiện chất lượng về sau).

---

## 7. MÔ HÌNH DỮ LIỆU (DATA MODEL) – THỰC THỂ CHÍNH

> Mọi bảng nghiệp vụ có: `id (uuid)`, `tenant_id`, `created_at`, `updated_at`, `created_by`, `deleted_at` (soft delete).

```
users (id, phone, email, password_hash, status, last_login_at)
user_roles (user_id, role, tenant_id)

parents (id, user_id, full_name, relation, address, occupation)
students (id, user_id?, full_name, dob, gender, current_grade, school_id, province_id, ward_id, target_note)
parent_student (parent_id, student_id, is_primary)
consents (id, student_id, parent_id, type, version, granted_at, revoked_at)

schools (id, name, level, province_id)   -- danh mục trường phổ thông
universities (id, name), majors (id, university_id, name, admission_blocks[], benchmark_scores jsonb)
careers (id, name, description, competency_profile jsonb, riasec_profile jsonb, salary_range)

subjects (id, code, name)
curriculum_units (id, code, subject_id, grade, chapter, title, description, weight_exam jsonb)  -- YCCĐ
curriculum_prereqs (unit_id, prereq_unit_id)
questions (id, code, toolkit, type, content jsonb, options jsonb, answer_key jsonb,
           difficulty, irt_params jsonb, grade_min, grade_max, audience, source, status, stats jsonb)
question_tags (question_id, tag_type, tag_value)   -- tag_type: CURRICULUM_UNIT | DIMENSION | ...

leads (id, parent_name, phone, student_grade, interest, source, status, assigned_admin_id, notes)

experts (id, user_id, bio, verified_at, status, rating_avg, rating_count)
expert_capabilities (expert_id, capability, subject_id?, grade_min?, grade_max?)  -- CAREER/COACH/SUBJECT
expert_credentials (id, expert_id, type, file_url, verified_by, verified_at)
expert_availability (id, expert_id, weekday, start_time, end_time, mode)
expert_rates (expert_id, service_type, price, unit)
assignments (id, student_id, expert_id, role_in_case, start_at, end_at, status)   -- quyền truy cập dựa vào đây

assessment_sessions (id, student_id, expert_id?, toolkit, mode, scope jsonb, status, started_at, ended_at)
assessment_responses (id, session_id, question_id, answer jsonb, is_correct?, score?, time_ms, entered_by)
mastery_states (student_id, curriculum_unit_id, p_mastery, status, confidence, source_session_id, updated_at)
dimension_scores (session_id, dimension, score)

reports (id, student_id, type, session_ids[], status, version, content jsonb, pdf_url,
         ai_generation_id?, approved_by, approved_at, published_at)

roadmaps (id, student_id, goal jsonb, start_date, target_date, status, approved_by)
roadmap_phases (id, roadmap_id, order, title, kpis jsonb, start_date, end_date)
roadmap_items (id, phase_id, type, title, curriculum_unit_ids[], frequency, duration_min,
               owner_type, owner_expert_id?, status)
checkpoints (id, roadmap_id, due_date, assessment_session_id?, result_summary jsonb)

packages (id, code, name, category, price, unit, sessions_included, duration_days, active)
orders (id, parent_id, student_id, package_id, amount, discount, status, paid_at,
        channel ONLINE|OFFICE|EVENT, event_id?, created_by, is_renewal,
        order_kind NEW|RENEWAL|ADD_ON, advised_by_user_id?, advised_by_role, is_self_purchase)
payments (id, order_id, gateway, gateway_txn_id, amount, status, raw jsonb)
session_credits (id, order_id, student_id, service_type, total, remaining, expires_at)

bookings (id, type, student_id, expert_id, start_at, end_at, mode ONLINE_ZOOM|IN_PERSON,
          location_type OFFICE|STUDENT_HOME|OTHER?, room_id?, address_ref?, status, credit_id?, roadmap_item_id?)
zoom_meetings (booking_id, zoom_meeting_id, join_url, host_url, passcode, recording_consent,
               recording_url?, recording_expires_at?, participants_report jsonb)
attendance_checkins (id, booking_id, method ZOOM_REPORT|QR|OTP|PARENT_CONFIRM, actor_id, at, minutes)
mode_change_requests (id, booking_id, from_mode, to_mode, requested_by, confirmed_by, price_diff, status)
expert_delivery_modes (expert_id, mode, service_radius_km?, locations jsonb, price_adjustment?)
rooms (id, location, name, capacity)
session_notes (id, booking_id, content, homework, mood, submitted_at)
reviews (id, booking_id, parent_id, expert_id, rating, comment)

payout_ledger (id, expert_id, booking_id, gross, share_rate, net, status, payout_batch_id)
payout_batches (id, period_start, period_end, status, approved_by, paid_at)
expert_pay_rates (id, expert_tier, service_type, mode, class_type, amount_per_session, effective_from)
kpi_periods (id, quarter, weights jsonb, max_bonus_rate=0.10, status)
expert_kpi_scores (id, kpi_period_id, expert_id, progress_score, discipline_score, csat_score,
                   retention_score, total_score, bonus_rate, base_pay_total, bonus_amount, payout_batch_id?)
review_work_logs (id, reviewer_id, item_type QUESTION|TOOLKIT|CURRICULUM_UNIT, item_id, action, at)

notifications (id, user_id, channel, template, payload jsonb, status, sent_at)
messages (id, thread_id, sender_id, content, created_at)

safety_flags (id, student_id, source_type, source_id, level, reason, detected_by, status,
              handled_by, handled_at, resolution)
ai_generations (id, feature, model, prompt_version, input_ref, output jsonb, tokens, cost, reviewed_by, edits jsonb)
audit_logs (id, actor_id, action, entity, entity_id, diff jsonb, ip, at)
tenants (id, name, brand jsonb, revenue_share jsonb, status)

-- M18 Bán hàng & Hoa hồng
sales_agents (id, user_id, level LEADER|AGENT, leader_id?, ref_code, status, contract_signed_at,
              id_number_enc, tax_code, bank_account_enc, trained_at)
sales_leads (id, parent_name, phone, student_grade, source, agent_id?, event_id?, stage, lost_reason,
             next_follow_up_at, owner_locked_until)
lead_activities (id, lead_id, actor_id, type CALL|MESSAGE|MEETING|NOTE, content, at)
commission_policies (id, name, scope jsonb, direct_rate, leader_rate, leader_self_sell_rate,
                     base_rule MAX_FIRST_PAYMENT_OR_6M, base_months, applies_to_renewal=false,
                     payout_mode PAY_AS_COLLECTED (đã chốt), exclude_care_advised_addon=true, hold_days,
                     effective_from, effective_to)
order_attributions (order_id, agent_id, leader_id?, seller_is_leader, source REF_CODE|COOKIE|OFFLINE_PICK,
                    policy_id, first_payment_amount, six_month_value, commission_base,
                    direct_rate_snapshot, leader_rate_snapshot, total_commission_direct, total_commission_leader)
commissions (id, order_id, payment_id, beneficiary_id, tier DIRECT|LEADER|LEADER_SELF, base_amount, rate,
             amount, status, hold_until, payout_batch_id?, clawback_of?)   -- 1 dòng cho mỗi lần chi dần
commission_payouts (id, period, beneficiary_id, gross, tax_withheld, net, status, paid_at)
events (id, name, type, location, start_at, end_at, capacity, cost, offer jsonb, status)
event_registrations (id, event_id, name, phone, invited_by_agent_id?, checked_in_at, lead_id?, order_id?)
cash_receipts (id, order_id, amount, received_by, received_at, receipt_no, cashbook_close_id?)
cashbook_closes (id, location, date, closed_by, total, confirmed_by, confirmed_at)

-- M19 Chăm sóc khách hàng
care_assignments (id, parent_id, care_agent_id, from_at, to_at, handover_note)
care_playbooks (id, name, trigger, offset_days, task_type, script_id, active)
care_tasks (id, parent_id, student_id?, playbook_id?, type, due_at, assignee_id, status, outcome, done_at)
tickets (id, parent_id, student_id?, channel, category, priority, subject, status, assignee_id,
         sla_first_response_due, sla_resolve_due, first_response_at, resolved_at, escalation_level, csat)
ticket_messages (id, ticket_id, author_id, direction IN|OUT, content, attachments, at)
call_logs (id, parent_id, agent_id, direction, started_at, duration_s, recording_url?, note)
surveys (id, type CSAT|NPS|CHURN, trigger, questions jsonb)
survey_responses (id, survey_id, parent_id, booking_id?, score, comment, at)
customer_health (parent_id, score, level GREEN|YELLOW|RED, factors jsonb, computed_at)
refund_requests (id, order_id, amount, reason, requested_by, approval_level, status, approved_by)
scripts (id, title, category, content, version)

-- M20 Giám sát lộ trình đào tạo
learning_cases (id, student_id, roadmap_id, owner_coach_id, status, opened_at, closed_at)
case_members (case_id, expert_id, role COACH|TUTOR|CAREER_ADVISOR, subject_id?, from_at, to_at)
subject_plans (id, case_id, subject_id, tutor_id, status, stream_ratio jsonb, start_date, end_date,
               approved_by, approved_at, version)
subject_plan_items (id, plan_id, stream REMEDIAL|CURRENT|ADVANCED, curriculum_unit_ids[],
                    planned_week, planned_sessions, status, done_at)
lesson_records (id, booking_id, plan_id, units_taught jsonb, unit_mastery jsonb, attendance,
                focus_score, observed_mood, homework jsonb, note_to_coach, note_to_parent,
                submitted_at)                       -- biên bản có cấu trúc, thay session_notes cho buổi gia sư
homework_submissions (id, lesson_record_id, student_id, submitted_at, score, file_urls)
quick_checks (id, student_id, plan_item_id, assessment_session_id, score, passed)
school_scores (id, student_id, subject_id, term, test_type, score, max_score, evidence_url, entered_by)
monitoring_metrics (student_id, date, plan_progress jsonb, gap_closing_rate, on_track_forecast,
                    attendance_rate, homework_rate, weekly_load_hours, mood_trend, status_light)
monitoring_alerts (id, student_id, case_id, rule_code, level, details jsonb, recipients[],
                   status, acknowledged_by, action_taken, resolved_at)
alert_rules (code, name, condition jsonb, level, recipients_roles[], active)
plan_change_requests (id, plan_id, requested_by, change jsonb, reason, status, coach_decision,
                      parent_confirmed_at?, order_id?)
case_reviews (id, case_id, review_date, tutor_inputs jsonb, conclusions, next_actions jsonb)
case_threads (id, case_id), case_messages (id, thread_id, author_id, content, at)
tests (id, case_id, subject_id?, type WARMUP|QUICK_CHECK|HOMEWORK|PERIODIC|CHECKPOINT|MOCK_EXAM,
       created_by, blueprint jsonb, question_ids[], time_limit_min, open_at, due_at,
       proctoring NONE|BASIC|CAMERA|ONSITE, show_solution_policy)
test_attempts (id, test_id, student_id, mode ONLINE|UPLOAD|PAPER_ENTRY, started_at, submitted_at,
               score, max_score, status, grading_due_at, tab_switch_count)
attempt_answers (id, attempt_id, question_id, curriculum_unit_id, answer jsonb, file_urls,
                 is_correct, points, rubric_scores jsonb, feedback, graded_by, graded_at)
score_corrections (id, attempt_answer_id, old_points, new_points, reason, by, at)
auto_plan_updates (id, attempt_id, plan_id, change jsonb, applied_automatically, change_request_id?)
solution_playbooks (id, risk_code, role, title, content, conditions jsonb, active, effectiveness_score)
recommendations (id, student_id, alert_id?, playbook_id, role, personalized_text, status,
                 decided_by, dismiss_reason, effect_review_at, effect_result jsonb)
notification_policies (event_type, role, channel, digest DAILY|WEEKLY|NONE, requires_coach_approval)
student_risk_scores (student_id, date, score, trend, top_risks jsonb)

-- 9.2 Lớp nhóm
class_groups (id, subject_id, grade, level, type ONE_ON_ONE|SMALL_GROUP|LARGE_GROUP, mode,
              tutor_id, min_size, max_size, schedule jsonb, launch_deadline, status, launched_at)
class_enrollments (id, class_group_id, student_id, order_id, status RESERVED|ACTIVE|WAITLIST|
                   TRANSFERRED|REFUNDED, joined_at)
price_matrix (id, service_type, expert_tier, mode, class_type, unit, price, effective_from)

-- 19.1 Trợ lý AI CSKH
kb_answers (id, topic, question_variants[], answer, status DRAFT|APPROVED|RETIRED, approved_by, version)
ai_conversations (id, channel, parent_id?, started_at, resolved_by_ai, handed_off_ticket_id?)
ai_messages (id, conversation_id, role USER|AI|AGENT, content, kb_answer_ids[], flagged_wrong)

-- M21 Nội trú & Bán trú
facilities (id, tenant_id, name, address, type)
dorm_rooms (id, facility_id, name, gender, capacity), beds (id, room_id, label, status)
residencies (id, student_id, facility_id, type BOARDING|DAY_BOARDING, bed_id?, start_date, end_date,
             contract_url, status)
authorized_pickups (id, residency_id, name, relation, phone, photo_url, active)
health_notes (id, student_id, allergies, medications, conditions, emergency_contact)
daily_schedules (id, facility_id, day_type, blocks jsonb)
boarding_checkins (id, residency_id, type ARRIVE|LEAVE|NIGHT|MORNING|OUT|BACK, method, by_staff_id,
                   picked_up_by_id?, at, note)
meal_plans (id, facility_id, week, menu jsonb), meal_optouts (id, residency_id, date, meal, at)
incidents (id, residency_id, category HEALTH|INJURY|DISCIPLINE|CONFLICT|OTHER, severity, description,
           action_taken, parent_notified_at, safety_flag_id?, reported_by, at)
staff_shifts (id, facility_id, staff_id, start_at, end_at, handover_note)
```

---

## 8. MÁY TRẠNG THÁI (STATE MACHINES)

**Lead**: `NEW → CONTACTED → QUALIFIED → SCHEDULED → CONVERTED` | `→ LOST` (từ mọi trạng thái)

**Assessment session**: `CREATED → IN_PROGRESS ⇄ PAUSED → COMPLETED → ANALYZED` | `→ CANCELLED`

**Report**: `AI_DRAFT → IN_REVIEW → APPROVED → PUBLISHED → (REVISED → PUBLISHED v2…)` | `REJECTED → AI_DRAFT`

**Roadmap**: `DRAFT → PENDING_PARENT → ACTIVE → (ADJUSTING → ACTIVE) → COMPLETED | CANCELLED`

**Booking**: `REQUESTED → CONFIRMED → (RESCHEDULED → CONFIRMED) → IN_SESSION → DONE_PENDING_NOTE → COMPLETED`
`→ CANCELLED_BY_PARENT | CANCELLED_BY_EXPERT | NO_SHOW_STUDENT | NO_SHOW_EXPERT`

**Order/Payment**: `PENDING → PAID → (PARTIALLY_REFUNDED | REFUNDED)` | `→ FAILED | EXPIRED`

**Expert**: `APPLIED → DOCS_VERIFIED → INTERVIEWED → TRAINED → ACTIVE ⇄ SUSPENDED → INACTIVE`

**Safety flag**: `OPEN → ACKNOWLEDGED → IN_HANDLING → RESOLVED | ESCALATED`

**Sales lead**: `NEW → CONTACTED → CONSULTED → NEGOTIATING → WON` | `→ LOST` (bắt buộc ghi lý do)

**Sales agent (CTV/Leader)**: `APPLIED → CONTRACTED → TRAINED → ACTIVE ⇄ SUSPENDED → TERMINATED`

**Commission**: `PENDING (đang giữ) → APPROVED → PAID` | `PENDING → CANCELLED (đơn hoàn/hủy)` | `PAID → CLAWBACK`

**Cash receipt**: `RECORDED → CLOSED (chốt quỹ) → CONFIRMED (kế toán)`, chỉ khi `CONFIRMED` thì đơn mới `PAID`

**Ticket**: `NEW → ASSIGNED → IN_PROGRESS ⇄ WAITING_CUSTOMER → RESOLVED → CLOSED` | `RESOLVED → REOPENED`

**Refund request**: `REQUESTED → APPROVED (theo hạn mức) → REFUNDED` | `→ REJECTED`

**Learning case (hồ sơ đồng hành)**: `OPEN → ACTIVE ⇄ ON_HOLD → GOAL_ACHIEVED | CLOSED`

**Subject plan (kế hoạch môn)**: `DRAFT → PENDING_COACH → ACTIVE → (REVISING → PENDING_COACH → ACTIVE) → COMPLETED` | `→ REPLACED (đổi gia sư)`

**Lesson record (biên bản buổi)**: `DUE → SUBMITTED → (LATE nếu quá 24h)` ; quá 72h tạo cảnh báo cho cố vấn

**Monitoring alert**: `OPEN → ACKNOWLEDGED → ACTION_TAKEN → RESOLVED` | `OPEN (Đỏ, quá 48h) → ESCALATED`

**Plan change request**: `REQUESTED → COACH_APPROVED → (PARENT_CONFIRMED nếu đổi lịch/chi phí) → APPLIED` | `→ REJECTED`

**Test attempt (bài làm)**: `ASSIGNED → IN_PROGRESS → SUBMITTED → (GRADING_PENDING nếu tự luận) → GRADED → RESULTS_RELEASED` | `ASSIGNED → OVERDUE`

**Recommendation (gợi ý giải pháp)**: `SUGGESTED → APPLIED → EFFECT_REVIEWED` | `SUGGESTED → DISMISSED (có lý do)`

**Parent alert cần duyệt**: `DRAFTED → COACH_REVIEWING → SENT` | `→ WITHHELD (cố vấn quyết định không gửi, có lý do)`

> Mỗi chuyển trạng thái ghi `audit_logs` và có thể phát sự kiện (event) cho M12 gửi thông báo.

---

## 9. PHÂN QUYỀN CHI TIẾT (RBAC MATRIX)

Ký hiệu: **C**=tạo, **R**=xem, **U**=sửa, **D**=xóa, **A**=duyệt, **—**=không, *(gán)* = chỉ với học sinh đang được phân công.

| Tài nguyên | PARENT | STUDENT | CAREER_EXPERT | LIFE_COACH | SUBJECT_EXPERT | ADMIN |
|---|---|---|---|---|---|---|
| Hồ sơ học sinh | CRU (con mình) | R (mình) | R *(gán)* | RU *(gán)* | R cơ bản *(gán)* | CRUD |
| Phiên đánh giá B1 | R kết quả | làm bài | CRU *(gán)* | R *(gán)* | — | R |
| Phiên đánh giá B2–B4 | R kết quả | làm bài | — | CRU *(gán)* | R phần môn mình *(gán)* | R |
| Báo cáo R1 | R (đã phát hành) | R (đã phát hành) | CRUA *(gán)* | R *(gán)* | — | R |
| Báo cáo R2 – phần tinh thần chi tiết | R bản tóm lược | R bản tóm lược | — | CRUA *(gán)* | — | — (chỉ khi được cấp quyền đặc biệt) |
| Lộ trình | R, xác nhận | R | R | CRUA *(gán)* | R, cập nhật item của mình | R |
| Đặt lịch | C, R, hủy | R | RU (của mình) | RU (của mình) | RU (của mình) | CRUD |
| Biên bản phiên | R (nếu chính sách cho phép) | — | CRU (của mình) | CRU + R của chuyên gia bộ môn *(gán)* | CRU (của mình) | R |
| Cờ an toàn | — | — | C (báo cáo) | CRU *(gán)* | C (báo cáo) | R (quản lý chuyên môn: CRUA) |
| Ngân hàng câu hỏi | — | — | R (bộ B1) | R | R (môn mình) | CRUD; CONTENT_EDITOR: CRUA |
| Đơn hàng, thanh toán | CR (của mình) | — | — | — | — | R, hoàn tiền; ACCOUNTANT: RU |
| Thu nhập chuyên gia | — | — | R (của mình) | R (của mình) | R (của mình) | R; ACCOUNTANT: A |
| Hồ sơ đồng hành (M20) | R tóm tắt | R tóm tắt | R *(tham vấn)* | CRUA (chủ hồ sơ) | R phần môn mình *(gán)* | R |
| Kế hoạch môn | R | R | R | RA (duyệt) | CRU (môn mình) | R |
| Biên bản buổi học | R phần "ghi chú cho phụ huynh" | — | R | R (tất cả môn) | CRU (buổi của mình) | R |
| Cảnh báo giám sát | R (cảnh báo cần phối hợp) | — | — | RU, xử lý | R, xử lý (môn mình) | R |
| Kênh trao đổi nội bộ theo học sinh | — | — | R | CRU | CRU | R |
| Điểm kiểm tra trên lớp | CRU | CRU | R | R | R | R |
| Đề kiểm tra / thi | — | Làm bài | — | CRU (checkpoint, thi thử) | CRU (môn mình) | R |
| Kết quả bài làm | R tóm tắt | R (của mình, kèm lời giải) | R | R (tất cả môn) | R chi tiết, chấm (môn mình) | R |
| Sửa điểm đã chốt | — | — | — | A | U (có lý do, audit) | R |
| Gợi ý giải pháp | R (phần dành cho phụ huynh) | R (phần dành cho học sinh) | R | R, áp dụng/bỏ qua | R, áp dụng/bỏ qua (môn mình) | R; CONTENT_EDITOR: quản lý thư viện |
| Cảnh báo nghiêm trọng gửi phụ huynh | Nhận sau khi duyệt | — | — | Duyệt / giữ lại | — | R |

**Phân quyền nhóm Bán hàng & CSKH**

| Tài nguyên | SALES_AGENT | SALES_LEADER | OFFICE_STAFF | CARE_AGENT | CARE_LEAD | ADMIN / ACCOUNTANT |
|---|---|---|---|---|---|---|
| Lead | CRU (của mình) | CRU (của mình + nhóm) | CR | R (gia đình được giao) | R | CRUD |
| Tạo đơn offline | C | C | C | C (đơn gia hạn) | C | C |
| Thông tin liên hệ khách | R (khách của mình) | R (khách của nhóm) | R (khi đang tạo đơn) | R (gia đình được giao) | R | R |
| Thu tiền mặt / phiếu thu | — | — | C (nếu được cấp quyền thu) | — | — | ACCOUNTANT: xác nhận |
| Chính sách & tỉ lệ hoa hồng | R | R | — | — | — | ADMIN: CRU |
| Hoa hồng | R (của mình) | R (của mình + nhóm) | — | — | — | ACCOUNTANT: duyệt, chi |
| Sự kiện / check-in | R, mời khách | CR, mời khách | CRU, check-in | R | R | CRUD |
| Ticket | C (chuyển tiếp) | C | C | CRU (được giao) | CRUA, phân công | R |
| Hoàn tiền | — | — | — | Đề xuất | Duyệt (trong hạn mức) | Duyệt (trên hạn mức) |
| Báo cáo/biên bản tinh thần học sinh | — | — | — | — | — | — |

---

## 10. YÊU CẦU PHI CHỨC NĂNG, BẢO MẬT & PHÁP LÝ

### 10.1. Bảo vệ dữ liệu cá nhân của trẻ em (ưu tiên cao nhất)
Hệ thống xử lý **dữ liệu cá nhân của trẻ em**, trong đó có dữ liệu về **sức khỏe tinh thần, thể chất** (dữ liệu nhạy cảm). Phải tuân thủ quy định hiện hành về bảo vệ dữ liệu cá nhân của Việt Nam (Luật Bảo vệ dữ liệu cá nhân và các văn bản hướng dẫn, Nghị định 13/2023/NĐ-CP). **Đội dự án cần luật sư/chuyên gia pháp lý xác nhận các yêu cầu cụ thể trước khi go-live.** Các yêu cầu kỹ thuật tối thiểu:
- **Đồng ý (consent)** của cha mẹ/người giám hộ, và của trẻ theo độ tuổi luật định, ghi nhận có phiên bản, thời điểm, có thể rút lại. Không có consent thì không tạo phiên đánh giá.
- Thông báo rõ mục đích xử lý, ai được xem, lưu bao lâu, có dùng AI hay không.
- Mã hóa dữ liệu khi lưu trữ (at-rest) và khi truyền (TLS). Mã hóa cấp trường cho dữ liệu tinh thần và ghi chú phiên.
- Phân quyền tối thiểu theo phân công (Mục 9); **audit log mọi lần xem** hồ sơ/ báo cáo tinh thần.
- Quyền của chủ thể dữ liệu: xem, tải về, yêu cầu sửa/xóa dữ liệu.
- **Máy chủ đặt tại Việt Nam** [YC – chốt v0.9] (Viettel IDC, FPT Cloud, VNPT…). Gọi AI quốc tế (Claude) **chỉ với dữ liệu đã ẩn danh** (mã học sinh thay cho tên; không gửi số điện thoại, địa chỉ, tên trường), ghi rõ trong chính sách bảo mật; vẫn cần đánh giá theo quy định chuyển dữ liệu ra nước ngoài.
- **Bản ghi hình Zoom** chứa hình ảnh, giọng nói của trẻ: lưu trên hạ tầng tại Việt Nam (tải về từ Zoom rồi xóa trên Zoom), mã hóa, có thời hạn lưu, audit mọi lượt xem.
- Đánh giá tác động xử lý dữ liệu cá nhân (hồ sơ DPIA) trước khi vận hành.

### 10.2. Hiệu năng & ổn định
- Trang tải < 2s trên 4G; bài tầm soát chuyển câu < 500ms (không chờ LLM ở bước chấm; LLM chỉ chạy ở bước diễn giải/sinh câu).
- Báo cáo AI sinh **bất đồng bộ** (job queue), có trạng thái "đang tạo", thông báo khi xong.
- Uptime mục tiêu 99.5%; sao lưu CSDL hằng ngày, giữ 30 ngày; kiểm thử khôi phục định kỳ.

### 10.3. Trải nghiệm
- **Mobile-first** (phụ huynh và học sinh chủ yếu dùng điện thoại). **Chốt v0.9**: làm **web trước** dạng PWA (cài được lên màn hình chính, có thông báo đẩy), **app di động sau**.
- **Tài khoản học sinh**: từ lớp 6 có tài khoản riêng do phụ huynh tạo; tiểu học dùng chung tài khoản phụ huynh (có "chế độ học sinh" để con làm bài).
- Giao diện học sinh thân thiện theo độ tuổi (tiểu học khác THPT).
- Hỗ trợ công thức Toán/Lý/Hóa (KaTeX), hình vẽ.
- Ngôn ngữ: tiếng Việt (chuẩn bị i18n cho mở rộng).

### 10.4. Chất lượng mã & vận hành
- API có tài liệu OpenAPI; kiểm thử tự động cho thuật toán tầm soát, tính điểm, chia doanh thu, phân quyền.
- Môi trường: dev / staging / production. CI/CD.
- Giám sát lỗi (Sentry), log tập trung, cảnh báo.

---

## 11. KIẾN TRÚC KỸ THUẬT ĐỀ XUẤT & LỘ TRÌNH TRIỂN KHAI

### 11.1. Kiến trúc – chốt v0.9: đội nội bộ, **JavaScript/TypeScript**
Toàn bộ dùng **TypeScript**: Next.js (web/PWA) + NestJS (API) + PostgreSQL + Redis/BullMQ. Một ngôn ngữ cho cả frontend và backend giúp đội nội bộ nhỏ làm nhanh, dễ thay người.
```
 ┌──────────── Web App (Next.js, responsive)  ── App di động (React Native / Flutter) [GĐ2]
 │
 ├── API Backend (NestJS) – "modular monolith", mỗi phân hệ M01–M21 là 1 module
 │      ├── PostgreSQL (dữ liệu chính, jsonb cho nội dung linh hoạt)
 │      ├── Redis (cache, session, hàng đợi job – BullMQ/Celery)
 │      ├── Object storage (S3-compatible: PDF báo cáo, hồ sơ chuyên gia)
 │      └── Search (PostgreSQL full-text, hoặc Meilisearch cho marketplace)
 │
 ├── AI Gateway service (gọi Claude API; quản lý prompt, log, chi phí, RAG – pgvector)
 ├── Report renderer (HTML → PDF)
 └── Tích hợp: VNPay/MoMo/PayOS · Zalo ZNS/SMS · Email · Google Meet/Zoom
```
> Khuyến nghị **modular monolith** cho MVP (đội nhỏ, triển khai nhanh), tách service sau khi tải tăng. Riêng AI Gateway và Report renderer tách riêng từ đầu vì chạy bất đồng bộ, tốn tài nguyên.

### 11.2. Lộ trình triển khai – chốt v0.9 (ngân sách MVP dưới 300 triệu, chạy thử sau 4–6 tháng)

> **Lưu ý thẳng thắn**: phạm vi đã chọn (lớp 1–12, 5 môn, 3 hình thức học, lớp nhóm, nội trú/bán trú, CSKH bằng AI, bán hàng 2 kênh, giám sát lộ trình) là **lớn so với ngân sách dưới 300 triệu**. Cách làm khả thi: **đội nội bộ TypeScript, dùng tối đa dịch vụ có sẵn** (Zoom, PayOS, Zalo OA, dịch vụ gửi email/SMS), **làm bản cơ bản của mọi phân hệ cần cho vận hành**, để phần "thông minh" và tự động hóa sâu sang GĐ2. Nội dung (câu hỏi, chương trình) do AI soạn nên chi phí nội dung thấp, nhưng **tốc độ duyệt của người duyệt cuối** sẽ quyết định tốc độ mở môn/lớp.

| Giai đoạn | Thời gian | Phạm vi | Điều kiện hoàn thành |
|---|---|---|---|
| **GĐ0 – Nội dung** (song song GĐ1) | Tháng 1–6 | AI số hóa YCCĐ + tiên quyết cho 5 môn × lớp 1–12; AI soạn bộ B1–B4; giáo viên rà, **Cố vấn Tracie Anh duyệt cuối**. Thứ tự mở: Toán → Anh → Văn → Lý → Hóa; trong mỗi môn ưu tiên lớp 9 và 12, rồi THCS, THPT, cuối cùng tiểu học. SOP an toàn tâm lý do người phụ trách tâm lý duyệt. Thư viện giải pháp + kho tài liệu chính thống bản đầu. Kho câu trả lời CSKH bản đầu | Mỗi môn/lớp được "mở bán" khi nội dung đã duyệt |
| **GĐ1 – MVP chạy thử** | Tháng 1–5 | **Lõi**: M01, M02, M03, M04 (+ màn hình duyệt hàng loạt), M05, M06 (AI nháp + duyệt), M07, M09 (**3 hình thức** + Zoom tự tạo phòng + ghi hình; **lớp 1-1 và lớp nhóm** với cơ chế đủ sĩ số mới khai giảng), M10 (**PayOS QR**, đóng tháng + ưu đãi đóng dài, hoàn tiền 14 ngày, ví buổi học), M11 (chi trả tháng, bảng kê), M12 (email + Zalo ZNS khi có OA), M13 (dashboard phụ huynh, cố vấn, gia sư; **4 chỉ số buổi sáng** cho ban điều hành), M14, M15. **M18**: bán online (cấp user tự động) + offline (POS đơn giản), hoa hồng 2 cấp chi dần theo tiền thu, giữ khách 30 ngày, CTV phải đạt bài kiểm tra. **M19**: trợ lý AI CSKH trên web chat (Zalo OA khi lập xong), ticket, điểm chạm tự sinh, CSAT. **M20**: hồ sơ đồng hành, kế hoạch môn, biên bản, kiểm tra trên nền tảng, cảnh báo theo vai trò, thư viện giải pháp tĩnh. **M21 bản cơ bản**: phòng/giường, hồ sơ lưu trú, phí, điểm danh, đưa đón an toàn, nhật ký sự việc | Dưới 100 học sinh thật, online toàn quốc + trực tiếp tại trung tâm |
| **GĐ2 – Hoàn thiện & tự động hóa** | Tháng 6–12 | Marketplace chuyên gia đầy đủ (M08), app di động, hộp thư hợp nhất + hotline tổng đài, health score, NPS; M20 nâng cao (chấm tự luận rubric, thi thử giám sát, AI cá nhân hóa giải pháp có trích nguồn, đo hiệu quả, điểm rủi ro xu hướng); M21 nâng cao (ăn uống, lịch trực, báo cáo); hóa đơn điện tử tự động; VNPay thẻ | Vận hành ổn định 300+ học sinh |
| **GĐ3 – Nhân bản** | Sau 12 tháng | M16 nhượng quyền (chung một nền tảng), M17 chiến dịch trường học | Đơn vị nhượng quyền đầu tiên |

**Gợi ý cắt giảm nếu vượt ngân sách** (theo thứ tự cắt trước): ghi hình Zoom tự động tải về (chuyển sang lưu trên Zoom có thời hạn) → lớp nhóm lớn → M21 phần ăn uống → POS offline (dùng form đơn giản) → trợ lý AI CSKH (dùng FAQ tĩnh + ticket).

---

## 12. CÂU HỎI MỞ CẦN CHỦ DỰ ÁN QUYẾT ĐỊNH

> **v0.9**: các câu hỏi dưới đây và trong Bộ câu hỏi đã được trả lời – xem **Phụ lục B**. Phần còn mở ở **B8**.
>
> Từ v0.5, các câu hỏi còn mở được gom thành tài liệu riêng **"Bộ câu hỏi chốt yêu cầu"** (`BO_CAU_HOI_CHOT_YEU_CAU`), có phương án lựa chọn và khuyến nghị cho từng câu. Danh sách dưới đây giữ lại để tra cứu lịch sử.

1. **Phạm vi MVP**: bắt đầu với lớp 6–12 hay cả tiểu học? Bắt đầu với môn nào (đề xuất: Toán trước)?
2. **Bộ câu hỏi B1**: đội chuyên môn tự xây hay dùng/mua bản quyền công cụ trắc nghiệm hướng nghiệp có sẵn?
3. **Ai số hóa chương trình GDPT 2018** (YCCĐ + quan hệ tiên quyết)? Đây là khối việc nội dung lớn nhất, không phải việc của lập trình viên.
4. **Học sinh tự đặt lịch** hay **chỉ Admin xếp lịch**? (Ghi âm nói Admin xếp; marketplace lại cho phụ huynh tự chọn chuyên gia.)
5. **Tỉ lệ chia doanh thu** với chuyên gia theo từng loại dịch vụ? Chuyên gia tự đặt giá hay nền tảng đặt giá?
6. Gói **"Cố vấn toàn diện – bất kỳ lúc nào"**: cam kết thời gian phản hồi bao lâu? Có cần kênh chat/gọi trong app không?
7. **Phụ huynh xem được đến đâu** nội dung tinh thần học sinh chia sẻ với cố vấn? (Cân bằng giữa quyền được biết của phụ huynh và niềm tin của học sinh.)
8. Hình thức **online, offline hay cả hai**? Có mô hình nội trú/bán trú (cuộc gọi 02) cần quản lý trên nền tảng không (phòng, ca học, điểm danh)?
9. **Thương hiệu**: tên nền tảng chính thức, tên miền, logo, nhận diện màu sắc.
10. **Nhượng quyền**: đối tác nhượng quyền dùng chung nền tảng (multi-tenant) hay mỗi đối tác một bản riêng?
11. **Ngân sách & thời gian** mong muốn cho MVP, quy mô đội lập trình hiện có (để chọn stack và cắt phạm vi phù hợp).

**Bán hàng & CSKH (bổ sung v0.2)**

12. ~~Leader tự bán nhận bao nhiêu?~~ **Đã chốt**: 15%, tính trên số lớn hơn giữa kỳ đóng đầu và phí 6 tháng.
13. ~~Đơn gia hạn có tính hoa hồng?~~ **Đã chốt**: không tính.
14. ~~Gói chuyên gia bộ môn tính trên phần nào?~~ **Đã chốt**: tính trên toàn bộ học phí.
14b. ~~Chế độ chi hoa hồng?~~ **Đã chốt**: chi dần theo tiền thực thu. Còn cần xác nhận: cách quy đổi "giá trị 6 tháng" cho gói theo buổi và gói trọn gói (18.5); cơ sở tính áp dụng chung cho cả CTV và Leader (đã giả định như vậy).
14c. ~~Mua thêm và tự mua?~~ **Đã chốt**: mua thêm do CSKH tư vấn thì không tính hoa hồng CTV; CTV tự mua cho con được tính như khách khác. Đơn mua thêm do CTV trực tiếp tư vấn được tính như đơn mới.
15. **Thời gian giữ hoa hồng** và **chính sách hoàn tiền** cho khách: hoàn trong bao nhiêu ngày, hoàn bao nhiêu %?
16. **Thời hạn khóa chủ khách hàng** cho CTV: 60 ngày có phù hợp không?
17. **Chuyên gia/giáo viên** có được làm CTV giới thiệu khách không? Nhân viên CSKH có được nhận hoa hồng khi chốt gia hạn không (hay thưởng theo KPI tỉ lệ gia hạn)?
18. **Hạn mức thẩm quyền**: CSKH, trưởng CSKH, ban giám đốc được tự quyết hoàn tiền / tặng buổi bù đến mức nào?
19. **Giờ hoạt động CSKH** (đề xuất 8:00–21:00, kể cả thứ Bảy) và kênh chính (đề xuất Zalo OA + hotline).

---

## 13. PHỤ LỤC A – CẨM NANG VẬN HÀNH CHĂM SÓC KHÁCH HÀNG

> Phụ lục này là **tư vấn vận hành** cho ban điều hành và đội CSKH. Lập trình viên đọc để hiểu vì sao M19 cần các chức năng như mô tả. Các con số (SLA, định biên, mốc ngày) là **mức đề xuất ban đầu**, nên điều chỉnh sau 2–3 tháng chạy thật.

### A1. Năm nguyên tắc nền
1. **Một gia đình – một người phụ trách.** Phụ huynh luôn biết "gọi ai". Người phụ trách chịu trách nhiệm đến cùng, kể cả khi cần chuyển việc cho bộ phận khác.
2. **Chủ động hơn bị động.** Phần lớn liên hệ nên do CSKH chủ động theo lịch điểm chạm, không đợi phụ huynh phàn nàn.
3. **Không ghi lại = không xảy ra.** Mọi cuộc gọi, tin nhắn, cam kết đều ghi vào hệ thống. Người khác tiếp quản vẫn nắm đủ.
4. **Tách bạch 3 vai**: Bán hàng (đến lúc thanh toán) – CSKH (quan hệ suốt vòng đời) – Chuyên môn (nội dung tư vấn, học tập, tâm lý). CSKH không tư vấn chuyên môn thay chuyên gia.
5. **Cam kết thời gian (SLA) rõ ràng** và giữ đúng. Chưa xử lý xong thì vẫn phải phản hồi "đã nhận, đang xử lý, hẹn lúc…".

### A2. Bàn giao từ Bán hàng sang CSKH
- Khi đơn đầu tiên `PAID`, hệ thống tự giao CSKH phụ trách.
- CTV **bắt buộc** điền **ghi chú bàn giao** (trong 24h): kỳ vọng của phụ huynh, điều đã hứa/tư vấn, điểm nhạy cảm của gia đình, kênh và giờ liên lạc thuận tiện.
- CSKH đọc ghi chú trước cuộc gọi chào mừng. Phát hiện CTV hứa ngoài chính sách thì báo trưởng CSKH (dữ liệu này phục vụ đào tạo lại CTV).

### A3. Hành trình điểm chạm chuẩn (Touchpoint Playbook)
| Mốc | Việc | Kênh | Người làm |
|---|---|---|---|
| Ngay khi thanh toán | Tin chào mừng + thông tin đăng nhập + tên, số điện thoại CSKH phụ trách | Zalo/SMS tự động | Hệ thống |
| Trong 24h | **Cuộc gọi chào mừng** (10–15 phút): giới thiệu bản thân, giải thích hành trình 3 tầng, hướng dẫn dùng tài khoản, chốt lịch phiên đầu | Gọi | CSKH |
| 24h và 1h trước mỗi phiên | Nhắc lịch | Tự động | Hệ thống |
| 24h sau phiên đầu tiên | Hỏi cảm nhận, xử lý ngay nếu chưa hài lòng | Gọi/nhắn | CSKH |
| Sau mỗi phiên | CSAT 1 câu | Tự động | Hệ thống |
| Khi báo cáo phát hành | **Hẹn buổi giải thích báo cáo** cùng chuyên gia (đây là "khoảnh khắc quyết định": phụ huynh hiểu giá trị thì sẽ đi tiếp) | Gọi + họp | CSKH + Chuyên gia |
| Tuần thứ 2 của lộ trình | Hỏi thăm việc học đã vào nếp chưa | Nhắn/gọi | CSKH |
| Hằng tháng | Gửi báo cáo tiến độ + gọi 5–10 phút | Gọi | CSKH |
| Trước kỳ thi/kiểm tra lớn | Tin động viên học sinh, nhắc phụ huynh | Nhắn | CSKH |
| Sinh nhật học sinh | Lời chúc (có thể kèm quà nhỏ) | Nhắn | Hệ thống + CSKH |
| 21 ngày trước khi hết gói | **Tư vấn gia hạn** dựa trên tiến độ thực tế và chặng tiếp theo của lộ trình | Gọi | CSKH |
| 7 ngày trước khi hết gói | Nhắc lần 2, gửi đề xuất cụ thể | Nhắn | CSKH |
| Hết gói, không gia hạn | Khảo sát lý do; giữ liên lạc sau 30 và 90 ngày (tin hữu ích, không ép bán) | Nhắn | CSKH |
| Hằng quý | Khảo sát NPS | Tự động | Hệ thống |

### A4. Tiếp nhận & phân loại yêu cầu
- **Kênh chính**: Zalo OA (kênh phụ huynh quen dùng nhất) và hotline. Kênh phụ: chat trong app, email. **Mọi kênh đổ về một hộp thư**, mỗi yêu cầu là một ticket.
- **Phân loại**: Hỏi thông tin · Lịch học · Thanh toán/hóa đơn · Chuyên gia/chất lượng · Kỹ thuật/tài khoản · Khiếu nại · **An toàn học sinh** (chuyển ngay M14).

| Mức ưu tiên | Ví dụ | Phản hồi đầu tiên | Xử lý xong |
|---|---|---|---|
| **Khẩn cấp** | Dấu hiệu nguy hiểm với học sinh | **Ngay lập tức**, chuyển M14 | Theo quy trình an toàn |
| **Cao** | Khiếu nại; phiên sắp diễn ra bị trục trặc; thanh toán bị trừ tiền nhưng chưa ghi nhận | 1 giờ | 24 giờ |
| **Thường** | Đổi lịch, hỏi tiến độ, hỏi hóa đơn | 4 giờ làm việc | 2 ngày làm việc |
| **Thấp** | Góp ý, hỏi thông tin chung | 1 ngày làm việc | 3 ngày làm việc |

- **Giờ hoạt động** đề xuất: 8:00–21:00 (phụ huynh thường rảnh buổi tối), có trực thứ Bảy. Ngoài giờ: trả lời tự động + số khẩn cấp cho tình huống an toàn.

### A5. Leo thang 3 cấp
| Cấp | Ai | Khi nào |
|---|---|---|
| Cấp 1 | CSKH phụ trách | Mọi yêu cầu thông thường |
| Cấp 2 | Trưởng CSKH (+ trưởng chuyên môn nếu là vấn đề chuyên môn) | Khiếu nại; quá SLA; khách Đỏ; vượt thẩm quyền cấp 1 |
| Cấp 3 | Ban giám đốc | Khiếu nại nghiêm trọng, nguy cơ khủng hoảng truyền thông, yêu cầu pháp lý, hoàn tiền vượt hạn mức |

### A6. Xử lý khiếu nại (6 bước)
1. **Tiếp nhận & ghi nhận** đầy đủ, cảm ơn phụ huynh đã phản hồi, xác nhận thời hạn trả lời.
2. **Xác minh**: xem lịch sử phiên, biên bản, trao đổi với chuyên gia liên quan.
3. **Đề xuất giải pháp** trong thẩm quyền (tặng buổi bù, đổi chuyên gia, điều chỉnh lịch, hoàn tiền).
4. **Phản hồi** cho phụ huynh, thống nhất giải pháp.
5. **Thực hiện & đóng ticket**, gửi khảo sát hài lòng.
6. **Rút bài học**: gắn nhãn nguyên nhân gốc (chuyên gia / quy trình / kỳ vọng do bán hàng / kỹ thuật), xem lại trong họp tháng.

**Hạn mức thẩm quyền** (ví dụ, chủ dự án chốt lại): CSKH được tặng tối đa 1 buổi bù/gói; trưởng CSKH được đổi chuyên gia, tặng đến 2 buổi, duyệt hoàn tiền đến mức X; trên mức X do ban giám đốc duyệt.
**Đổi chuyên gia**: miễn phí trong 2 tuần đầu nếu không hợp (đề xuất). Lý do đổi được ghi nhận để đánh giá chuyên gia.

### A7. Chỉ số sức khỏe khách hàng (Health score)
| Yếu tố | Dấu hiệu tốt | Dấu hiệu xấu |
|---|---|---|
| Chuyên cần | ≥ 90% buổi tham gia | Vắng 2 buổi liên tiếp |
| CSAT gần nhất | ≥ 4/5 | ≤ 3/5 |
| Tiến độ lộ trình | Đúng hoặc vượt kế hoạch | Chậm > 2 tuần |
| Tương tác phụ huynh | Phản hồi tin nhắn | Không phản hồi > 14 ngày |
| Khiếu nại | Không có ticket mở | Có khiếu nại đang mở |
| Thanh toán | Đúng hạn | Trễ kỳ thanh toán |

- **Xanh**: duy trì điểm chạm bình thường. **Vàng**: CSKH gọi hỏi thăm trong 3 ngày. **Đỏ**: gọi trong 24h, báo trưởng CSKH, cân nhắc họp 3 bên (phụ huynh – cố vấn – CSKH).

### A8. Chỉ số đo lường (KPI) đề xuất
| KPI | Mục tiêu ban đầu |
|---|---|
| Thời gian phản hồi đầu tiên (giờ làm việc) | ≤ 4 giờ với ticket thường; 95% đúng SLA |
| Thời gian xử lý xong | 90% đúng SLA |
| CSAT sau phiên | ≥ 4,5/5 |
| NPS hằng quý | ≥ 50 |
| Tỉ lệ điểm chạm làm đúng hạn | ≥ 95% |
| Tỉ lệ gia hạn | ≥ 60% (theo dõi theo từng gói) |
| Tỉ lệ khách rời bỏ giữa gói | ≤ 5% |
| Số khiếu nại / 100 học sinh / tháng | Giảm dần theo tháng |

### A9. Nhịp vận hành
- **Hằng ngày**: đầu ngày mở dashboard xem việc tự sinh, ticket sắp trễ, khách Đỏ; cuối ngày cập nhật kết quả, không để ticket "treo" không ghi chú.
- **Hằng tuần** (họp 30 phút): rà khách Đỏ, khiếu nại, ticket quá hạn, gói sắp hết hạn; phân bổ lại khối lượng.
- **Hằng tháng**: báo cáo KPI cho ban giám đốc; phân tích nguyên nhân khiếu nại và lý do không gia hạn; cập nhật kịch bản, FAQ; phản hồi cho đội bán hàng và đội chuyên môn.

### A10. Nhân sự & định biên
- **Giai đoạn đầu**: 1 trưởng CSKH kiêm xử lý trực tiếp. Tham khảo: **1 nhân viên CSKH phụ trách khoảng 100–150 gia đình đang hoạt động**, điều chỉnh theo khối lượng thực tế.
- **Tố chất khi tuyển**: thấu cảm, giọng nói và cách nhắn tin chuẩn mực với phụ huynh, kỷ luật ghi chép, bình tĩnh khi bị phàn nàn.
- **Đào tạo bắt buộc**: hiểu sản phẩm 3 tầng và đọc được báo cáo ở mức tổng quan; dùng hệ thống; bộ kịch bản; quy tắc bảo mật dữ liệu trẻ em; **nhận diện dấu hiệu an toàn** và cách chuyển M14.
- **Thưởng**: theo KPI (CSAT, đúng SLA, tỉ lệ gia hạn), tách bạch với hoa hồng bán hàng của CTV.

### A11. Bộ tài liệu chuẩn cần soạn trước khi vận hành
1. Kịch bản: cuộc gọi chào mừng · giải thích báo cáo · tư vấn gia hạn · xử lý khiếu nại · gọi khách Đỏ · khảo sát khách rời bỏ.
2. Mẫu tin nhắn Zalo/SMS cho từng điểm chạm.
3. FAQ cho phụ huynh (công khai trên web) và FAQ nội bộ.
4. Chính sách công khai: đổi lịch, hủy buổi, đổi chuyên gia, hoàn tiền, bảo mật dữ liệu.
5. Quy tắc ứng xử và bảo mật cho CSKH.

### A12. Sáu quy tắc vàng cho đội CSKH và đội bán hàng
1. **Không hứa kết quả** (điểm số, đỗ trường cụ thể). Chỉ cam kết quy trình và sự đồng hành.
2. **Không chia sẻ** nội dung tâm lý của học sinh, kể cả với phụ huynh, nếu cố vấn chưa cho phép.
3. **Không nhận tiền cá nhân**, không hướng dẫn khách chuyển tiền vào tài khoản cá nhân.
4. **Ghi lại mọi trao đổi** vào hệ thống.
5. **Phản hồi trong SLA**, kể cả khi chưa có lời giải.
6. **Không tự xử lý tình huống an toàn**: chuyển ngay theo quy trình M14.

---

## 14. PHỤ LỤC B – TỔNG HỢP QUYẾT ĐỊNH ĐÃ CHỐT (v1.0)

> Bảng này là **nguồn quyết định chính thức**. Nếu chỗ nào trong thân tài liệu còn ghi khác, lấy theo bảng này.

### B1. Phạm vi & nội dung
| # | Nội dung | Quyết định |
|---|---|---|
| 1 | Cấp lớp giai đoạn đầu | Lớp 1–12 (mở dần theo môn × lớp khi nội dung duyệt xong) |
| 2 | Môn học | Toán, Lý, Hóa, Anh, Văn |
| 3 | Phạm vi địa lý | Online toàn quốc; trực tiếp nơi có trung tâm/đội ngũ |
| 4 | Quy mô 6 tháng đầu | Dưới 100 học sinh đang học |
| 5 | Chạy thử | Sau 4–6 tháng |
| 6 | Ứng dụng | Web (PWA) trước, app di động sau |
| 7 | Số hóa chương trình | AI soạn, giáo viên rà, duyệt cuối như câu 9 |
| 8 | Bộ SGK | Kết nối tri thức với cuộc sống / bộ SGK thống nhất toàn quốc |
| 9 | Bộ công cụ & câu hỏi | AI soạn dựa trên tri thức chuyên gia hàng đầu, giáo viên giỏi và bộ SGK thống nhất; **Cố vấn Tracie Anh duyệt cuối** rồi giao lập trình viên |
| 10 | Người duyệt chuyên môn từng mảng | Mỗi môn/mảng chọn **1 gia sư Cấp 3 làm trưởng môn kiêm duyệt** (vai trò `SUBJECT_LEAD`, trả thù lao theo khối lượng duyệt); **Cố vấn Tracie Anh duyệt cuối** |
| 11 | Chuyên gia tâm lý (quy trình an toàn) | Đã có người phụ trách |

### B2. Chuyên gia & cách học
| # | Nội dung | Quyết định |
|---|---|---|
| 12 | Hình thức hợp tác | Cộng tác viên, trả theo buổi |
| 13 | Đặt giá | Nền tảng đặt giá cố định theo **cấp chuyên gia** |
| 14 | Thù lao chuyên gia | **Cố định theo buổi + thưởng KPI** (không trả theo %). Thù lao cố định theo cấp × hình thức × kiểu lớp; thưởng KPI **tối đa 10%** tổng thù lao cố định, **xét theo quý**, theo 4 tiêu chí: tiến bộ học sinh, kỷ luật, CSAT, giữ chân/gia hạn (xem M11) |
| 15 | Kỳ chi trả chuyên gia | Mỗi tháng 1 lần |
| 16 | Học sinh tối đa/cố vấn | 15–20 (hệ thống chặn ở 20, cấu hình được) |
| 17 | Xếp lịch | Kết hợp: hướng nghiệp & tầm soát do Admin xếp; buổi định kỳ phụ huynh tự chọn |
| 18 | Kiểu lớp | 1 kèm 1, nhóm nhỏ, nhóm lớn – phụ huynh chọn; nhóm **đủ sĩ số mới khai giảng** |
| 19 | Hình thức học | Online Zoom, tại trung tâm, tại nhà học sinh – chọn theo từng buổi |
| 20 | Giá theo hình thức | Online rẻ nhất < tại trung tâm < tại nhà học sinh cao nhất |
| 21 | Đổi hình thức | Bất cứ lúc nào nếu hai bên đồng ý; hệ thống tự tính chênh lệch |
| 22 | Ghi hình Zoom | Ghi **tất cả** để kiểm soát chất lượng; đồng ý ngay khi đăng ký |
| 23 | Tài khoản Zoom | Zoom trả phí của công ty, hệ thống tự tạo phòng |

### B3. Gói, giá & thanh toán
| # | Nội dung | Quyết định |
|---|---|---|
| 24 | Bảng giá | Dùng **khung hệ số** ở B6; **giá gốc khảo sát thị trường rồi chốt**, Admin nhập vào hệ thống (không ảnh hưởng lập trình) |
| 25 | Kỳ đóng tiền | Theo tháng + ưu đãi đóng dài: **3 tháng giảm 3%, 6 tháng giảm 7%, 12 tháng giảm 12%** |
| 26 | Hoàn tiền | Hoàn 100% phần chưa học nếu yêu cầu trong **14 ngày đầu**; sau đó chỉ bảo lưu. Thời gian giữ hoa hồng = 14 ngày |
| 27 | Dời/hủy buổi | Báo trước **12 giờ** được dời; tối đa **2 lần/tháng/môn**; vắng không báo tính là đã học |
| 28 | Cổng thanh toán | Chưa có – xem tư vấn B7 |
| 29 | Pháp nhân | **Công ty All Your Life (OYLG)** |

### B4. Bán hàng & CSKH
| # | Nội dung | Quyết định |
|---|---|---|
| — | Hoa hồng | CTV 10%, Leader 5%, Leader tự bán 15%; cơ sở = max(kỳ đầu, 6 tháng phí); chi dần theo tiền thu; không tính gia hạn; mua thêm do CSKH tư vấn không tính, do CTV tư vấn tính như đơn mới; CTV tự mua được tính; tính trên toàn bộ học phí |
| 30 | Quy đổi "6 tháng phí" | Đồng ý: tháng × 6; buổi/tuần × đơn giá × 26; trọn gói = giá gói |
| 31 | Giữ khách cho CTV | **30 ngày** |
| 32 | Thẩm quyền xử lý khiếu nại | **Mọi hoàn tiền do Ban giám đốc duyệt**; CSKH tặng tối đa 1 buổi bù, trưởng CSKH tối đa 2 buổi |
| 33 | Kênh CSKH | Chưa có Zalo OA và hotline – **cần lập** |
| 33b | Giờ CSKH | **24/7 bằng AI**, có người quản lý hệ thống AI |
| 33c | AI chuyển người | Nhân viên xử lý **trong giờ làm việc**; tình huống an toàn có các bước tự động tối thiểu (19.1) |
| 34 | Đào tạo CTV | Bắt buộc đạt bài kiểm tra mới được kích hoạt |

### B5. Dữ liệu, thương hiệu, kỹ thuật
| # | Nội dung | Quyết định |
|---|---|---|
| 35 | Phụ huynh xem tâm lý | Bản tóm tắt của cố vấn |
| 36 | Tài khoản học sinh | Từ lớp 6 có tài khoản riêng |
| 37 | Máy chủ & AI | Máy chủ tại Việt Nam; AI quốc tế chỉ với dữ liệu ẩn danh |
| 38 | Thương hiệu | Đã có tên, logo, tên miền (cần gửi file cho đội lập trình) |
| 39 | Nhượng quyền | Dùng chung một nền tảng (multi-tenant) |
| 40 | Nội trú/bán trú | **Cần ngay** – thêm M21 |
| 41 | Đội lập trình | Nội bộ, **JavaScript/TypeScript** |
| 42 | Ngân sách MVP | **Dưới 300 triệu** |
| 43 | Nền tảng tham khảo | (bỏ qua) |
| 44 | Tuyệt đối không | Gia sư liên hệ riêng phụ huynh; gửi quá nhiều tin cho phụ huynh; AI gửi nội dung chưa duyệt; thu tiền ngoài nền tảng |
| 45 | Chỉ số buổi sáng | Doanh thu & học sinh mới; học sinh cần can thiệp; chất lượng dịch vụ; tiến bộ học tập |

### B6. Khung giá đề xuất (theo câu 24)
> **Đây là cấu trúc giá và hệ số tham khảo để hệ thống tính giá tự động. Con số giá gốc là ví dụ minh họa, chưa khảo sát thị trường; ban điều hành cần khảo sát và chốt.**

**Công thức**: Giá 1 buổi/học sinh = **Giá gốc** × hệ số **cấp chuyên gia** × hệ số **cấp học** × hệ số **hình thức** × hệ số **kiểu lớp**

| Yếu tố | Mức | Hệ số đề xuất |
|---|---|---|
| Cấp chuyên gia | Cấp 1 / Cấp 2 / Cấp 3 | 1,0 / 1,3 / 1,7 |
| Cấp học | Tiểu học / THCS / THPT / Luyện thi lớp 9, 12 | 0,8 / 1,0 / 1,2 / 1,4 |
| Hình thức | Online / Tại trung tâm / Tại nhà | 1,0 / 1,2 / 1,5 |
| Kiểu lớp | 1 kèm 1 / Nhóm nhỏ (2–5) / Nhóm lớn (6–20) | 1,0 / 0,6 / 0,35 |

*Ví dụ minh họa*: nếu giá gốc buổi 90 phút là X đồng, thì gia sư Cấp 2, THPT, tại nhà, 1 kèm 1 = X × 1,3 × 1,2 × 1,5 × 1,0 = **2,34X**; cùng gia sư đó dạy online nhóm nhỏ = X × 1,3 × 1,2 × 1,0 × 0,6 = **0,94X** mỗi học sinh.

**Các gói khác** (giá chốt sau): Hướng nghiệp (trọn gói: phiên + báo cáo); Tầm soát (1 môn / 3 môn / toàn diện 3 mặt); Cố vấn cuộc sống theo tháng (1/2/3 buổi mỗi tuần, gói toàn diện); Nội trú/bán trú theo tháng (phòng + ăn + giám sát tự học). Hệ thống lưu bảng giá trong `price_matrix` có ngày hiệu lực, nên chỉnh giá không cần lập trình lại.

### B7. Tư vấn cổng thanh toán (theo câu 28)
- **Giai đoạn đầu: PayOS** (chuyển khoản VietQR, tự đối soát theo mã đơn qua webhook). Ưu điểm: phí thấp, tiền về thẳng tài khoản ngân hàng doanh nghiệp của OYLG, tích hợp nhanh, phụ huynh quen chuyển khoản. Cần: tài khoản ngân hàng doanh nghiệp, đăng ký PayOS bằng pháp nhân OYLG.
- **Giai đoạn 2: thêm VNPay** cho phụ huynh muốn trả bằng thẻ hoặc trả góp.
- **Hóa đơn điện tử**: giai đoạn đầu kế toán xuất tay; giai đoạn 2 tích hợp nhà cung cấp hóa đơn điện tử (MISA, Viettel, VNPT…).
- **Zalo OA**: cần lập và **xác thực OA doanh nghiệp** để dùng Zalo ZNS gửi thông báo, và để trợ lý AI CSKH trả lời trên Zalo.

### B8. Các việc mở ở v0.9 – đã chốt ở v1.0
| # | Việc | Quyết định |
|---|---|---|
| 1 | Thù lao chuyên gia | Cố định theo buổi + thưởng KPI tối đa 10%/quý (4 tiêu chí) – xem M11. Học sinh vắng không báo: gia sư vẫn được trả; gia sư hủy sát giờ: không trả buổi đó và buổi bù |
| 2 | Giá gốc | Khảo sát thị trường rồi chốt; Admin nhập vào bảng giá (không chặn lập trình) |
| 2b | Ưu đãi đóng dài | 3 tháng −3%, 6 tháng −7%, 12 tháng −12% |
| 3 | Người duyệt từng môn/mảng | Gia sư Cấp 3 làm trưởng môn kiêm duyệt; Tracie Anh duyệt cuối |
| 4 | Tên, tên miền, logo | Chủ dự án gửi trực tiếp cho đội lập trình; tài liệu tạm dùng tên OYLG |
| 5 | Chi phí vận hành hạ tầng | **10–20 triệu/tháng** (chưa gồm lương) cho giai đoạn dưới 100 học sinh |
| 5b | Thời hạn lưu bản ghi hình | Hết gói học + 30 ngày, sau đó tự xóa |
| 6 | Kiểm tra pháp lý | **Bộ phận pháp chế nội bộ** OYLG phụ trách: ngành nghề kinh doanh, hợp đồng CTV (tránh rủi ro đa cấp), điều kiện cơ sở nội trú, chính sách bảo vệ dữ liệu trẻ em |

### B9. Còn chờ đầu vào (không chặn việc lập trình)
1. **Giá gốc** sau khảo sát thị trường và **mức thù lao cố định** theo cấp × hình thức × kiểu lớp: Admin nhập qua màn hình cấu hình.
2. **Tên nền tảng, tên miền, file logo**: gửi cho đội lập trình trước khi làm giao diện.
3. Kết quả rà soát của **pháp chế nội bộ**: cần trước khi chạy thử với học sinh thật.

---
*Tài liệu được tổng hợp từ ghi âm yêu cầu của chủ dự án, yêu cầu bổ sung bằng văn bản, các câu trả lời trong buổi hỏi đáp chốt yêu cầu và các đề xuất kỹ thuật, vận hành. Các mục [ĐX] còn lại cần được chủ dự án xác nhận trước khi đưa vào sprint.*
