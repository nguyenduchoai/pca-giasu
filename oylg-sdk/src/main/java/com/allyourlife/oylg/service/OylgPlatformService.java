package com.allyourlife.oylg.service;

import com.allyourlife.oylg.entity.OylgAuthorizedPickup;
import com.allyourlife.oylg.entity.OylgBoardingCheckin;
import com.allyourlife.oylg.entity.OylgConsultationLead;
import com.allyourlife.oylg.entity.OylgCurriculumUnit;
import com.allyourlife.oylg.entity.OylgEcommerceOrderWallet;
import com.allyourlife.oylg.entity.OylgExpertProfile;
import com.allyourlife.oylg.entity.OylgGroupClass;
import com.allyourlife.oylg.entity.OylgLearningCase;
import com.allyourlife.oylg.entity.OylgLessonRecord;
import com.allyourlife.oylg.entity.OylgMasteryState;
import com.allyourlife.oylg.entity.OylgQuestionItem;
import com.allyourlife.oylg.entity.OylgResidency;
import com.allyourlife.oylg.entity.OylgSafetyFlag;
import com.allyourlife.oylg.entity.OylgServicePackage;
import com.allyourlife.oylg.entity.OylgStudentProfile;
import com.allyourlife.oylg.repository.OylgAuthorizedPickupRepository;
import com.allyourlife.oylg.repository.OylgBoardingCheckinRepository;
import com.allyourlife.oylg.repository.OylgConsultationLeadRepository;
import com.allyourlife.oylg.repository.OylgCurriculumUnitRepository;
import com.allyourlife.oylg.repository.OylgEcommerceOrderWalletRepository;
import com.allyourlife.oylg.repository.OylgExpertProfileRepository;
import com.allyourlife.oylg.repository.OylgGroupClassRepository;
import com.allyourlife.oylg.repository.OylgLearningCaseRepository;
import com.allyourlife.oylg.repository.OylgLessonRecordRepository;
import com.allyourlife.oylg.repository.OylgMasteryStateRepository;
import com.allyourlife.oylg.repository.OylgQuestionItemRepository;
import com.allyourlife.oylg.repository.OylgResidencyRepository;
import com.allyourlife.oylg.repository.OylgSafetyFlagRepository;
import com.allyourlife.oylg.repository.OylgServicePackageRepository;
import com.allyourlife.oylg.repository.OylgStudentProfileRepository;
import com.tvd12.ezyfox.bean.annotation.EzyAutoBind;
import com.tvd12.ezyfox.bean.annotation.EzySingleton;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@EzySingleton
public class OylgPlatformService {

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    @EzyAutoBind
    private OylgStudentProfileRepository studentRepo;
    @EzyAutoBind
    private OylgExpertProfileRepository expertRepo;
    @EzyAutoBind
    private OylgCurriculumUnitRepository unitRepo;
    @EzyAutoBind
    private OylgMasteryStateRepository masteryRepo;
    @EzyAutoBind
    private OylgLearningCaseRepository caseRepo;
    @EzyAutoBind
    private OylgLessonRecordRepository lessonRepo;
    @EzyAutoBind
    private OylgSafetyFlagRepository safetyRepo;
    @EzyAutoBind
    private OylgServicePackageRepository packageRepo;
    @EzyAutoBind
    private OylgEcommerceOrderWalletRepository orderRepo;
    @EzyAutoBind
    private OylgConsultationLeadRepository leadRepo;
    @EzyAutoBind
    private OylgQuestionItemRepository questionRepo;
    @EzyAutoBind
    private OylgGroupClassRepository groupClassRepo;
    @EzyAutoBind
    private OylgResidencyRepository residencyRepo;
    @EzyAutoBind
    private OylgAuthorizedPickupRepository pickupRepo;
    @EzyAutoBind
    private OylgBoardingCheckinRepository checkinRepo;
    @EzyAutoBind
    private OylgPricingService pricingService;
    @EzyAutoBind
    private OylgCommissionService commissionService;
    @EzyAutoBind
    private OylgGuardrailService guardrailService;

    private volatile boolean seeded = false;

