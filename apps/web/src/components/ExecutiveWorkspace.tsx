"use client";

import React, { useState } from "react";
import { usePlatform } from "@/lib/platform-store";
import {
  calculatePackageQuote,
  calculateExpertQuarterlyPayout,
  BillingTermMonths,
  ClassType,
  DeliveryMode,
  ExpertTier,
} from "@oylg/shared";
import {
  TrendingUp,
  AlertTriangle,
  HeartHandshake,
  GraduationCap,
  Calculator,
  Award,
  Users,
  Video,
  CheckCircle2,
  Sparkles,
  Building,
  Home,
} from "lucide-react";

export function ExecutiveWorkspace() {
  const {
    baseSessionPriceVnd: basePriceVnd,
    setBaseSessionPriceVnd: setBasePriceVnd,
    classGroups,
    enrollInClassGroup,
    launchClassGroup,
  } = usePlatform();

  // State cho Bộ tính giá hệ số B6
  const [expertTier, setExpertTier] = useState<ExpertTier>(2);
  const [grade, setGrade] = useState<number>(10);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("AT_HOME");
  const [classType, setClassType] = useState<ClassType>("ONE_ON_ONE");
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(2);
  const [termMonths, setTermMonths] = useState<BillingTermMonths>(6);

  // State cho Bộ tính Thù lao cố định + KPI Quý 10% (M11)
  const [fixedPayQuarter, setFixedPayQuarter] = useState<number>(36_000_000);
  const [activeStudentsCount, setActiveStudentsCount] = useState<number>(8);
  const [progressScore, setProgressScore] = useState<number>(92);
  const [disciplineScore, setDisciplineScore] = useState<number>(98);
  const [csatScore, setCsatScore] = useState<number>(94);
  const [retentionScore, setRetentionScore] = useState<number>(88);
  const [reviewItemsCount, setReviewItemsCount] = useState<number>(40);

  const quote = calculatePackageQuote({
    basePriceVnd,
    expertTier,
    grade,
    deliveryMode,
    classType,
    sessionsPerWeek,
    termMonths,
  });

  const kpiPayout = calculateExpertQuarterlyPayout({
    fixedPayTotalQuarterVnd: fixedPayQuarter,
    activeStudentsCount,
    progressScore,
    disciplineScore,
    csatScore,
    retentionScore,
    reviewItemsCount,
    reviewUnitRateVnd: 15_000,
  });

  const handleLaunchGroup = (id: string) => {
    launchClassGroup(id);
  };

  const handleAddStudentToGroup = (id: string) => {
    enrollInClassGroup(id);
  };

  return (
    <div className="space-y-6">
      {/* 1. BỐN CHỈ SỐ BUỔI SÁNG CHO BAN ĐIỀU HÀNH */}
      <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Nhịp Đập Điều Hành Buổi Sáng · Morning Executive Pulse
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              4 Chỉ Số Buổi Sáng Ban Điều Hành OYLG (All Your Life)
            </h2>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            Tenant: <strong className="text-slate-800">OYLG-ROOT (Đắk Lắk & Toàn quốc)</strong> · Quy mô MVP: <strong className="text-indigo-700">68/100 học sinh</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">
                1. Doanh thu & Học sinh mới
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              412.500.000đ
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>+14 học sinh mới tháng này</span>
              <span className="font-semibold text-emerald-700">100% qua PayOS/Quỹ</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/70 to-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-800">
                2. Học sinh cần can thiệp
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              3 học sinh <span className="text-sm font-medium text-rose-600">(1 Đỏ, 2 Vàng)</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              HS-2026-0104 quá tải 19.5h/tuần · Đã giao Cố vấn xử lý
            </div>
          </div>

          {/* KPI 3 */}
          <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/70 to-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-800">
                3. Chất lượng dịch vụ (CSAT & SLA)
              </span>
              <HeartHandshake className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              4.86 / 5.0 ★
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
              <span>SLA đúng hạn: 97.4%</span>
              <span className="font-semibold text-sky-700">AI CSKH tự xử lý 78%</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-800">
                4. Tiến bộ học tập & Lấp lỗ hổng
              </span>
              <GraduationCap className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              +3.4 YCCĐ / tuần
            </div>
            <div className="text-xs text-slate-600 mt-1">
              89% học sinh dự báo kịp mục tiêu trường/ngành
            </div>
          </div>
        </div>
      </div>

      {/* 2. BỘ TÍNH GIÁ TỰ ĐỘNG THEO MA TRẬN HỆ SỐ B6 & CHI TRẢ KPI CHUYÊN GIA M11 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột Trái: Ma trận giá hệ số B6 */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cấu hình & Mô phỏng Ma trận Giá Hệ số (Phụ lục B6 & M10)
                </h3>
                <p className="text-xs text-slate-500">
                  Công thức: Giá 1 buổi = Giá gốc × Cấp chuyên gia × Cấp học × Hình thức × Kiểu lớp
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-semibold">
              Hệ số gộp: {quote.sessionBreakdown.combinedMultiplier}x
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Giá gốc */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giá gốc tham chiếu (1 buổi 90p - Admin cấu hình)
              </label>
              <input
                type="number"
                step={10000}
                value={basePriceVnd}
                onChange={(e) => setBasePriceVnd(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Cấp chuyên gia */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cấp chuyên gia (1.0 / 1.3 / 1.7)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {([1, 2, 3] as ExpertTier[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setExpertTier(t)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                      expertTier === t
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Cấp {t} ({t === 1 ? "1.0x" : t === 2 ? "1.3x" : "1.7x"})
                  </button>
                ))}
              </div>
            </div>

            {/* Lớp học */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lớp của học sinh (Tự suy hệ số cấp học)
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 bg-white focus:border-indigo-500 focus:outline-none"
              >
                <option value={4}>Lớp 4 – Tiểu học (Hệ số 0.8x)</option>
                <option value={7}>Lớp 7 – THCS (Hệ số 1.0x)</option>
                <option value={9}>Lớp 9 – Luyện thi vào 10 (Hệ số 1.4x)</option>
                <option value={10}>Lớp 10 – THPT (Hệ số 1.2x)</option>
                <option value={12}>Lớp 12 – Luyện thi Tốt nghiệp/ĐH (Hệ số 1.4x)</option>
              </select>
            </div>

            {/* Hình thức học */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hình thức học (Chọn linh hoạt từng buổi - M09.1)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: "ONLINE_ZOOM", label: "Zoom 1.0x", icon: <Video className="w-3 h-3" /> },
                    { id: "AT_CENTER", label: "Trung tâm 1.2x", icon: <Building className="w-3 h-3" /> },
                    { id: "AT_HOME", label: "Tại nhà 1.5x", icon: <Home className="w-3 h-3" /> },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setDeliveryMode(m.id)}
                    className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                      deliveryMode === m.id
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {m.icon}
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kiểu lớp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kiểu lớp (M09.2)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: "ONE_ON_ONE", label: "1 kèm 1 (1.0x)" },
                    { id: "SMALL_GROUP", label: "Nhóm 2-5 (0.6x)" },
                    { id: "LARGE_GROUP", label: "Nhóm 6-20 (0.35x)" },
                  ] as const
                ).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setClassType(c.id)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition ${
                      classType === c.id
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kỳ đóng & Ưu đãi đóng dài */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kỳ đóng & Ưu đãi đóng dài (B3-25: -3% / -7% / -12%)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {([1, 3, 6, 12] as BillingTermMonths[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setTermMonths(m)}
                    className={`py-2 px-1.5 rounded-xl text-xs font-semibold border transition ${
                      termMonths === m
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {m}T {m === 3 ? "(-3%)" : m === 6 ? "(-7%)" : m === 12 ? "(-12%)" : ""}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bảng kết quả tính giá tự động */}
          <div className="rounded-xl bg-slate-900 text-white p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <div className="text-[11px] text-slate-400">Đơn giá 1 buổi / HS</div>
              <div className="text-lg font-bold text-amber-300 mt-0.5">
                {quote.sessionBreakdown.unitSessionPriceVnd.toLocaleString("vi-VN")}đ
              </div>
              <div className="text-[10px] text-slate-400">
                = {basePriceVnd.toLocaleString("vi-VN")} × {quote.sessionBreakdown.combinedMultiplier}x
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">
                Học phí gốc ({termMonths} tháng · {quote.totalSessionsInTerm} buổi)
              </div>
              <div className="text-base font-semibold text-white mt-0.5">
                {quote.termGrossVnd.toLocaleString("vi-VN")}đ
              </div>
              <div className="text-[10px] text-slate-400">
                {sessionsPerWeek} buổi/tuần
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">
                Ưu đãi đóng dài ({quote.discountRate * 100}%)
              </div>
              <div className="text-base font-semibold text-emerald-400 mt-0.5">
                -{quote.discountAmountVnd.toLocaleString("vi-VN")}đ
              </div>
              <div className="text-[10px] text-slate-400">
                Hoàn 100% chưa học trong 14 ngày
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Thực thu kỳ này</div>
              <div className="text-lg font-bold text-emerald-300 mt-0.5">
                {quote.netPayableVnd.toLocaleString("vi-VN")}đ
              </div>
              <div className="text-[10px] text-indigo-300">
                Giá trị 6T (M18): {quote.sixMonthReferenceValueVnd.toLocaleString("vi-VN")}đ
              </div>
            </div>
          </div>
        </div>

        {/* Cột Phải: Thù lao cố định + Thưởng KPI Quý 10% (M11) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  M11 · Thù Lao Cố Định & Thưởng KPI Quý (Tối đa 10%)
                </h3>
                <p className="text-xs text-slate-500">
                  Không chia % học phí · Trả cố định theo buổi + KPI 4 tiêu chí
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600">
                Tổng thù lao cố định quý (VNĐ)
              </label>
              <input
                type="number"
                step={1000000}
                value={fixedPayQuarter}
                onChange={(e) => setFixedPayQuarter(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">
                Số học sinh phụ trách trong quý
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={activeStudentsCount}
                onChange={(e) =>
                  setActiveStudentsCount(Number(e.target.value) || 1)
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                1. Tiến bộ lấp lỗ hổng học sinh (Trọng số 40%)
              </span>
              <span className="font-bold text-indigo-600">{progressScore}/100</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={progressScore}
              onChange={(e) => setProgressScore(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />

            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                2. Kỷ luật: Biên bản đúng hạn 24h, không hủy sát giờ (20%)
              </span>
              <span className="font-bold text-indigo-600">{disciplineScore}/100</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={disciplineScore}
              onChange={(e) => setDisciplineScore(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />

            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                3. Điểm hài lòng CSAT sau buổi học (20%)
              </span>
              <span className="font-bold text-indigo-600">{csatScore}/100</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={csatScore}
              onChange={(e) => setCsatScore(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />

            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                4. Giữ chân / Gia hạn học tiếp với chuyên gia (20%)
              </span>
              <span className="font-bold text-indigo-600">{retentionScore}/100</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={retentionScore}
              onChange={(e) => setRetentionScore(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-medium text-slate-700">
                Thù lao Trưởng môn kiêm duyệt (`SUBJECT_LEAD` · 15.000đ/câu):
              </span>
              <input
                type="number"
                min={0}
                value={reviewItemsCount}
                onChange={(e) => setReviewItemsCount(Number(e.target.value) || 0)}
                className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-right text-xs font-semibold"
              />
            </div>
          </div>

          <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Điểm KPI tổng hợp:</span>
              <span className="font-bold text-slate-900">
                {kpiPayout.weightedKpiScore} điểm → Thưởng{" "}
                {(kpiPayout.bonusPercentage * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Tiền thưởng KPI Quý:</span>
              <span className="font-bold text-emerald-700">
                +{kpiPayout.kpiBonusVnd.toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Thù lao duyệt câu hỏi (SUBJECT_LEAD):</span>
              <span className="font-semibold text-indigo-700">
                +{kpiPayout.subjectLeadReviewPayVnd.toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="border-t border-amber-200 pt-1.5 flex items-center justify-between text-sm font-bold text-slate-900">
              <span>Tổng thu nhập Quý:</span>
              <span className="text-indigo-700">
                {kpiPayout.totalQuarterlyPayoutVnd.toLocaleString("vi-VN")}đ
              </span>
            </div>
            <p className="text-[11px] text-amber-800">{kpiPayout.note}</p>
          </div>
        </div>
      </div>

      {/* 3. QUẢN LÝ LỚP NHÓM CHỜ KHAI GIẢNG (M09.2 – ĐỦ SĨ SỐ MỚI KHAI GIẢNG) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                M09.2 · Điều Phối Lớp Nhóm Chờ Khai Giảng (Ghép Theo Lỗ Hổng YCCĐ Tương Đồng)
              </h3>
              <p className="text-xs text-slate-500">
                Quy tắc v0.9: Đủ sĩ số tối thiểu mới khai giảng. Nếu quá hạn chưa đủ: Chờ thêm / Chuyển lớp / Bù sang 1-1 / Hoàn tiền 100%.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classGroups.map((cg) => {
            const progressPct = Math.round((cg.enrolledCount / cg.maxSize) * 100);
            const canLaunch = cg.enrolledCount >= cg.minSize;

            return (
              <div
                key={cg.id}
                className="rounded-xl border border-slate-200 p-4 flex flex-col justify-between gap-3 bg-slate-50/40"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                      {cg.code}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        cg.status === "LAUNCHED"
                          ? "bg-emerald-100 text-emerald-800"
                          : canLaunch
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {cg.status === "LAUNCHED"
                        ? "ĐÃ KHAI GIẢNG & TẠO ZOOM"
                        : canLaunch
                        ? "ĐỦ SĨ SỐ TỐI THIỂU – SẴN SÀNG KHAI GIẢNG"
                        : `ĐANG CHỜ ĐỦ SĨ SỐ (${cg.enrolledCount}/${cg.minSize})`}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{cg.title}</h4>
                  <p className="text-xs text-slate-600">
                    Gia sư: <strong>{cg.tutorName}</strong> · Lịch: {cg.scheduleText}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cg.sharedGapUnits.map((u) => (
                      <span
                        key={u}
                        className="text-[11px] font-mono bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md"
                      >
                        Lỗ hổng chung: {u}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">
                      Sĩ số giữ chỗ: <strong>{cg.enrolledCount}</strong> / Tối thiểu{" "}
                      {cg.minSize} (Tối đa {cg.maxSize})
                    </span>
                    <span className="text-slate-500">
                      Hạn chốt: {cg.launchDeadline}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        canLaunch ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {cg.status !== "LAUNCHED" && cg.enrolledCount < cg.maxSize && (
                      <button
                        onClick={() => handleAddStudentToGroup(cg.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        + Ghép thêm 1 HS cùng lỗ hổng
                      </button>
                    )}
                    {cg.status !== "LAUNCHED" && (
                      <button
                        disabled={!canLaunch}
                        onClick={() => handleLaunchGroup(cg.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                          canLaunch
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Khai giảng & Tạo phòng Zoom
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
