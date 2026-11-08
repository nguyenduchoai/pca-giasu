"use client";

import React, { useState } from "react";
import { usePlatform } from "@/lib/platform-store";
import {
  traceAdaptiveKnowledgeGraph,
  maskContactInfo,
  detectSafetyRisk,
  anonymizeForAiGateway,
} from "@oylg/shared";
import {
  STUDENT_CASES,
  RAG_PLAYBOOK_RECOMMENDATIONS,
} from "@/data/oylg-mock-data";
import {
  GitBranch,
  Sliders,
  ShieldAlert,
  BookOpenCheck,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  PhoneCall,
  Lock,
  Send,
  AlertOctagon,
} from "lucide-react";

export function CoachExpertWorkspace() {
  const {
    studentCases,
    selectedStudentId,
    setSelectedStudentId,
    bookings,
    submitLessonLog,
  } = usePlatform();
  const [timelineWeek, setTimelineWeek] = useState<number>(1);
  const [showDetailedMentalReport, setShowDetailedMentalReport] =
    useState<boolean>(true);
  const [reportApproved, setReportApproved] = useState<Record<string, boolean>>(
    {}
  );
  const [playbookStatus, setPlaybookStatus] = useState<
    Record<string, "SUGGESTED" | "APPLIED" | "DISMISSED">
  >({});

  // State cho Biên bản buổi học 60s + Kiểm thử trực tiếp Rào chắn chống lộ SĐT/Zalo & Cảnh báo M14
  const [lessonNoteInput, setLessonNoteInput] = useState<string>(
    "Em Minh Khôi hôm nay đã hiểu bản chất hằng đẳng thức bình phương một hiệu. Phụ huynh cần trao đổi riêng thì nhắn zalo.me/thayviettoan hoặc gọi số 0987.654.321 nhé!"
  );
  const [selectedMood, setSelectedMood] = useState<string>("Tập trung cao");
  const [selectedMasteryChip, setSelectedMasteryChip] =
    useState<string>("HIỂU MỘT PHẦN");
  const [lessonLogSavedNotice, setLessonLogSavedNotice] = useState<
    string | null
  >(null);

  const casesList = studentCases.length > 0 ? studentCases : STUDENT_CASES;
  const activeCase =
    casesList.find((c) => c.id === selectedStudentId) ?? casesList[0];

  const snapshotScores =
    activeCase.timelineMasterySnapshots[timelineWeek] ??
    activeCase.timelineMasterySnapshots[1];

  const tracing = traceAdaptiveKnowledgeGraph(snapshotScores);

  const maskResult = maskContactInfo(lessonNoteInput);
  const safetyResult = detectSafetyRisk(lessonNoteInput);

  const anonymizedPreview = anonymizeForAiGateway({
    studentCode: activeCase.code,
    fullName: activeCase.fullName,
    schoolName: activeCase.schoolName,
    grade: activeCase.grade,
    subjectScoresSummary: `Học sinh ${activeCase.fullName} học tại ${activeCase.schoolName} đang có ${tracing.gapCount} YCCĐ cần lấp nền, lỗ hổng gốc: ${
      tracing.rootGaps.map((g) => g.code).join(", ") || "Đã lấp xong"
    }.`,
  });

  const matchingPlaybook =
    RAG_PLAYBOOK_RECOMMENDATIONS.find(
      (r) => r.studentCode === activeCase.code
    ) ?? RAG_PLAYBOOK_RECOMMENDATIONS[0];

  const currentPlaybookState =
    playbookStatus[matchingPlaybook.id] ?? matchingPlaybook.status;

  return (
    <div className="space-y-6">
      {/* 1. THANH CHỌN HỒ SƠ ĐỒNG HÀNH (LEARNING CASE) & ĐÈN TRẠNG THÁI M20 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Tháp Điều Khiển Hồ Sơ Đồng Hành (Case Control Tower)
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Danh sách Học sinh Phụ trách (Tối đa 20 HS / Cố vấn)
            </h2>
          </div>
          <div className="text-xs text-slate-500">
            Quyền truy cập: <strong className="text-slate-800">Phân quyền theo hồ sơ phụ trách</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {casesList.map((sc) => {
            const isSelected = sc.id === activeCase.id;
            const lightBadge =
              sc.statusLight === "RED"
                ? "bg-rose-100 text-rose-800 border-rose-300"
                : sc.statusLight === "YELLOW"
                ? "bg-amber-100 text-amber-800 border-amber-300"
                : "bg-emerald-100 text-emerald-800 border-emerald-300";

            return (
              <button
                key={sc.id}
                onClick={() => setSelectedStudentId(sc.id)}
                className={`text-left rounded-xl p-4 border transition flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-slate-600">
                      {sc.code} · Lớp {sc.grade}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${lightBadge}`}
                    >
                      Đèn {sc.statusLight} ({sc.riskTrend === "IMPROVING" ? "↑ Tốt lên" : "↓ Cần can thiệp"})
                    </span>
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {sc.fullName}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Đích: <strong>{sc.careerGoal.targetCareer}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-600">
                  <span>
                    Tải học: <strong>{sc.weeklyLoadHours}h</strong>/{sc.maxAllowedLoadHours}h
                  </span>
                  <span>
                    Chuyên cần: <strong>{sc.attendanceRatePct}%</strong>
                  </span>
                  <span>
                    Tỉ lệ luồng:{" "}
                    <strong>
                      {sc.remedialRatio.remedialPct}/{sc.remedialRatio.currentPct}/
                      {sc.remedialRatio.advancedPct}
                    </strong>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. BẢN ĐỒ NHIỆT KIẾN THỨC 4D THEO THỜI GIAN & TRUY NGƯỢC LỖ HỔNG GỐC (M04, M05, M20.4) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Bản Đồ Nhiệt Đồ Thị YCCĐ (GDPT 2018) & Truy Ngược Lỗ Hổng Gốc — {activeCase.fullName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                M20.4: Kéo thanh trượt thời gian để thấy rõ các ô &ldquo;Đỏ&rdquo; (Lỗ hổng gốc lớp dưới) chuyển dần sang &ldquo;Xanh&rdquo; qua từng checkpoint.
              </p>
            </div>
          </div>

          {/* Time-Slider (Tuần 1 -> Tuần 4 -> Tuần 8 -> Tuần 12) */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <Sliders className="w-4 h-4 text-indigo-600 ml-1.5" />
            <span className="text-xs font-semibold text-slate-700 mr-1">
              Mốc thời gian:
            </span>
            {[1, 4, 8, 12].map((week) => (
              <button
                key={week}
                onClick={() => setTimelineWeek(week)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  timelineWeek === week
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                Tuần {week} {week === 1 ? "(Đầu vào)" : week === 12 ? "(Checkpoint 3)" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Tóm tắt nhanh trạng thái đồ thị tại tuần đang chọn */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5">
            <div className="text-xs font-semibold text-rose-800">
              Lỗ hổng gốc phát hiện (Root Gaps)
            </div>
            <div className="text-lg font-bold text-rose-700 mt-0.5">
              {tracing.rootGaps.length === 0
                ? "0 – Đã lấp xong toàn bộ lỗ hổng gốc!"
                : tracing.rootGaps.map((g) => `${g.code} (Lớp ${g.grade})`).join(", ")}
            </div>
            <div className="text-[11px] text-rose-700/80 mt-0.5">
              Điểm đứt gãy đầu tiên mà mọi tiên quyết phía trước đều đã ĐẠT
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5">
            <div className="text-xs font-semibold text-emerald-800">
              YCCĐ Đã nắm vững / Suy luận Đạt
            </div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">
              {tracing.masteredCount} / {tracing.evaluatedUnits.length} đơn vị kiến thức
            </div>
            <div className="text-[11px] text-emerald-700/80 mt-0.5">
              Tự động suy luận ĐẠT lớp dưới khi học sinh làm đúng bài trụ cột lớp trên
            </div>
          </div>

          <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3.5">
            <div className="text-xs font-semibold text-indigo-800">
              Phân bổ Lộ trình Song song (M07 & M20.2)
            </div>
            <div className="text-lg font-bold text-indigo-700 mt-0.5">
              {activeCase.remedialRatio.remedialPct}% Lấp nền ·{" "}
              {activeCase.remedialRatio.currentPct}% Hiện tại ·{" "}
              {activeCase.remedialRatio.advancedPct}% Nâng cao
            </div>
            <div className="text-[11px] text-indigo-700/80 mt-0.5">
              Lấy lại gốc cũ song song bám sát bài kiểm tra trên trường
            </div>
          </div>
        </div>

        {/* Lưới Đồ thị YCCĐ từ Lớp 6 -> Lớp 11 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tracing.evaluatedUnits.map((unit) => {
            let cardStyle = "border-slate-200 bg-slate-50 text-slate-600";
            let statusLabel = "Chưa kiểm tra";

            if (unit.status === "MASTERED") {
              cardStyle = "border-emerald-300 bg-emerald-50/70 text-emerald-950";
              statusLabel = `NẮM VỮNG (${Math.round(unit.pMastery * 100)}%)`;
            } else if (unit.status === "INFERRED_MASTERED") {
              cardStyle = "border-teal-200 bg-teal-50/50 text-teal-900";
              statusLabel = "SUY LUẬN ĐẠT (Bỏ qua nhánh dưới)";
            } else if (unit.isRootGap) {
              cardStyle =
                "border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/30";
              statusLabel = `LỖ HỔNG GỐC (${Math.round(unit.pMastery * 100)}%)`;
            } else if (unit.status === "PARTIAL") {
              cardStyle = "border-amber-300 bg-amber-50/80 text-amber-950";
              statusLabel = `ĐANG LẤP NỀN (${Math.round(unit.pMastery * 100)}%)`;
            } else if (unit.status === "NOT_MASTERED") {
              cardStyle = "border-rose-300 bg-rose-50/50 text-rose-900";
              statusLabel = `HỆ QUẢ CHƯA ĐẠT (${Math.round(unit.pMastery * 100)}%)`;
            }

            return (
              <div
                key={unit.code}
                className={`rounded-xl border p-3.5 flex flex-col justify-between gap-2 transition-all ${cardStyle}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-black/10">
                      {unit.code} · Lớp {unit.grade}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/90">
                      {statusLabel}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold mt-2">{unit.title}</h4>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {unit.diagnosticNote}
                  </p>
                </div>

                <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[10px] opacity-85">
                  <span>
                    Tiên quyết:{" "}
                    {unit.prereqCodes.length > 0
                      ? unit.prereqCodes.join(", ")
                      : "Gốc tiểu học/Lớp 6"}
                  </span>
                  <span>Trọng số thi: {unit.examWeight}/10</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SPLIT-SCREEN HUMAN-IN-THE-LOOP AI COPILOT: DUYỆT BÁO CÁO & GIẢI PHÁP CÓ TRÍCH NGUỒN RAG (M06, M20.13) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột Trái: Dữ liệu nguồn định lượng + Trích dẫn RAG + Ẩn danh AI Gateway */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpenCheck className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Nguồn Dữ Liệu Định Lượng & Trích Dẫn Chính Thống
              </h3>
              <p className="text-xs text-slate-500">
                AI tuyệt đối không lấy nguồn trôi nổi trên internet – Bắt buộc ghi nguồn đã duyệt
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-700">
              Tài liệu tham chiếu chính thống được AI truy xuất (RAG):
            </div>
            {matchingPlaybook.citations.map((cit) => (
              <div
                key={cit.docCode}
                className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {cit.docCode}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    ✓ Duyệt bởi: {cit.approvedBy}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  {cit.title}
                </div>
                <div className="text-[11px] text-slate-600">
                  Cơ quan ban hành: <strong>{cit.issuer}</strong>
                </div>
                <div className="text-[11px] text-indigo-800 bg-indigo-50/60 px-2 py-1 rounded">
                  Trích dẫn: {cit.sectionRef}
                </div>
              </div>
            ))}
          </div>

          {/* Minh chứng Ẩn danh dữ liệu trẻ em trước khi gọi Claude API (Mục 10.1) */}
          <div className="rounded-xl bg-slate-900 text-slate-100 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                Payload gửi AI Gateway Quốc tế (Đã ẩn danh PII - Mục 10.1)
              </span>
              <span className="font-mono">claude-sonnet-5-5</span>
            </div>
            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              {anonymizedPreview.sanitizedSummary}
            </p>
            <div className="text-[10px] text-slate-400">
              Đã cắt bỏ trường nhạy cảm: {anonymizedPreview.piiStrippedFields.join(", ")}
            </div>
          </div>
        </div>

        {/* Cột Phải: Bản nháp AI (AI_DRAFT) + 2 Lớp Hiển Thị Tâm Lý B3 + Nút Duyệt Xuất Bản */}
        <div className="lg:col-span-7 rounded-2xl border border-indigo-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Split-Screen AI Copilot · Duyệt Báo Cáo R2/R4 & Khuyến Cáo Giải Pháp
                </h3>
                <p className="text-xs text-slate-500">
                  Nguyên tắc #8: Không bao giờ gửi bản AI chưa duyệt cho phụ huynh/học sinh
                </p>
              </div>
            </div>

            {/* Chuyển đổi 2 lớp hiển thị B3 (M06-6 & B5-35) */}
            <button
              onClick={() =>
                setShowDetailedMentalReport(!showDetailedMentalReport)
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
            >
              {showDetailedMentalReport ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  Đang xem: Lớp 1 – Bản Chuyên môn Cố vấn (Chi tiết B3)
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  Đang xem: Lớp 2 – Bản Tóm tắt gửi Phụ huynh (Đã lọc nhạy cảm)
                </>
              )}
            </button>
          </div>

          {/* Nội dung khuyến cáo & báo cáo */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Chẩn đoán & Giải pháp cá nhân hóa ({matchingPlaybook.riskTitle})
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  reportApproved[activeCase.id]
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {reportApproved[activeCase.id]
                  ? "PUBLISHED (Đã duyệt gửi Phụ huynh)"
                  : "AI_DRAFT (Chờ Cố vấn duyệt)"}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {matchingPlaybook.personalizedRecommendation}
            </p>

            {/* 2 lớp hiển thị nội dung sức khỏe tinh thần B3 */}
            <div className="rounded-lg border border-indigo-200 bg-white p-3 space-y-1">
              <div className="text-[11px] font-bold text-indigo-800">
                {showDetailedMentalReport
                  ? "🔒 [LỚP NỘI BỘ CHUYÊN MÔN – B3 SỨC KHỎE TINH THẦN]:"
                  : "👪 [LỚP HIỂN THỊ CHO PHỤ HUYNH – BẢN TÓM TẮT ĐÃ ĐIỀU CHỈNH GIỌNG ĐIỆU]:"}
              </div>
              <p className="text-xs text-slate-700">
                {showDetailedMentalReport
                  ? `Ghi chú phiên B3 của ${activeCase.fullName}: Học sinh chia sẻ áp lực sợ làm bố mẹ thất vọng nếu không đỗ ${activeCase.careerGoal.targetUniversity}. Chỉ số căng thẳng thi cử ở ngưỡng cần theo dõi sát. Không hiển thị nguyên văn lời tâm sự riêng tư này cho phụ huynh.`
                  : `Con rất có ý chí hướng tới mục tiêu ${activeCase.careerGoal.targetUniversity}. Giai đoạn này gia đình nên động viên tinh thần, ghi nhận sự tiến bộ từng tuần và giữ giấc ngủ đủ 7.5–8 tiếng cho con.`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="rounded-lg bg-white p-2.5 border border-slate-200 text-[11px]">
                <strong className="text-indigo-700 block">Việc Cố vấn:</strong>
                {matchingPlaybook.roleActions.coach}
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-slate-200 text-[11px]">
                <strong className="text-emerald-700 block">Việc Gia sư:</strong>
                {matchingPlaybook.roleActions.tutor}
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-slate-200 text-[11px]">
                <strong className="text-amber-700 block">Phối hợp Phụ huynh:</strong>
                {matchingPlaybook.roleActions.parent}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPlaybookStatus((prev) => ({
                    ...prev,
                    [matchingPlaybook.id]: "APPLIED",
                  }))
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  currentPlaybookState === "APPLIED"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {currentPlaybookState === "APPLIED"
                  ? "✓ Đã áp dụng Playbook vào Kế hoạch môn"
                  : "Áp dụng giải pháp Playbook (Đo hiệu quả sau 2-4 tuần)"}
              </button>
            </div>

            <button
              onClick={() =>
                setReportApproved((prev) => ({
                  ...prev,
                  [activeCase.id]: true,
                }))
              }
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              {reportApproved[activeCase.id]
                ? "Đã Duyệt & Phát Hành (PUBLISHED)"
                : "Cố vấn Duyệt & Gửi Bản Tóm Tắt cho Phụ huynh"}
            </button>
          </div>
        </div>
      </div>

      {/* 4. BIÊN BẢN BUỔI HỌC 60 GIÂY + KIỂM THỬ TRỰC TIẾP RÀO CHẮN CHỐNG LỘ SĐT/ZALO & CỜ AN TOÀN */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Biên Bản Buổi Học Cấu Trúc 60s + Rào Chắn AI Thời Gian Thực
            </h3>
            <p className="text-xs text-slate-500">
              Gia sư bắt buộc nộp trong 24h để ghi nhận thù lao. Hệ thống tự động che SĐT/Zalo và quét từ khóa nguy hiểm tâm lý.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setLessonNoteInput(
                  "Hôm nay em làm tốt bài Hằng đẳng thức. Chị gọi cho em số không chín một hai ba bốn năm sáu bảy tám hoặc kết bạn zalo.me/giasutoan nhé!"
                )
              }
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
            >
              Thử SĐT viết chữ tiếng Việt
            </button>
            <button
              onClick={() =>
                setLessonNoteInput(
                  "Cuối buổi học em khóc nhiều, nói áp lực điểm số quá lớn và từng có suy nghĩ tự hại, muốn bỏ nhà đi."
                )
              }
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-[11px] font-semibold text-rose-700 border border-rose-200"
            >
              Thử tình huống Khủng hoảng Tâm lý (Cờ Đỏ)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="font-semibold text-slate-700">Mức nắm bài YCCĐ:</span>
              {["CHƯA HIỂU", "HIỂU MỘT PHẦN", "NẮM VỮNG"].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMasteryChip(m)}
                  className={`px-2.5 py-1 rounded-lg font-semibold border ${
                    selectedMasteryChip === m
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="font-semibold text-slate-700">Tâm trạng quan sát:</span>
              {["Tập trung cao", "Bình thường", "Mệt mỏi", "Căng thẳng", "Buồn bất thường"].map(
                (mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`px-2.5 py-1 rounded-lg font-semibold border ${
                      selectedMood === mood
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {mood}
                  </button>
                )
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nội dung ghi chú của Gia sư (Gõ thử SĐT, link Zalo hoặc dấu hiệu tâm lý để kiểm tra Guardrail):
              </label>
              <textarea
                rows={3}
                value={lessonNoteInput}
                onChange={(e) => setLessonNoteInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                onClick={() => {
                  const targetBooking =
                    bookings.find((b) => b.studentCode === activeCase.code) ??
                    bookings[0];
                  submitLessonLog({
                    bookingId: targetBooking?.id ?? `bk-${Date.now()}`,
                    studentName: activeCase.fullName,
                    subject: targetBooking?.subject ?? `Toán Lớp ${activeCase.grade}`,
                    unitCode:
                      tracing.rootGaps[0]?.code ??
                      targetBooking?.unitCode ??
                      "TOAN.08.HDT.01",
                    masteryLevel: selectedMasteryChip as
                      | "CHƯA HIỂU"
                      | "HIỂU MỘT PHẦN"
                      | "NẮM VỮNG",
                    mood: selectedMood,
                    focusScore: 5,
                    sanitizedNoteToParent: maskResult.sanitizedText,
                    internalNoteToCoach: lessonNoteInput,
                    safetyLevel: safetyResult.level,
                  });
                  setLessonLogSavedNotice(
                    `Đã lưu Biên bản 60s cho ${activeCase.fullName} & đồng bộ sang Cổng Phụ huynh (sau khi lọc DLP)!`
                  );
                  setTimeout(() => setLessonLogSavedNotice(null), 5000);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Lưu Biên Bản 60s &amp; Gửi Bản Tin Phụ Huynh</span>
              </button>

              {lessonLogSavedNotice && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{lessonLogSavedNotice}</span>
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            {/* Kết quả lọc DLP Chống lộ thông tin liên hệ */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-indigo-600" />
                  Nội dung thực tế hiển thị cho Phụ huynh (Sau khi qua DLP Filter):
                </span>
                {maskResult.hasViolation && (
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    Đã chặn {maskResult.detectedItems.length} thông tin liên hệ riêng!
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200">
                {maskResult.sanitizedText}
              </p>
            </div>

            {/* Cảnh báo An toàn tâm lý nếu phát hiện */}
            {safetyResult.level !== "NONE" && (
              <div
                className={`rounded-xl border p-4 space-y-2 ${
                  safetyResult.level === "HIGH"
                    ? "bg-rose-950 text-white border-rose-600"
                    : "bg-amber-50 text-amber-950 border-amber-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                    CẢNH BÁO AN TOÀN TÂM LÝ – MỨC {safetyResult.level}
                  </span>
                  <span className="text-[11px] font-mono bg-rose-600 text-white px-2 py-0.5 rounded">
                    AI Auto-Counseling: BLOCKED
                  </span>
                </div>
                {safetyResult.ImmediateBannerMessage && (
                  <p className="text-xs font-semibold leading-relaxed">
                    {safetyResult.ImmediateBannerMessage}
                  </p>
                )}
                {safetyResult.emergencyHotlines.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {safetyResult.emergencyHotlines.map((hl) => (
                      <div
                        key={hl.number}
                        className="rounded-lg bg-white/10 border border-white/20 p-2.5 flex items-center gap-2.5"
                      >
                        <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold">
                            {hl.name}: <span className="text-amber-300 text-sm">{hl.number}</span>
                          </div>
                          <div className="text-[10px] opacity-80">
                            {hl.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