    public synchronized void ensureSeeded() {
        if (seeded) {
            return;
        }
        if (studentRepo.count() > 0) {
            seeded = true;
            return;
        }
        LocalDateTime now = LocalDateTime.now();

        // 1. Students
        OylgStudentProfile s1 = buildStudent(
            "HS-2026-0089", "Nguyễn Minh Khôi", "Chị Nguyễn Thị Lan", "0905123489",
            9, "THCS Nguyễn Du · TP. Buôn Ma Thuột",
            "THPT Chuyên Nguyễn Du → ĐH Bách Khoa TP.HCM",
            "Kỹ sư Trí tuệ Nhân tạo & Khoa học Dữ liệu", "I-R-C",
            18, 14, 620, "FOCUSED", "Dị ứng tôm, cua biển", now
        );
        studentRepo.save(s1);

        OylgStudentProfile s2 = buildStudent(
            "HS-2026-0104", "Trần Bảo Ngọc", "Anh Trần Quốc Tuấn", "0912456745",
            11, "THPT Chuyên Nguyễn Du · Đắk Lắk",
            "ĐH Y Dược TP.HCM",
            "Bác sĩ Đa khoa / Tâm lý Lâm sàng", "I-S-A",
            14, 9, 440, "TIRED", "Không dị ứng · Đang thiếu ngủ (5.6h/đêm)", now
        );
        studentRepo.save(s2);

        OylgStudentProfile s3 = buildStudent(
            "HS-2026-0118", "Lê Hoàng Gia Bảo", "Chị Lê Minh Phương", "0988312678",
            4, "Tiểu học Quốc tế · TP. Buôn Ma Thuột",
            "THCS Chất lượng cao",
            "Khám phá Khoa học Tự nhiên & Lắp ráp Robot", "R-I-A",
            22, 21, 890, "FOCUSED", "Dị ứng đậu phộng", now
        );
        studentRepo.save(s3);

        // 2. Experts
        expertRepo.save(buildExpert(
            "EXP-01", "Cố vấn Tracie Anh",
            "Chủ tịch Hội đồng Chuyên môn & Thẩm định Học liệu",
            "CAREER_EXPERT", "MASTER", "Hướng nghiệp B1–B4, Thẩm định YCCĐ",
            "Trực tiếp kiểm duyệt 100% báo cáo định hướng và ngân hàng câu hỏi trước khi gửi tới gia đình.",
            "Đã đồng hành 320 học sinh · Kiểm duyệt 100% báo cáo R1–R4",
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=640&q=80",
            "co-van-tracie-anh", new BigDecimal("350000"), 320, new BigDecimal("5.00"), now
        ));
        expertRepo.save(buildExpert(
            "EXP-02", "ThS. Lê Minh Tâm",
            "Cố vấn Cuộc sống Trưởng · Tâm lý Học đường",
            "LIFE_COACH", "SENIOR", "Tầm soát 3 mặt, Đồng hành Kỹ năng sống",
            "Đồng hành nhịp sinh hoạt, giải tỏa áp lực điểm số và điều phối lộ trình 60/40 giữa gia đình và gia sư.",
            "94% học sinh xác định rõ mục tiêu và lấy lại nhịp tự giác sau 8 tuần",
            "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=640&q=80",
            "ths-le-minh-tam", new BigDecimal("300000"), 185, new BigDecimal("4.96"), now
        ));
        expertRepo.save(buildExpert(
            "EXP-03", "Thầy Đặng Quốc Việt",
            "Trưởng Bộ môn Toán THCS & THPT (GDPT 2018)",
            "SUBJECT_LEAD", "MASTER", "Toán Đại số & Hình học Lớp 6–12",
            "Chuyên xử lý đứt gãy kiến thức gốc Đại số Lớp 7–9 và ôn thi tuyển sinh Lớp 10 Chuyên.",
            "Trung bình +2.4 điểm Toán trên lớp sau 8 tuần bù lỗ hổng gốc",
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=640&q=80",
            "thay-dang-quoc-viet", new BigDecimal("320000"), 240, new BigDecimal("4.96"), now
        ));
        expertRepo.save(buildExpert(
            "EXP-04", "Cô Lê Bảo Trâm",
            "Trưởng Bộ môn Tiếng Anh Học thuật & Ngữ văn",
            "SUBJECT_LEAD", "SENIOR", "Tiếng Anh Tiểu học–THPT & IELTS nền tảng",
            "Xây dựng phản xạ ngôn ngữ và hệ thống hóa ngữ pháp gốc từ Tiểu học đến THPT.",
            "91% học sinh đạt mục tiêu điểm kiểm tra học kỳ sau 6 tuần",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=640&q=80",
            "co-le-bao-tram", new BigDecimal("280000"), 195, new BigDecimal("4.94"), now
        ));

        // 3. Unified SSOT Packages (1.800.000 / 4.500.000 / 13.980.000, Base B6 = 200.000)
        packageRepo.save(buildPkg(
            "PKG-T1-CAREER", "TIER_1_CAREER", "Tầng 1 · Hướng nghiệp",
            "Gói Khám Phá Hướng Nghiệp & Bản Đồ Thành Công",
            "Đánh giá thiên hướng nghề nghiệp RIASEC + Big Five, giá trị cốt lõi và 2 buổi tham vấn 1-1 cùng chuyên gia.",
            "Bài trắc nghiệm RIASEC & Big Five chuẩn hóa|2 buổi tham vấn 1-1 cùng Chuyên gia Hướng nghiệp|Bản đồ Thành công R1 (trường, tổ hợp môn, ngành đích)",
            2, 1, BigDecimal.ZERO,
            new BigDecimal("2100000"), new BigDecimal("1800000"), new BigDecimal("1800000"),
            false, now
        ));
        packageRepo.save(buildPkg(
            "PKG-T12-COACH", "TIER_2_SCREENING", "Tầng 1 & 2 · Phổ biến nhất",
            "Gói Hướng Nghiệp + Tầm Soát 3 Mặt & Cố Vấn (12 buổi)",
            "Bao gồm toàn bộ Tầng 1, tầm soát lỗ hổng 5 môn chuẩn GDPT 2018, sức khỏe tinh thần - thể chất và 12 buổi đồng hành.",
            "Truy vết lỗ hổng gốc 5 môn từ lớp dưới (GDPT 2018)|Đánh giá B3 sức khỏe tinh thần, giấc ngủ & động lực học|12 buổi đồng hành 1-1 cùng Cố vấn Cuộc sống & Chuyên gia",
            12, 3, new BigDecimal("3.00"),
            new BigDecimal("4800000"), new BigDecimal("4500000"), new BigDecimal("9000000"),
            true, now
        ));
        packageRepo.save(buildPkg(
            "PKG-T3-TUTOR-6M", "TIER_3_COMPANION", "Tầng 3 · Bù hổng 60/40",
            "Gói Đồng Hành Chuyên Gia Bộ Môn (6 tháng · 48 buổi)",
            "Kèm sát theo phác đồ 60% bù lỗ hổng gốc lớp dưới + 40% bám sát bài hiện tại. Đổi linh hoạt Zoom / Trung tâm / Tại nhà từng buổi.",
            "Nạp 48 buổi vào Ví buổi học của con (đã ưu đãi 7% kỳ 6 tháng)|Đổi linh hoạt Online Zoom ↔ Trung tâm ↔ Tại nhà từng buổi|Bảo lãnh hoàn tiền 100% số buổi chưa học trong 14 ngày đầu",
            48, 6, new BigDecimal("7.00"),
            new BigDecimal("15030000"), new BigDecimal("13980000"), new BigDecimal("13980000"),
            false, now
        ));
        packageRepo.save(buildPkg(
            "PKG-ADDON-12S", "TIER_3_ADDON", "Nạp lẻ linh hoạt",
            "Gói Nạp Thêm 12 Buổi Gia Sư Bộ Môn 1-1",
            "Dành cho gia đình muốn bổ sung thêm buổi học ôn thi học kỳ hoặc tăng tốc bù hổng ngắn hạn.",
            "Cộng ngay 12 buổi vào Ví buổi học|Giữ nguyên quyền đổi hình thức học từng buổi|Hoàn 100% buổi chưa học trong 14 ngày đầu",
            12, 1, BigDecimal.ZERO,
            new BigDecimal("3840000"), new BigDecimal("3600000"), new BigDecimal("3600000"),
            false, now
        ));
        packageRepo.save(buildPkg(
            "PKG-BOARDING-1M", "BOARDING", "Nội trú & Bán trú M21",
            "Gói Bán Trú & Đưa Đón QR An Toàn (1 tháng)",
            "Chăm sóc dinh dưỡng tách dị ứng, nghỉ trưa, tự học có cố vấn giám sát buổi tối và xác thực người đón bằng QR.",
            "Điểm danh QR 4 mốc tự động báo về điện thoại Phụ huynh|Thực đơn riêng theo hồ sơ dị ứng thực phẩm của con|Chỉ bàn giao học sinh cho người đón đã xác thực CCCD & ảnh",
            24, 1, BigDecimal.ZERO,
            new BigDecimal("4800000"), new BigDecimal("4500000"), new BigDecimal("4500000"),
            false, now
        ));

        // 4. Curriculum Units & Mastery Heatmap (GDPT 2018)
        saveUnitAndMastery(s1.getId(), "TOAN.06.PS.01", "MATH", 6, "",
            "Quy đồng mẫu số và cộng trừ phân số",
            "Thực hiện phép cộng, trừ phân số không cùng mẫu (suy luận đạt từ lớp trên).",
            6, 90, "INFERRED_MASTERED", false, now);
        saveUnitAndMastery(s1.getId(), "TOAN.07.SHT.02", "MATH", 7, "TOAN.06.PS.01",
            "Các phép tính với số hữu tỉ và lũy thừa",
            "Vận dụng quy tắc lũy thừa của một tích, thương với số mũ tự nhiên.",
            7, 82, "MASTERED", false, now);
        saveUnitAndMastery(s1.getId(), "TOAN.07.TLT.04", "MATH", 7, "TOAN.07.SHT.02",
            "Tính chất dãy tỉ số bằng nhau",
            "Giải bài toán chia tỉ lệ bằng tính chất dãy tỉ số bằng nhau.",
            7, 76, "MASTERED", false, now);
        saveUnitAndMastery(s1.getId(), "TOAN.08.HDT.01", "MATH", 8, "TOAN.07.SHT.02",
            "7 Hằng đẳng thức đáng nhớ & Phân tích đa thức thành nhân tử",
            "Điểm đứt gãy gốc khiến học sinh sai dấu khi rút gọn căn thức ở Lớp 9.",
            9, 32, "ROOT_GAP", true, now);
        saveUnitAndMastery(s1.getId(), "TOAN.08.PTB1.03", "MATH", 8, "TOAN.08.HDT.01",
            "Phương trình bậc nhất một ẩn & phương trình quy về bậc nhất",
            "Hệ quả chưa đạt do hổng phân tích nhân tử ở TOAN.08.HDT.01.",
            9, 38, "CONSEQUENCE_GAP", false, now);
        saveUnitAndMastery(s1.getId(), "TOAN.09.CBH.01", "MATH", 9, "TOAN.08.HDT.01",
            "Biến đổi đơn giản và rút gọn biểu thức chứa căn thức bậc hai",
            "Áp dụng hằng đẳng thức căn(A^2) = |A| và trục căn thức ở mẫu.",
            10, 24, "CONSEQUENCE_GAP", false, now);
        saveUnitAndMastery(s1.getId(), "TOAN.09.HPT.02", "MATH", 9, "TOAN.08.PTB1.03",
            "Giải hệ hai phương trình bậc nhất hai ẩn & Định lý Vi-ét",
            "Giải hệ phương trình bằng phương pháp thế và cộng đại số.",
            10, 42, "CONSEQUENCE_GAP", false, now);

        // 5. Learning Cases
        caseRepo.save(buildCase(
            "CASE-2026-0089", s1.getId(), "TIER_3_COMPANION", "YELLOW",
            new BigDecimal("9.5"), new BigDecimal("14.0"), 96, 60, 40,
            "Khôi chia sẻ lo bố mẹ thất vọng nếu không đỗ Chuyên Nguyễn Du. Mức căng thẳng thi cử cần theo dõi nhẹ, không quá tải.",
            "Con có tinh thần tự giác tốt, tuần này cần khích lệ nỗ lực lấp nền Đại số Lớp 8 thay vì so sánh điểm kiểm tra trên lớp.",
            now
        ));
        caseRepo.save(buildCase(
            "CASE-2026-0104", s2.getId(), "TIER_3_COMPANION", "RED",
            new BigDecimal("19.5"), new BigDecimal("15.0"), 82, 50, 50,
            "Bảo Ngọc ngủ trung bình 5.6h/đêm trong 2 tuần liên tiếp do lịch học thêm ngoài dày. Đã đề xuất giảm 50% bài về nhà.",
            "Lịch học tuần này của con đang vượt ngưỡng khuyến nghị 15h/tuần; Cố vấn đề xuất giảm tải bài tập tối để con ngủ đủ giấc.",
            now
        ));
        caseRepo.save(buildCase(
            "CASE-2026-0118", s3.getId(), "TIER_2_SCREENING", "GREEN",
            new BigDecimal("4.5"), new BigDecimal("8.0"), 100, 30, 70,
            "Gia Bảo hào hứng với các bài toán tư duy hình ảnh và thuyết trình Khoa học bằng Tiếng Anh.",
            "Con duy trì nhịp học đều đặn, hào hứng và hoàn thành trọn vẹn các thử thách tư duy trong tuần.",
            now
        ));

        // 6. Lessons (Scheduled + Completed)
        lessonRepo.save(buildLesson(
            1L, s1.getId(), "Nguyễn Minh Khôi", "Thầy Đặng Quốc Việt",
            "Toán Lớp 9 (Bù hổng Lớp 8)", "TOAN.08.HDT.01",
            "Bổ trợ Hằng đẳng thức & Rút gọn căn thức bậc hai",
            "Thứ Năm, 19:30 – 21:00", "Phòng P204 · Trung tâm OYLG Buôn Ma Thuột",
            "AT_CENTER", "SCHEDULED", "MASTERED", "Tập trung cao", 5,
            new BigDecimal("384000"), "", "", 0, now
        ));
        lessonRepo.save(buildLesson(
            1L, s1.getId(), "Nguyễn Minh Khôi", "ThS. Lê Minh Tâm",
            "Cố vấn Cuộc sống", "B3.LIFE.BALANCE",
            "Rà soát lộ trình tháng & Cân bằng nhịp ôn thi Lớp 9",
            "Thứ Bảy, 09:00 – 10:00", "Zoom trực tuyến (ID: 982 341 2009)",
            "ONLINE_ZOOM", "SCHEDULED", "MASTERED", "Bình thường", 5,
            new BigDecimal("260000"), "", "", 0, now
        ));
        lessonRepo.save(buildLesson(
            2L, s2.getId(), "Trần Bảo Ngọc", "Thầy Đặng Quốc Việt",
            "Toán Lớp 11", "TOAN.11.LG.01",
            "Phương trình lượng giác cơ bản & Giảm tải bài về nhà",
            "Thứ Sáu, 19:30 – 21:00", "Zoom trực tuyến (ID: 982 341 2088)",
            "ONLINE_ZOOM", "SCHEDULED", "PARTIAL", "Hơi mệt", 4,
            new BigDecimal("408000"), "", "", 0, now
        ));
        lessonRepo.save(buildLesson(
            3L, s3.getId(), "Lê Hoàng Gia Bảo", "Cô Lê Bảo Trâm",
            "Tiếng Anh & Toán Tư duy Lớp 4", "ENG.04.SPK.02",
            "Phản xạ giao tiếp chủ đề Khoa học & Toán có lời văn",
            "Chủ Nhật, 08:30 – 10:00", "Phòng P102 · Trung tâm OYLG Buôn Ma Thuột",
            "AT_CENTER", "SCHEDULED", "MASTERED", "Hào hứng", 5,
            new BigDecimal("250000"), "", "", 0, now
        ));

        // Completed logs
        lessonRepo.save(buildLesson(
            1L, s1.getId(), "Nguyễn Minh Khôi", "Thầy Đặng Quốc Việt",
            "Toán Lớp 9", "TOAN.08.HDT.01",
            "Nắm vững 3 hằng đẳng thức đầu tiên qua sơ đồ diện tích",
            "06/11/2026 · 21:05", "Phòng P204",
            "AT_CENTER", "COMPLETED", "MASTERED", "Tập trung cao", 5,
            new BigDecimal("384000"),
            "Khôi tiếp thu nhanh khi vẽ mô hình diện tích hình vuông; tuần tới chuyển sang căn thức Lớp 9.",
            "Con đã nắm vững 3 hằng đẳng thức đầu tiên và vận dụng đúng vào 4/4 câu rút gọn căn thức cuối buổi. Về nhà con hoàn thành 4 bài trang 18.",
            0, now
        ));
        lessonRepo.save(buildLesson(
            2L, s2.getId(), "Trần Bảo Ngọc", "ThS. Lê Minh Tâm",
            "Cố vấn Cuộc sống", "B3.SLEEP.CHECK",
            "Điều chỉnh thời gian biểu tự học buổi tối",
            "07/11/2026 · 20:30", "Zoom trực tuyến",
            "ONLINE_ZOOM", "COMPLETED", "PARTIAL", "Mệt mỏi", 4,
            new BigDecimal("260000"),
            "Buổi thứ 3 liên tiếp Bảo Ngọc ngủ sau 23:30. Đã thống nhất với gia sư giảm một nửa bài tập tuần này.",
            "Hôm nay con hơi mệt do lịch kiểm tra trên trường dày, thầy cô đã giảm 50% bài tập về nhà để con nghỉ ngơi trước 22:30.",
            0, now
        ));
        lessonRepo.save(buildLesson(
            3L, s3.getId(), "Lê Hoàng Gia Bảo", "Cô Lê Bảo Trâm",
            "Tiếng Anh Lớp 4", "ENG.04.SPK.02",
            "Thuyết trình Hệ Mặt Trời & Toán đố hai bước tính",
            "08/11/2026 · 10:15", "Phòng P102",
            "AT_CENTER", "COMPLETED", "MASTERED", "Tập trung cao", 5,
            new BigDecimal("250000"),
            "Con có tư duy hình ảnh rất tốt, phát âm rõ ràng.",
            "Gia Bảo tự tin thuyết trình 5 câu Tiếng Anh về Hệ Mặt Trời và giải đúng cả 5 bài toán đố tư duy.",
            0, now
        ));

        // 7. Orders
        orderRepo.save(buildOrder(
            "ORD-2026-1089", s1.getId(), "Chị Nguyễn Thị Lan", "0905123489",
            "Nguyễn Minh Khôi", "Gói Đồng Hành Chuyên Gia Bộ Môn (6 tháng · 48 buổi)",
            "OYLG2026", "CTV-A102", new BigDecimal("15030000"), new BigDecimal("1050000"),
            new BigDecimal("13980000"), new BigDecimal("13980000"),
            new BigDecimal("1398000"), new BigDecimal("699000"),
            48, 2, "PAID", now.plusDays(12), now
        ));
        orderRepo.save(buildOrder(
            "ORD-2026-1104", s2.getId(), "Anh Trần Quốc Tuấn", "0912456745",
            "Trần Bảo Ngọc", "Gói Hướng Nghiệp + Tầm Soát 3 Mặt & Cố Vấn (12 buổi)",
            "", "CTV-A102", new BigDecimal("4800000"), new BigDecimal("300000"),
            new BigDecimal("4500000"), new BigDecimal("9000000"),
            new BigDecimal("450000"), new BigDecimal("225000"),
            12, 1, "PAID", now.plusDays(10), now
        ));

        // 8. Leads
        leadRepo.save(buildLead(
            "Chị Nguyễn Thị Lan", "0905123489", "Nguyễn Minh Khôi", 9, "Đắk Lắk",
            "Gói Đồng Hành Chuyên Gia Bộ Môn 60/40 (Toán Lớp 9)", "ONLINE",
            "CTV-A102", "Thầy Đặng Quốc Việt", new BigDecimal("13980000"), "PAID", now
        ));
        leadRepo.save(buildLead(
            "Anh Hoàng Văn Đức", "0918234534", "Hoàng Gia Hân", 8, "Đắk Lắk",
            "Gói Hướng Nghiệp + Tầm Soát 3 Mặt & Cố Vấn (12 buổi)", "EVENT",
            "CTV-A102", "ThS. Lê Minh Tâm", new BigDecimal("4500000"), "SCHEDULED", now
        ));
        leadRepo.save(buildLead(
            "Chị Lê Thu Trang", "0982661961", "Phạm Minh Quân", 10, "Gia Lai",
            "Tầm soát lỗ hổng Toán – Lý – Tiếng Anh khối A01", "ONLINE",
            "", "Cố vấn Tracie Anh", new BigDecimal("1800000"), "NEW", now
        ));

        // 9. Studio Questions (B1-B4)
        questionRepo.save(buildQuestion(
            "Q-B2-TOAN09-042", "B2_KNOWLEDGE", "Toán Lớp 9", "TOAN.09.CBH.01 (Tiên quyết: TOAN.08.HDT.01)",
            "Thầy Đặng Quốc Việt",
            "Rút gọn biểu thức chứa căn thức bậc hai với điều kiện x < 3:",
            "P = căn((x - 3)^2) + x - 1",
            "A. P = 2x - 4 (Nhầm dấu giá trị tuyệt đối khi x < 3)|B. P = 2 (Đáp án đúng: |x - 3| = 3 - x)|C. P = 4 - 2x (Nhầm dấu khi thu gọn x)|D. P = x - 4",
            new BigDecimal("0.48"), false, "PENDING_APPROVAL", now
        ));
        questionRepo.save(buildQuestion(
            "Q-B1-RIASEC-019", "B1_CAREER", "Hướng nghiệp B1", "DIM.RIASEC.INVESTIGATIVE",
            "ThS. Lê Minh Tâm",
            "Khi gặp một bài toán hoặc thiết bị công nghệ hoạt động khác thường, phản ứng tự nhiên đầu tiên của em là gì?",
            "",
            "A. Tách nhỏ từng giả thuyết để tìm nguyên nhân gốc (I – Nghiên cứu)|B. Tháo lắp thử nghiệm trực tiếp bằng dụng cụ (R – Thực tế)|C. Phân công nhóm bạn cùng xử lý từng phần (E – Quản lý)|D. Viết hướng dẫn ngắn gọn để bạn khác dễ làm theo (S – Xã hội)",
            new BigDecimal("0.52"), false, "PENDING_APPROVAL", now
        ));
        questionRepo.save(buildQuestion(
            "Q-B3-SAFE-008", "B3_WELLBEING", "Tầm soát Tinh thần B3", "B3.BURNOUT.SLEEP + M14",
            "Hội đồng Tâm lý Học đường",
            "Trong 2 tuần gần đây, tần suất em cảm thấy kiệt sức kéo dài hoặc có suy nghĩ muốn buông xuôi mọi thứ là như thế nào?",
            "",
            "A. Hoàn toàn không có – Em ngủ tốt và sinh hoạt bình thường|B. Thỉnh thoảng 1–2 buổi tối sát ngày kiểm tra|C. Khá thường xuyên (3–4 ngày/tuần) → Gắn cờ THEO DÕI|D. Hầu như mỗi ngày / Có ý nghĩ tự làm đau bản thân → CỜ ĐỎ M14 (111 / 115)",
            new BigDecimal("0.61"), true, "PENDING_APPROVAL", now
        ));
        questionRepo.save(buildQuestion(
            "Q-B2-ANH10-031", "B2_KNOWLEDGE", "Tiếng Anh Lớp 10", "ANH.10.COND3 (Tiên quyết: ANH.08.PAST_PERFECT)",
            "Cô Lê Bảo Trâm",
            "Chọn dạng đúng diễn tả giả định trái với quá khứ: 'If Minh ___ the foundational algebra rules in Grade 8, he would have solved the test.'",
            "",
            "A. mastered|B. had mastered (Đúng – Câu điều kiện loại 3)|C. has mastered|D. would master",
            new BigDecimal("-0.14"), false, "PENDING_APPROVAL", now
        ));

        // 10. Group Classes
        groupClassRepo.save(buildGroupClass(
            "GRP-TOAN09-HDT-01",
            "Nhóm nhỏ Bù nền Đại số Lớp 8 → Căn thức Lớp 9 (Cùng lỗ hổng gốc)",
            "Thầy Đặng Quốc Việt · Zoom trực tuyến",
            "Thứ Ba & Thứ Năm (19:30 – 21:00)",
            "TOAN.08.HDT.01, TOAN.08.PTB1.03, TOAN.09.CBH.01",
            3, 3, 5, "15/11/2026", "READY", now
        ));
        groupClassRepo.save(buildGroupClass(
            "GRP-ANH08-GRAM-02",
            "Nhóm nhỏ Ngữ pháp Trọng tâm THCS (Thì hoàn thành & Câu bị động)",
            "Cô Lê Bảo Trâm · Phòng P201 Trung tâm BMT",
            "Thứ Bảy & Chủ Nhật (08:30 – 10:00)",
            "ANH.07.PAST_SIMPLE, ANH.08.PRESENT_PERFECT",
            2, 3, 5, "22/11/2026", "WAITING", now
        ));

        // 11. Boarding & Pickups
        residencyRepo.save(buildResidency(
            s1.getId(), "Nguyễn Minh Khôi", 9, "DAY_BOARDING",
            "Phòng Bán trú Nam B2", "Giường #08",
            "Tách riêng thực đơn tôm, cua biển", new BigDecimal("7.8"), now
        ));
        residencyRepo.save(buildResidency(
            s2.getId(), "Trần Bảo Ngọc", 11, "FULL_BOARDING",
            "Phòng Nội trú Nữ N302", "Giường #02",
            "Theo dõi giấc ngủ: trung bình 5.6h/đêm (cần tắt đèn trước 22:30)", new BigDecimal("5.6"), now
        ));

        pickupRepo.save(buildPickup(
            s1.getId(), "Chị Nguyễn Thị Lan", "Mẹ ruột (Chủ tài khoản)",
            "0905123489", "066188***412", "QR-PASS-LAN-0089", true,
            "Đã xác thực CCCD và ảnh chân dung đối chiếu tại quầy", now
        ));
        pickupRepo.save(buildPickup(
            s1.getId(), "Ông Nguyễn Văn Hòa", "Ông ngoại (Đã ủy quyền)",
            "0913445889", "066059***108", "QR-PASS-HOA-0089", true,
            "Đã xác thực giấy ủy quyền của phụ huynh và CCCD", now
        ));
        pickupRepo.save(buildPickup(
            s1.getId(), "Anh Lê Văn Lạ", "Người quen chưa đăng ký trong hồ sơ",
            "0977000111", "Chưa có dữ liệu CCCD", "QR-UNKNOWN-9999", false,
            "Không nằm trong danh sách được phép đón — hệ thống tự động từ chối bàn giao", now
        ));

        checkinRepo.save(buildCheckin(
            s1.getId(), "Nguyễn Minh Khôi", "ARRIVE", "11:40", "VERIFIED_SAFE",
            "Quét thẻ QR học sinh đến khu Bán trú · Đã gửi thông báo cho mẹ (Chị Lan)", now.minusHours(3)
        ));
        checkinRepo.save(buildCheckin(
            s1.getId(), "Nguyễn Minh Khôi", "MEAL", "12:15", "VERIFIED_SAFE",
            "Ăn trưa thực đơn tiêu chuẩn (đã tách riêng món tôm/cua biển theo cảnh báo dị ứng)", now.minusHours(2)
        ));
        checkinRepo.save(buildCheckin(
            s2.getId(), "Trần Bảo Ngọc", "NIGHT_ROLLCALL", "22:30", "VERIFIED_SAFE",
            "Điểm danh tối Phòng Nội trú Nữ N302 · Nhắc tắt đèn nghỉ ngơi đúng giờ", now.minusHours(1)
        ));

        safetyRepo.save(buildSafetyFlag(
            s2.getId(), 2L, "B3_SCREENING", "AMBER",
            "Học sinh ngủ trung bình 5.6h/đêm trong 14 ngày và điểm căng thẳng thi cử ở mức cần theo dõi.",
            "Khuyến nghị Cố vấn Cuộc sống phối hợp giảm 50% lượng bài tập về nhà trong 1 tuần.",
            "PENDING_EXPERT_VERIFY", now
        ));

        seeded = true;
    }

    public List<OylgStudentProfile> getAllStudents() {
        ensureSeeded();
        List<OylgStudentProfile> list = studentRepo.findAll();
        list.sort(Comparator.comparingLong(OylgStudentProfile::getId));
        return list;
    }

    public OylgStudentProfile getStudentOrDefault(Long studentId) {
        ensureSeeded();
        if (studentId != null && studentId > 0) {
            OylgStudentProfile found = studentRepo.findById(studentId);
            if (found != null) {
                return found;
            }
        }
        List<OylgStudentProfile> all = getAllStudents();
        return all.isEmpty() ? null : all.get(0);
    }

    public List<OylgExpertProfile> getAllExperts() {
        ensureSeeded();
        List<OylgExpertProfile> list = expertRepo.findAll();
        list.sort(Comparator.comparingLong(OylgExpertProfile::getId));
        return list;
    }

    public OylgExpertProfile getExpertBySlugOrDefault(String slug) {
        ensureSeeded();
        if (slug != null && !slug.isEmpty()) {
            OylgExpertProfile found = expertRepo.findByLandingPageSlug(slug);
            if (found != null) {
                return found;
            }
        }
        List<OylgExpertProfile> all = getAllExperts();
        return all.isEmpty() ? null : all.get(0);
    }

    public List<OylgServicePackage> getActivePackages() {
        ensureSeeded();
        List<OylgServicePackage> list = packageRepo.findAll();
        list.sort(Comparator.comparingLong(OylgServicePackage::getId));
        return list;
    }

    public List<OylgServicePackage> getFeaturedHomePackages() {
        List<OylgServicePackage> all = getActivePackages();
        return all.size() > 3 ? all.subList(0, 3) : all;
    }

    public List<Map<String, Object>> getStudentHeatmapView(long studentId) {
        ensureSeeded();
        List<OylgCurriculumUnit> units = unitRepo.findAll();
        units.sort(Comparator.comparingLong(OylgCurriculumUnit::getId));
        List<OylgMasteryState> states = masteryRepo.findByStudentId(studentId);
        Map<String, OylgMasteryState> stateByCode = new HashMap<>();
        for (OylgMasteryState st : states) {
            stateByCode.put(st.getUnitCode(), st);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for (OylgCurriculumUnit u : units) {
            OylgMasteryState st = stateByCode.get(u.getUnitCode());
            Map<String, Object> row = new HashMap<>();
            row.put("unitCode", u.getUnitCode());
            row.put("grade", u.getGrade());
            row.put("prerequisiteCode", u.getPrerequisiteCode());
            row.put("topicName", u.getTopicName());
            row.put("yccdDescription", u.getYccdDescription());
            row.put("examWeight", u.getExamWeight());
            row.put("masteryScore", st != null ? st.getMasteryScore() : 65);
            row.put("masteryLevel", st != null ? st.getMasteryLevel() : "MASTERED");
            row.put("rootCauseGap", st != null && st.isRootCauseGap());
            result.add(row);
        }
        return result;
    }

    public List<OylgLearningCase> getAllCases() {
        ensureSeeded();
        List<OylgLearningCase> list = caseRepo.findAll();
        list.sort(Comparator.comparingLong(OylgLearningCase::getId));
        return list;
    }

    public OylgLearningCase getCaseForStudent(long studentId) {
        ensureSeeded();
        List<OylgLearningCase> cases = caseRepo.findByStudentUserId(studentId);
        if (!cases.isEmpty()) {
            return cases.get(0);
        }
        List<OylgLearningCase> all = getAllCases();
        return all.isEmpty() ? null : all.get(0);
    }

    public List<OylgLessonRecord> getScheduledLessons(Long studentId) {
        ensureSeeded();
        List<OylgLessonRecord> all = studentId != null && studentId > 0
            ? lessonRepo.findByStudentId(studentId)
            : lessonRepo.findAll();
        List<OylgLessonRecord> out = new ArrayList<>();
        for (OylgLessonRecord r : all) {
            if ("SCHEDULED".equals(r.getLessonStatus())) {
                out.add(r);
            }
        }
        out.sort(Comparator.comparingLong(OylgLessonRecord::getId));
        return out;
    }

    public List<OylgLessonRecord> getCompletedLessonLogs(Long studentId) {
        ensureSeeded();
        List<OylgLessonRecord> all = studentId != null && studentId > 0
            ? lessonRepo.findByStudentId(studentId)
            : lessonRepo.findAll();
        List<OylgLessonRecord> out = new ArrayList<>();
        for (OylgLessonRecord r : all) {
            if ("COMPLETED".equals(r.getLessonStatus())) {
                out.add(r);
            }
        }
        out.sort((a, b) -> Long.compare(b.getId(), a.getId()));
        return out;
    }

    public List<OylgEcommerceOrderWallet> getOrders(Long studentId) {
        ensureSeeded();
        List<OylgEcommerceOrderWallet> list = studentId != null && studentId > 0
            ? orderRepo.findByStudentId(studentId)
            : orderRepo.findAll();
        list.sort((a, b) -> Long.compare(b.getId(), a.getId()));
        return list;
    }

    public List<OylgConsultationLead> getAllLeads() {
        ensureSeeded();
        List<OylgConsultationLead> list = leadRepo.findAll();
        list.sort((a, b) -> Long.compare(b.getId(), a.getId()));
        return list;
    }

    public List<OylgQuestionItem> getAllQuestions() {
        ensureSeeded();
        List<OylgQuestionItem> list = questionRepo.findAll();
        list.sort(Comparator.comparingLong(OylgQuestionItem::getId));
        return list;
    }

    public List<OylgGroupClass> getAllGroupClasses() {
        ensureSeeded();
        List<OylgGroupClass> list = groupClassRepo.findAll();
        list.sort(Comparator.comparingLong(OylgGroupClass::getId));
        return list;
    }

    public List<OylgResidency> getAllResidencies() {
        ensureSeeded();
        return residencyRepo.findAll();
    }

    public List<OylgAuthorizedPickup> getPickupsForStudent(long studentId) {
        ensureSeeded();
        List<OylgAuthorizedPickup> list = pickupRepo.findByStudentId(studentId);
        if (list.isEmpty()) {
            list = pickupRepo.findAll();
        }
        list.sort(Comparator.comparingLong(OylgAuthorizedPickup::getId));
        return list;
    }

    public List<OylgBoardingCheckin> getRecentCheckins(Long studentId) {
        ensureSeeded();
        List<OylgBoardingCheckin> list = studentId != null && studentId > 0
            ? checkinRepo.findByStudentId(studentId)
            : checkinRepo.findAll();
        list.sort((a, b) -> Long.compare(b.getId(), a.getId()));
        return list;
    }

    public List<OylgSafetyFlag> getAllSafetyFlags() {
        ensureSeeded();
        List<OylgSafetyFlag> list = safetyRepo.findAll();
        list.sort((a, b) -> Long.compare(b.getId(), a.getId()));
        return list;
    }

    // ==================== MUTATIONS (REAL MYSQL PERSISTENCE) ====================

    public OylgEcommerceOrderWallet createVietQrOrder(
        String packageCode,
        long studentId,
        String parentName,
        String parentPhone,
        String studentName,
        String voucherCode,
        String referralCode
    ) {
        ensureSeeded();
        OylgServicePackage pkg = packageRepo.findByPackageCode(packageCode);
        if (pkg == null) {
            pkg = getActivePackages().get(0);
        }
        OylgStudentProfile student = getStudentOrDefault(studentId);
        BigDecimal subtotal = pkg.getNetPriceVnd();
        BigDecimal discount = BigDecimal.ZERO;
        if (voucherCode != null && "OYLG2026".equalsIgnoreCase(voucherCode.trim())) {
            discount = new BigDecimal("200000");
        }
        BigDecimal netPaid = subtotal.subtract(discount).max(BigDecimal.ZERO);
        BigDecimal sixMonthRef = pkg.getSixMonthReferenceVnd().max(netPaid);

        OylgCommissionService.CommissionSplit split =
            commissionService.calculatePayAsCollectedSplit(
                netPaid, sixMonthRef, netPaid, false, false, false
            );

        LocalDateTime now = LocalDateTime.now();
        String orderCode = "ORD-2026-" + (1100 + orderRepo.count() + 1);
        OylgEcommerceOrderWallet order = buildOrder(
            orderCode,
            student != null ? student.getId() : 1L,
            parentName != null && !parentName.trim().isEmpty()
                ? parentName.trim()
                : (student != null ? student.getParentName() : "Phụ huynh OYLG"),
            parentPhone != null && !parentPhone.trim().isEmpty()
                ? parentPhone.trim()
                : (student != null ? student.getParentPhone() : "0905123489"),
            studentName != null && !studentName.trim().isEmpty()
                ? studentName.trim()
                : (student != null ? student.getFullName() : "Học sinh OYLG"),
            pkg.getTitle(),
            voucherCode != null ? voucherCode.trim().toUpperCase() : "",
            referralCode != null ? referralCode.trim().toUpperCase() : "",
            subtotal,
            discount,
            netPaid,
            split.getDthhBase(),
            split.getUnlockedRepAmount(),
            split.getUnlockedLeaderAmount(),
            pkg.getSessionCreditsGranted(),
            0,
            "PAID",
            now.plusDays(14),
            now
        );
        orderRepo.save(order);

        if (student != null && pkg.getSessionCreditsGranted() > 0) {
            student.setSessionCreditsRemaining(
                student.getSessionCreditsRemaining() + pkg.getSessionCreditsGranted()
            );
            student.setUpdatedAt(now);
            studentRepo.save(student);
        }
        return order;
    }

    public OylgEcommerceOrderWallet refundOrderWithin14Days(long orderId) {
        ensureSeeded();
        OylgEcommerceOrderWallet order = orderRepo.findById(orderId);
        if (order == null || "REFUNDED_14D".equals(order.getPaymentStatus())) {
            return order;
        }
        int unusedSessions = Math.max(
            0,
            order.getTotalSessionsGranted() - order.getConsumedSessionsCount()
        );
        BigDecimal refundAmount = order.getNetPaidAmountVnd();
        if (order.getTotalSessionsGranted() > 0 && order.getConsumedSessionsCount() > 0) {
            refundAmount = order.getNetPaidAmountVnd()
                .multiply(BigDecimal.valueOf(unusedSessions))
                .divide(BigDecimal.valueOf(order.getTotalSessionsGranted()), 0, BigDecimal.ROUND_HALF_UP);
        }
        order.setPaymentStatus("REFUNDED_14D");
        order.setRefundedAmountVnd(refundAmount);
        order.setRepCommissionVnd(BigDecimal.ZERO);
        order.setLeaderCommissionVnd(BigDecimal.ZERO);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepo.save(order);

        OylgStudentProfile student = studentRepo.findById(order.getStudentId());
        if (student != null && unusedSessions > 0) {
            student.setSessionCreditsRemaining(
                Math.max(0, student.getSessionCreditsRemaining() - unusedSessions)
            );
            student.setUpdatedAt(LocalDateTime.now());
            studentRepo.save(student);
        }
        return order;
    }

    public OylgLessonRecord rescheduleLesson(long lessonId, String newScheduleLabel) {
        ensureSeeded();
        OylgLessonRecord lesson = lessonRepo.findById(lessonId);
        if (lesson != null && newScheduleLabel != null && !newScheduleLabel.trim().isEmpty()) {
            lesson.setScheduleLabel(newScheduleLabel.trim());
            lesson.setUpdatedAt(LocalDateTime.now());
            lessonRepo.save(lesson);
        }
        return lesson;
    }

    public OylgLessonRecord switchLessonModality(long lessonId, String newDeliveryMode) {
        ensureSeeded();
        OylgLessonRecord lesson = lessonRepo.findById(lessonId);
        if (lesson == null) {
            return null;
        }
        OylgStudentProfile student = getStudentOrDefault(lesson.getStudentId());
        int grade = student != null ? student.getCurrentGrade() : 9;
        BigDecimal updatedPrice = pricingService.calculateSingleSessionPrice(
            "SENIOR", grade, newDeliveryMode, lesson.getClassType()
        );
        lesson.setDeliveryMode(newDeliveryMode);
        if ("ONLINE_ZOOM".equalsIgnoreCase(newDeliveryMode)) {
            lesson.setRoomOrLink("Zoom trực tuyến (Ghi hình bảo lưu 30 ngày)");
        } else if ("AT_HOME".equalsIgnoreCase(newDeliveryMode)) {
            lesson.setRoomOrLink("Gia sư 1-1 tại nhà riêng của gia đình");
        } else {
            lesson.setRoomOrLink("Phòng P204 · Trung tâm OYLG Buôn Ma Thuột");
        }
        lesson.setSessionPrice(updatedPrice);
        lesson.setUpdatedAt(LocalDateTime.now());
        lessonRepo.save(lesson);
        return lesson;
    }

    public Map<String, Object> submitStructuredLessonLog(
        long studentId,
        String unitCode,
        String understandingLevel,
        String moodObserved,
        int focusScore,
        String rawTutorNotes,
        String internalNotes
    ) {
        ensureSeeded();
        OylgStudentProfile student = getStudentOrDefault(studentId);
        OylgGuardrailService.GuardrailResult gr = guardrailService.inspectAndSanitize(rawTutorNotes);
        LocalDateTime now = LocalDateTime.now();

        OylgLessonRecord record = buildLesson(
            1L,
            student != null ? student.getId() : 1L,
            student != null ? student.getFullName() : "Học sinh OYLG",
            "Thầy Đặng Quốc Việt",
            "Biên bản 60s · " + (unitCode != null ? unitCode : "TOAN.08.HDT.01"),
            unitCode != null && !unitCode.isEmpty() ? unitCode : "TOAN.08.HDT.01",
            "Biên bản sau buổi học (" + now.format(DateTimeFormatter.ofPattern("dd/MM HH:mm")) + ")",
            now.format(DateTimeFormatter.ofPattern("dd/MM/yyyy · HH:mm")),
            "Hệ thống Sổ đầu bài OYLG",
            "AT_CENTER",
            "COMPLETED",
            understandingLevel != null ? understandingLevel : "MASTERED",
            moodObserved != null ? moodObserved : "Tập trung cao",
            Math.max(1, Math.min(5, focusScore)),
            new BigDecimal("320000"),
            internalNotes != null ? internalNotes : "",
            gr.getSanitizedText(),
            gr.getMaskedCount(),
            now
        );
        lessonRepo.save(record);

        if (gr.isRedSafetyTriggered()) {
            safetyRepo.save(buildSafetyFlag(
                student != null ? student.getId() : 1L,
                1L,
                "LESSON_NOTE",
                "RED_URGENT",
                gr.getSanitizedText(),
                "Phát hiện từ khóa nguy cơ an toàn tâm lý nghiêm trọng trong biên bản buổi học. Kích hoạt quy trình M14 và hiển thị tổng đài 111 / 115.",
                "PENDING_EXPERT_VERIFY",
                now
            ));
        }

        if (student != null && "MASTERED".equalsIgnoreCase(understandingLevel)) {
            OylgMasteryState st = masteryRepo.findByStudentIdAndUnitCode(
                student.getId(),
                record.getUnitCode()
            );
            if (st != null) {
                st.setMasteryScore(Math.min(100, st.getMasteryScore() + 35));
                if (st.getMasteryScore() >= 70) {
                    st.setMasteryLevel("MASTERED");
                    st.setRootCauseGap(false);
                }
                st.setUpdatedAt(now);
                masteryRepo.save(st);
            }
        }

        Map<String, Object> res = new HashMap<>();
        res.put("recordId", record.getId());
        res.put("sanitizedParentSummary", gr.getSanitizedText());
        res.put("maskedCount", gr.getMaskedCount());
        res.put("redSafetyTriggered", gr.isRedSafetyTriggered());
        res.put("emergencyHotline", "111 / 115");
        return res;
    }

    public OylgStudentProfile addStudentXpAndMood(long studentId, int deltaXp, String moodStatus) {
        ensureSeeded();
        OylgStudentProfile st = getStudentOrDefault(studentId);
        if (st != null) {
            if (deltaXp > 0) {
                st.setXpPoints(st.getXpPoints() + deltaXp);
            }
            if (moodStatus != null && !moodStatus.isEmpty()) {
                st.setMoodStatus(moodStatus);
            }
            st.setUpdatedAt(LocalDateTime.now());
            studentRepo.save(st);
        }
        return st;
    }

    public OylgConsultationLead createConsultationLead(
        String parentName,
        String phone,
        String studentName,
        int grade,
        String serviceInterest,
        String assignedExpert,
        String referralCode
    ) {
        ensureSeeded();
        LocalDateTime now = LocalDateTime.now();
        OylgConsultationLead lead = buildLead(
            parentName,
            phone,
            studentName,
            grade,
            "Đắk Lắk",
            serviceInterest != null && !serviceInterest.isEmpty()
                ? serviceInterest
                : "Đặt lịch tư vấn lộ trình 3 tầng 1-1 miễn phí",
            "ONLINE",
            referralCode != null ? referralCode : "",
            assignedExpert != null && !assignedExpert.isEmpty()
                ? assignedExpert
                : "ThS. Lê Minh Tâm",
            new BigDecimal("4500000"),
            "NEW",
            now
        );
        leadRepo.save(lead);
        return lead;
    }

    public OylgConsultationLead advanceLeadStage(long leadId) {
        ensureSeeded();
        OylgConsultationLead lead = leadRepo.findById(leadId);
        if (lead == null) {
            return null;
        }
        if ("NEW".equals(lead.getStage())) {
            lead.setStage("SCHEDULED");
            lead.setUpdatedAt(LocalDateTime.now());
            leadRepo.save(lead);
        } else if ("SCHEDULED".equals(lead.getStage())) {
            lead.setStage("PAID");
            lead.setUpdatedAt(LocalDateTime.now());
            leadRepo.save(lead);
            createVietQrOrder(
                "PKG-T12-COACH",
                1L,
                lead.getParentName(),
                lead.getPhone(),
                lead.getStudentName(),
                "",
                lead.getReferralCode()
            );
        }
        return lead;
    }

    public OylgQuestionItem reviewQuestion(long questionId, String status) {
        ensureSeeded();
        OylgQuestionItem q = questionRepo.findById(questionId);
        if (q != null) {
            q.setApprovalStatus(status);
            q.setUpdatedAt(LocalDateTime.now());
            questionRepo.save(q);
        }
        return q;
    }

    public OylgQuestionItem generateQuestionDraft(String subjectLabel, String unitCode, String diagnosticGoal) {
        ensureSeeded();
        LocalDateTime now = LocalDateTime.now();
        String code = "Q-B2-AI-" + (100 + questionRepo.count() + 1);
        OylgQuestionItem item = buildQuestion(
            code,
            "B2_KNOWLEDGE",
            subjectLabel != null && !subjectLabel.isEmpty() ? subjectLabel : "Toán Lớp 9",
            unitCode != null && !unitCode.isEmpty() ? unitCode : "TOAN.09.CBH.02",
            "Bản nháp đối soát YCCĐ (Chờ Hội đồng duyệt)",
            diagnosticGoal != null && !diagnosticGoal.isEmpty()
                ? diagnosticGoal
                : "Xác định điều kiện có nghĩa và rút gọn biểu thức căn bậc hai liên hợp:",
            "A = 1 / (căn(x) - 2) với x >= 0, x != 4",
            "A. x > 2 (Thiếu trường hợp 0 <= x < 4)|B. x >= 0 và x != 4 (Đáp án đúng)|C. x >= 4 (Nhầm điều kiện trong căn và mẫu số)|D. Mọi x >= 0 (Quên điều kiện mẫu khác 0)",
            new BigDecimal("0.46"),
            false,
            "PENDING_APPROVAL",
            now
        );
        questionRepo.save(item);
        return item;
    }

    public OylgGroupClass updateGroupClassAction(long groupId, String action) {
        ensureSeeded();
        OylgGroupClass gc = groupClassRepo.findById(groupId);
        if (gc == null) {
            return null;
        }
        if ("ADD_STUDENT".equalsIgnoreCase(action) && gc.getEnrolledCount() < gc.getMaxCapacity()) {
            gc.setEnrolledCount(gc.getEnrolledCount() + 1);
            if (gc.getEnrolledCount() >= gc.getMinRequired() && "WAITING".equals(gc.getStatus())) {
                gc.setStatus("READY");
            }
        } else if ("ACTIVATE".equalsIgnoreCase(action) && gc.getEnrolledCount() >= gc.getMinRequired()) {
            gc.setStatus("ACTIVE_RUNNING");
        }
        gc.setUpdatedAt(LocalDateTime.now());
        groupClassRepo.save(gc);
        return gc;
    }

    public Map<String, Object> verifyBoardingPickupQr(long pickupId) {
        ensureSeeded();
        OylgAuthorizedPickup pickup = pickupRepo.findById(pickupId);
        LocalDateTime now = LocalDateTime.now();
        Map<String, Object> res = new HashMap<>();
        if (pickup == null) {
            res.put("authorized", false);
            res.put("message", "Không tìm thấy mã QR người đón trong hồ sơ.");
            return res;
        }
        OylgStudentProfile student = getStudentOrDefault(pickup.getStudentId());
        String studentName = student != null ? student.getFullName() : "Nguyễn Minh Khôi";
        if (pickup.isAuthorized()) {
            OylgBoardingCheckin ci = buildCheckin(
                pickup.getStudentId(),
                studentName,
                "PICKUP_VERIFIED",
                now.format(TIME_FMT),
                "VERIFIED_SAFE",
                "Đã đối chiếu QR & CCCD hợp lệ · Bàn giao học sinh cho "
                    + pickup.getGuardianFullName() + " (" + pickup.getRelationship() + ")",
                now
            );
            checkinRepo.save(ci);
            res.put("authorized", true);
            res.put("guardianName", pickup.getGuardianFullName());
            res.put("message", "Xác thực hợp lệ: Đã bàn giao học sinh cho " + pickup.getGuardianFullName() + " và gửi thông báo tới Phụ huynh.");
        } else {
            OylgBoardingCheckin ci = buildCheckin(
                pickup.getStudentId(),
                studentName,
                "PICKUP_BLOCKED",
                now.format(TIME_FMT),
                "BLOCKED_STRANGER",
                "CHẶN BÀN GIAO: " + pickup.getGuardianFullName()
                    + " không nằm trong danh sách ủy quyền đón học sinh · Đã gọi xác minh Phụ huynh",
                now
            );
            checkinRepo.save(ci);
            safetyRepo.save(buildSafetyFlag(
                pickup.getStudentId(),
                1L,
                "BOARDING",
                "RED_URGENT",
                "Người không có trong danh sách ủy quyền (" + pickup.getGuardianFullName() + ") yêu cầu đón học sinh " + studentName,
                "Quản sinh đã chặn bàn giao tại cổng và liên hệ trực tiếp số điện thoại chủ tài khoản phụ huynh.",
                "PENDING_EXPERT_VERIFY",
                now
            ));
            res.put("authorized", false);
            res.put("guardianName", pickup.getGuardianFullName());
            res.put("message", "CẢNH BÁO AN TOÀN: " + pickup.getGuardianFullName() + " không nằm trong danh sách được phép đón. Hệ thống đã chặn bàn giao và báo ngay cho Phụ huynh.");
        }
        return res;
    }

    public OylgSafetyFlag resolveSafetyFlag(long flagId) {
        ensureSeeded();
        OylgSafetyFlag flag = safetyRepo.findById(flagId);
        if (flag != null) {
            flag.setStatus("RESOLVED_BY_COUNCIL");
            flag.setParentNotifiedAt(LocalDateTime.now());
            flag.setUpdatedAt(LocalDateTime.now());
            safetyRepo.save(flag);
        }
        return flag;
    }

    // ==================== BUILDER HELPERS ====================

    private OylgStudentProfile buildStudent(
        String code, String fullName, String parentName, String parentPhone,
        int grade, String school, String targetSchool, String targetMajor, String riasec,
        int credits, int streak, int xp, String mood, String allergies, LocalDateTime now
    ) {
        OylgStudentProfile s = new OylgStudentProfile();
        s.setStudentCode(code);
        s.setFullName(fullName);
        s.setParentName(parentName);
        s.setParentPhone(parentPhone);
        s.setCurrentGrade(grade);
        s.setSchoolName(school);
        s.setTargetSchool(targetSchool);
        s.setTargetMajor(targetMajor);
        s.setRiasecCode(riasec);
        s.setSessionCreditsRemaining(credits);
        s.setStreakDays(streak);
        s.setXpPoints(xp);
        s.setMoodStatus(mood);
        s.setOverallHealthStatus("NORMAL");
        s.setAllergiesJson(allergies);
        s.setDailyTasksJson("60/40");
        s.setCreatedAt(now);
        s.setUpdatedAt(now);
        return s;
    }

    private OylgExpertProfile buildExpert(
        String code, String name, String roleTitle, String role, String tier,
        String subjects, String bio, String metric, String portrait, String slug,
        BigDecimal payout, int students, BigDecimal rating, LocalDateTime now
    ) {
        OylgExpertProfile e = new OylgExpertProfile();
        e.setExpertCode(code);
        e.setDisplayName(name);
        e.setRoleTitle(roleTitle);
        e.setExpertRole(role);
        e.setTier(tier);
        e.setSubjectsJson(subjects);
        e.setBioSummary(bio);
        e.setHighlightMetric(metric);
        e.setPortraitUrl(portrait);
        e.setLandingPageSlug(slug);
        e.setBasePayoutPerSession(payout);
        e.setReviewRatePerItem(new BigDecimal("15000"));
        e.setStudentCount(students);
        e.setVerifiedStatus("VERIFIED");
        e.setRatingAvg(rating);
        e.setCreatedAt(now);
        e.setUpdatedAt(now);
        return e;
    }

    private OylgServicePackage buildPkg(
        String code, String tier, String badge, String title, String summary, String features,
        int sessions, int months, BigDecimal disc, BigDecimal listPrice, BigDecimal netPrice,
        BigDecimal sixMonthRef, boolean featured, LocalDateTime now
    ) {
        OylgServicePackage p = new OylgServicePackage();
        p.setPackageCode(code);
        p.setPackageTier(tier);
        p.setTierBadge(badge);
        p.setTitle(title);
        p.setSummary(summary);
        p.setFeaturesJson(features);
        p.setSessionCreditsGranted(sessions);
        p.setBillingTermMonths(months);
        p.setDiscountPercent(disc);
        p.setListPriceVnd(listPrice);
        p.setNetPriceVnd(netPrice);
        p.setSixMonthReferenceVnd(sixMonthRef);
        p.setFeatured(featured);
        p.setStatus("ACTIVE");
        p.setCreatedAt(now);
        p.setUpdatedAt(now);
        return p;
    }

    private void saveUnitAndMastery(
        long studentId, String code, String subject, int grade, String prereq,
        String topic, String desc, int weight, int score, String level, boolean isRoot, LocalDateTime now
    ) {
        OylgCurriculumUnit u = new OylgCurriculumUnit();
        u.setUnitCode(code);
        u.setSubjectCode(subject);
        u.setGrade(grade);
        u.setPrerequisiteCode(prereq);
        u.setTopicName(topic);
        u.setYccdDescription(desc);
        u.setExamWeight(weight);
        u.setApprovalStatus("APPROVED");
        u.setCreatedAt(now);
        u.setUpdatedAt(now);
        unitRepo.save(u);

        OylgMasteryState st = new OylgMasteryState();
        st.setStudentId(studentId);
        st.setUnitCode(code);
        st.setMasteryScore(score);
        st.setMasteryLevel(level);
        st.setRootCauseGap(isRoot);
        st.setUpdatedAt(now);
        masteryRepo.save(st);
    }

    private OylgLearningCase buildCase(
        String code, long studentId, String tier, String light,
        BigDecimal used, BigDecimal quota, int attendance, int remRatio, int curRatio,
        String internalNote, String parentSummary, LocalDateTime now
    ) {
        OylgLearningCase c = new OylgLearningCase();
        c.setCaseCode(code);
        c.setStudentUserId(studentId);
        c.setCurrentTier(tier);
        c.setCaseStatus("ACTIVE");
        c.setTrafficLight(light);
        c.setWeeklyHoursUsed(used);
        c.setWeeklyHoursQuota(quota);
        c.setAttendanceRate(attendance);
        c.setR1ReportStatus("APPROVED");
        c.setR2ReportStatus("PENDING_COACH_APPROVAL");
        c.setR3ReportStatus("LOCKED");
        c.setRemedialRatioPercent(remRatio);
        c.setCurrentGradeRatioPercent(curRatio);
        c.setInternalB3Note(internalNote);
        c.setParentB3Summary(parentSummary);
        c.setCreatedAt(now);
        c.setUpdatedAt(now);
        return c;
    }

    private OylgLessonRecord buildLesson(
        long caseId, long studentId, String studentName, String expertName,
        String subjectLabel, String unitCode, String topic, String schedule, String room,
        String mode, String status, String understanding, String mood, int focus,
        BigDecimal price, String structured, String sanitized, int masked, LocalDateTime now
    ) {
        OylgLessonRecord l = new OylgLessonRecord();
        l.setCaseId(caseId);
        l.setStudentId(studentId);
        l.setStudentName(studentName);
        l.setExpertName(expertName);
        l.setSubjectLabel(subjectLabel);
        l.setUnitCode(unitCode);
        l.setTopicTitle(topic);
        l.setScheduleLabel(schedule);
        l.setRoomOrLink(room);
        l.setDeliveryMode(mode);
        l.setClassType("ONE_ON_ONE");
        l.setLessonStatus(status);
        l.setUnderstandingLevel(understanding);
        l.setMoodObserved(mood);
        l.setFocusScore(focus);
        l.setSessionPrice(price);
        l.setExpertPayoutAmount(new BigDecimal("280000"));
        l.setStructuredNotes(structured);
        l.setSanitizedParentSummary(sanitized);
        l.setDlpMaskedCount(masked);
        l.setSubmittedWithin24h(true);
        l.setCreatedAt(now);
        l.setUpdatedAt(now);
        return l;
    }

    private OylgEcommerceOrderWallet buildOrder(
        String code, long studentId, String parentName, String phone, String studentName,
        String pkgTitle, String voucher, String refCode, BigDecimal sub, BigDecimal disc,
        BigDecimal net, BigDecimal dthh, BigDecimal repComm, BigDecimal leaderComm,
        int sessions, int consumed, String status, LocalDateTime refundUntil, LocalDateTime now
    ) {
        OylgEcommerceOrderWallet o = new OylgEcommerceOrderWallet();
        o.setOrderCode(code);
        o.setStudentId(studentId);
        o.setParentName(parentName);
        o.setParentPhone(phone);
        o.setStudentName(studentName);
        o.setPackageTitle(pkgTitle);
        o.setVoucherCode(voucher);
        o.setReferralCode(refCode);
        o.setSubtotalAmountVnd(sub);
        o.setDiscountAmountVnd(disc);
        o.setNetPaidAmountVnd(net);
        o.setDthhBaseVnd(dthh);
        o.setRepCommissionVnd(repComm);
        o.setLeaderCommissionVnd(leaderComm);
        o.setTotalSessionsGranted(sessions);
        o.setConsumedSessionsCount(consumed);
        o.setPaymentChannel("VIETQR_PAYOS");
        o.setPaymentStatus(status);
        o.setRefundGuaranteedUntil(refundUntil);
        o.setRefundedAmountVnd(BigDecimal.ZERO);
        o.setCreatedAt(now);
        o.setUpdatedAt(now);
        return o;
    }

    private OylgConsultationLead buildLead(
        String parentName, String phone, String studentName, int grade, String province,
        String interest, String channel, String refCode, String expert, BigDecimal amount,
        String stage, LocalDateTime now
    ) {
        OylgConsultationLead l = new OylgConsultationLead();
        l.setParentName(parentName);
        l.setPhone(phone);
        l.setStudentName(studentName);
        l.setGrade(grade);
        l.setProvince(province);
        l.setServiceInterest(interest);
        l.setChannel(channel);
        l.setReferralCode(refCode);
        l.setAssignedExpert(expert);
        l.setQuotedAmountVnd(amount);
        l.setStage(stage);
        l.setCreatedAt(now);
        l.setUpdatedAt(now);
        return l;
    }

    private OylgQuestionItem buildQuestion(
        String code, String group, String subject, String unit, String author,
        String stem, String formula, String options, BigDecimal irt, boolean safety,
        String status, LocalDateTime now
    ) {
        OylgQuestionItem q = new OylgQuestionItem();
        q.setQuestionCode(code);
        q.setToolGroup(group);
        q.setSubjectLabel(subject);
        q.setUnitCode(unit);
        q.setAuthorName(author);
        q.setStemText(stem);
        q.setFormulaLatex(formula);
        q.setOptionsJson(options);
        q.setIrtDiscrimination(irt);
        q.setTriggersSafetyFlag(safety);
        q.setApprovalStatus(status);
        q.setCreatedAt(now);
        q.setUpdatedAt(now);
        return q;
    }

    private OylgGroupClass buildGroupClass(
        String code, String title, String expert, String schedule, String gaps,
        int enrolled, int minReq, int maxCap, String deadline, String status, LocalDateTime now
    ) {
        OylgGroupClass g = new OylgGroupClass();
        g.setGroupCode(code);
        g.setTitle(title);
        g.setExpertName(expert);
        g.setScheduleInfo(schedule);
        g.setSharedGapsCsv(gaps);
        g.setEnrolledCount(enrolled);
        g.setMinRequired(minReq);
        g.setMaxCapacity(maxCap);
        g.setDeadlineLabel(deadline);
        g.setStatus(status);
        g.setCreatedAt(now);
        g.setUpdatedAt(now);
        return g;
    }

    private OylgResidency buildResidency(
        long studentId, String studentName, int grade, String type,
        String room, String bed, String allergy, BigDecimal sleep, LocalDateTime now
    ) {
        OylgResidency r = new OylgResidency();
        r.setStudentId(studentId);
        r.setStudentName(studentName);
        r.setGrade(grade);
        r.setResidencyType(type);
        r.setRoomCode(room);
        r.setBedCode(bed);
        r.setAllergyWarning(allergy);
        r.setAvgSleepHours(sleep);
        r.setStatus("ACTIVE");
        r.setCreatedAt(now);
        r.setUpdatedAt(now);
        return r;
    }

    private OylgAuthorizedPickup buildPickup(
        long studentId, String name, String rel, String phone, String cccd,
        String token, boolean authorized, String note, LocalDateTime now
    ) {
        OylgAuthorizedPickup p = new OylgAuthorizedPickup();
        p.setStudentId(studentId);
        p.setGuardianFullName(name);
        p.setRelationship(rel);
        p.setPhoneNumber(phone);
        p.setNationalIdMasked(cccd);
        p.setQrPassToken(token);
        p.setAuthorized(authorized);
        p.setVerificationNote(note);
        p.setCreatedAt(now);
        p.setUpdatedAt(now);
        return p;
    }

    private OylgBoardingCheckin buildCheckin(
        long studentId, String studentName, String type, String timeLabel,
        String status, String notes, LocalDateTime checkedAt
    ) {
        OylgBoardingCheckin c = new OylgBoardingCheckin();
        c.setStudentId(studentId);
        c.setStudentName(studentName);
        c.setCheckpointType(type);
        c.setTimeLabel(timeLabel);
        c.setVerificationStatus(status);
        c.setNotes(notes);
        c.setCheckedAt(checkedAt);
        return c;
    }

    private OylgSafetyFlag buildSafetyFlag(
        long studentId, long caseId, String module, String severity,
        String excerpt, String analysis, String status, LocalDateTime now
    ) {
        OylgSafetyFlag f = new OylgSafetyFlag();
        f.setStudentUserId(studentId);
        f.setCaseId(caseId);
        f.setSourceModule(module);
        f.setSeverity(severity);
        f.setTriggerExcerpt(excerpt);
        f.setAiRiskAnalysis(analysis);
        f.setEmergencyHotlineShown("111 / 115");
        f.setStatus(status);
        f.setCreatedAt(now);
        f.setUpdatedAt(now);
        return f;
    }
}
