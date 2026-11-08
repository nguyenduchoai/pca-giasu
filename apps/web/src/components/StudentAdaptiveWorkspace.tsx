"use client";

import React, { useState } from "react";
import { usePlatform } from "@/lib/platform-store";
import {
  Sparkles,
  GitBranch,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCcw,
  Flame,
  Trophy,
  Compass,
  Heart,
  BookOpen,
} from "lucide-react";

interface AdaptiveStepQuestion {
  unitCode: string;
  grade: number;
  title: string;
  stem: string;
  formula: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    diagnosticReason: string;
  }>;
  socraticHint: string;
  onWrongNextUnitCode?: string;
}

const ADAPTIVE_MATH_STEPS: Record<string, AdaptiveStepQuestion> = {
  "TOAN.09.CBH.01": {
    unitCode: "TOAN.09.CBH.01",
    grade: 9,
    title: "Căn bậc hai & Hằng đẳng thức chứa căn (Trụ cột Lớp 9)",
    stem: "Rút gọn biểu thức sau với điều kiện x < 3:",
    formula: "A = √((x - 3)²) + x - 1",
    options: [
      {
        id: "A",
        text: "A = 2x - 4",
        isCorrect: false,
        diagnosticReason:
          "Sai do bỏ căn trực tiếp √((x - 3)²) = x - 3 mà quên hằng đẳng thức √(A²) = |A| và xét dấu khi x < 3.",
      },
      {
        id: "B",
        text: "A = 2",
        isCorrect: true,
        diagnosticReason:
          "Chính xác! Vì x < 3 nên |x - 3| = 3 - x, do đó A = (3 - x) + x - 1 = 2.",
      },
      {
        id: "C",
        text: "A = 4 - 2x",
        isCorrect: false,
        diagnosticReason: "Sai dấu khi cộng trừ đơn thức đồng dạng.",
      },
    ],
    socraticHint:
      "Gợi ý Socratic AI: Trước khi bỏ dấu căn của √((x - 3)²), em hãy nhớ lại: với x < 3 thì biểu thức (x - 3) mang dấu âm hay dương?",
    onWrongNextUnitCode: "TOAN.08.HDT.01",
  },
  "TOAN.08.HDT.01": {
    unitCode: "TOAN.08.HDT.01",
    grade: 8,
    title: "7 Hằng đẳng thức đáng nhớ (Truy ngược Tiên quyết Lớp 8)",
    stem: "Hệ thống nhận thấy em cần kiểm tra lại nền tảng Lớp 8. Hãy khai triển hằng đẳng thức bình phương của một hiệu:",
    formula: "(2x - 3)² = ?",
    options: [
      {
        id: "A",
        text: "4x² - 9",
        isCorrect: false,
        diagnosticReason:
          "Nhầm lẫn giữa Bình phương một hiệu (A - B)² và Hiệu hai bình phương A² - B².",
      },
      {
        id: "B",
        text: "4x² - 12x + 9",
        isCorrect: true,
        diagnosticReason:
          "Chính xác! (2x)² - 2·(2x)·3 + 3² = 4x² - 12x + 9.",
      },
      {
        id: "C",
        text: "2x² - 6x + 9",
        isCorrect: false,
        diagnosticReason: "Quên bình phương hệ số 2 của hạng tử (2x)².",
      },
    ],
    socraticHint:
      "Gợi ý Socratic AI: Công thức (A - B)² có 3 hạng tử là A² - 2AB + B². Ở đây A = 2x và B = 3, vậy 2·A·B bằng bao nhiêu?",
    onWrongNextUnitCode: "TOAN.07.SHT.02",
  },
  "TOAN.07.SHT.02": {
    unitCode: "TOAN.07.SHT.02",
    grade: 7,
    title: "Phép tính Số hữu tỉ & Lũy thừa (Truy ngược Tiên quyết Lớp 7)",
    stem: "Kiểm tra gốc Số hữu tỉ Lớp 7 để xác định điểm bắt đầu lấp nền:",
    formula: "Tính giá trị của (-3)² - 2 · (-5)",
    options: [
      {
        id: "A",
        text: "19",
        isCorrect: true,
        diagnosticReason:
          "Chính xác! (-3)² = 9 và -2 · (-5) = +10, tổng bằng 19. Vậy gốc Lớp 7 của em ĐẠT -> Lỗ hổng gốc nằm ở TOAN.08.HDT.01 (Lớp 8)!",
      },
      {
        id: "B",
        text: "-1",
        isCorrect: false,
        diagnosticReason: "Sai quy tắc dấu khi nhân hai số âm.",
      },
    ],
    socraticHint:
      "Gợi ý Socratic AI: Bình phương của một số âm (-3)² mang dấu gì? Và tích của (-2) nhân (-5) mang dấu gì?",
  },
};

export function StudentAdaptiveWorkspace() {
  const { studentCases, selectedStudentId, setSelectedStudentId } =
    usePlatform();
  const activeStudent =
    studentCases.find((s) => s.id === selectedStudentId) ?? studentCases[0];

  const [ageTheme, setAgeTheme] = useState<"TEEN_6_12" | "KIDS_1_5">(
    activeStudent.grade <= 5 ? "KIDS_1_5" : "TEEN_6_12"
  );
  const [currentUnitCode, setCurrentUnitCode] =
    useState<string>("TOAN.09.CBH.01");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showSocraticHint, setShowSocraticHint] = useState<boolean>(false);
  const [traceLog, setTraceLog] = useState<
    Array<{
      unitCode: string;
      grade: number;
      isCorrect: boolean;
      actionTaken: string;
    }>
  >([]);
  const [rootGapFound, setRootGapFound] = useState<string | null>(null);
  const [dailyTasks, setDailyTasks] = useState([
    {
      id: "dt-1",
      tag: "Bù lỗ hổng 60%",
      title: "Ôn nhanh 7 Hằng đẳng thức đáng nhớ (TOAN.08.HDT.01)",
      duration: "15 phút",
      xp: 50,
      done: true,
    },
    {
      id: "dt-2",
      tag: "Bám lớp 40%",
      title: "Giải 4 bài rút gọn biểu thức chứa căn bậc hai Lớp 9",
      duration: "20 phút",
      xp: 80,
      done: false,
    },
    {
      id: "dt-3",
      tag: "Kỹ năng & Ngoại ngữ",
      title: "Luyện nghe 1 đoạn hội thoại Tiếng Anh chủ đề Công nghệ AI",
      duration: "10 phút",
      xp: 40,
      done: false,
    },
  ]);
  const [studentMood, setStudentMood] = useState<string>("Hào hứng & Tập trung");
  const [moodSavedNotice, setMoodSavedNotice] = useState<string | null>(null);

  const toggleDailyTask = (taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );
  };

  const currentQ = ADAPTIVE_MATH_STEPS[currentUnitCode];

  const handleSelectAnswer = (opt: AdaptiveStepQuestion["options"][number]) => {
    setSelectedOptionId(opt.id);

    if (opt.isCorrect) {
      if (currentQ.unitCode === "TOAN.09.CBH.01") {
        setTraceLog((prev) => [
          ...prev,
          {
            unitCode: currentQ.unitCode,
            grade: currentQ.grade,
            isCorrect: true,
            actionTaken:
              "ĐẠT YCCĐ trụ cột Lớp 9 → Suy luận ĐẠT toàn bộ nhánh tiên quyết Lớp 8 & Lớp 7 (Bỏ qua 18 câu hỏi nhánh dưới!)",
          },
        ]);
        setRootGapFound("KHÔNG CÓ LỖ HỔNG – ĐÃ VỮNG TRỤ CỘT LỚP 9");
      } else {
        const failedParent =
          currentQ.unitCode === "TOAN.07.SHT.02"
            ? "TOAN.08.HDT.01 (Lớp 8)"
            : "TOAN.09.CBH.01 (Lớp 9)";
        setTraceLog((prev) => [
          ...prev,
          {
            unitCode: currentQ.unitCode,
            grade: currentQ.grade,
            isCorrect: true,
            actionTaken: `ĐẠT nền Lớp ${currentQ.grade} → Chốt LỖ HỔNG GỐC tại ${failedParent}!`,
          },
        ]);
        setRootGapFound(failedParent);
      }
    } else {
      const nextCode = currentQ.onWrongNextUnitCode;
      setTraceLog((prev) => [
        ...prev,
        {
          unitCode: currentQ.unitCode,
          grade: currentQ.grade,
          isCorrect: false,
          actionTaken: nextCode
            ? `CHƯA ĐẠT Lớp ${currentQ.grade} → Thuật toán Adaptive tự động truy ngược về tiên quyết ${nextCode}`
            : `CHƯA ĐẠT Lớp ${currentQ.grade} → Xác định LỖ HỔNG GỐC tại ${currentQ.unitCode}`,
        },
      ]);
      if (!nextCode) {
        setRootGapFound(`${currentQ.unitCode} (Lớp ${currentQ.grade})`);
      }
    }
  };

  const handleNextAdaptiveStep = () => {
    if (currentQ.onWrongNextUnitCode) {
      setCurrentUnitCode(currentQ.onWrongNextUnitCode);
      setSelectedOptionId(null);
      setShowSocraticHint(false);
    }
  };

  const handleReset = () => {
    setCurrentUnitCode("TOAN.09.CBH.01");
    setSelectedOptionId(null);
    setShowSocraticHint(false);
    setTraceLog([]);
    setRootGapFound(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Không gian học sinh + Chuyển đổi giao diện theo độ tuổi */}
      <div
        className={`rounded-2xl border p-5 shadow-xs transition ${
          ageTheme === "KIDS_1_5"
            ? "bg-gradient-to-r from-amber-50 via-orange-50 to-sky-50 border-amber-200"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Không Gian Học Tập Của {activeStudent.fullName} (Lớp{" "}
                {activeStudent.grade})
              </span>
              <span className="text-[11px] text-slate-400 whitespace-nowrap">
                Tài khoản demo:
              </span>
              {studentCases.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setSelectedStudentId(st.id);
                    setAgeTheme(st.grade <= 5 ? "KIDS_1_5" : "TEEN_6_12");
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                    st.id === activeStudent.id
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st.fullName}
                </button>
              ))}
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1.5">
              {ageTheme === "KIDS_1_5"
                ? "Hành Trình Nhà Thám Hiểm Tri Thức (Chế độ Tiểu học Lớp 1–5)"
                : "Phiên Tầm Soát Thích Ứng & Lộ Trình Mục Tiêu (THCS & THPT Lớp 6–12)"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
              <Flame className="w-4 h-4 text-orange-500" />
              Streak: 14 ngày
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800">
              <Trophy className="w-4 h-4 text-indigo-600" />
              Huy hiệu: Chiến thần Lấp Nền
            </div>
            <button
              onClick={() =>
                setAgeTheme(ageTheme === "TEEN_6_12" ? "KIDS_1_5" : "TEEN_6_12")
              }
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
            >
              Đổi giao diện:{" "}
              {ageTheme === "TEEN_6_12"
                ? "Xem thử Chế độ Tiểu học (Lớp 1–5)"
                : "Quay lại Chế độ THCS/THPT (Lớp 6–12)"}
            </button>
          </div>
        </div>
      </div>

      {/* Trải nghiệm trực tiếp Thuật toán Tầm soát Thích ứng (Adaptive Knowledge Tracing) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột Trái: Câu hỏi thích ứng hiện tại */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-mono font-bold">
                {currentQ.unitCode} · Lớp {currentQ.grade}
              </span>
              <span className="text-xs font-bold text-slate-800">
                {currentQ.title}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm lại từ Lớp 9
            </button>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-900">
              {currentQ.stem}
            </p>
            <div className="p-3 rounded-xl bg-slate-900 text-amber-300 font-mono text-base font-bold tracking-wide">
              {currentQ.formula}
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-500">
              💡 Mẹo kiểm thử: Hãy thử bấm chọn <strong>Đáp án A (Sai)</strong> để xem thuật toán tự động lùi từ Lớp 9 → Lớp 8 → Lớp 7 truy tìm Lỗ hổng gốc!
            </div>
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  disabled={selectedOptionId !== null}
                  onClick={() => handleSelectAnswer(opt)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition flex items-start justify-between gap-3 ${
                    !isSelected
                      ? "border-slate-200 bg-white hover:border-indigo-400 text-slate-800"
                      : opt.isCorrect
                      ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold"
                      : "border-rose-500 bg-rose-50 text-rose-950 font-semibold"
                  }`}
                >
                  <div>
                    <span className="font-bold mr-2">{opt.id}.</span>
                    <span>{opt.text}</span>
                    {isSelected && (
                      <p className="mt-1.5 text-[11px] opacity-90 font-normal">
                        → Chẩn đoán: {opt.diagnosticReason}
                      </p>
                    )}
                  </div>
                  {isSelected &&
                    (opt.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    ))}
                </button>
              );
            })}
          </div>

          {/* Thanh công cụ Socratic AI Hint & Bước tiếp theo */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => setShowSocraticHint(!showSocraticHint)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              Hỏi Socratic AI (Gợi mở tư duy, không giải hộ)
            </button>

            {selectedOptionId &&
              !currentQ.options.find((o) => o.id === selectedOptionId)
                ?.isCorrect &&
              currentQ.onWrongNextUnitCode && (
                <button
                  onClick={handleNextAdaptiveStep}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 animate-pulse"
                >
                  Tiếp tục: Truy ngược xuống {currentQ.onWrongNextUnitCode} →
                </button>
              )}
          </div>

          {showSocraticHint && (
            <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 text-xs text-amber-950">
              {currentQ.socraticHint}
            </div>
          )}
        </div>

        {/* Cột Phải: Nhật ký suy luận của Thuật toán Adaptive (M06.2) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <GitBranch className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Động Cơ Truy Ngược Đồ Thị Tiên Quyết (Mục 6.2)
              </h3>
              <p className="text-xs text-slate-500">
                Chuyển câu &lt; 500ms (Deterministic) · Không chờ LLM khi chấm
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {traceLog.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                Hãy chọn 1 đáp án ở bên trái để xem thuật toán quyết định bỏ qua nhánh dưới hay truy ngược tìm lỗ hổng gốc.
              </div>
            ) : (
              traceLog.map((step, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-3 text-xs space-y-1 ${
                    step.isCorrect
                      ? "border-emerald-200 bg-emerald-50/60 text-emerald-950"
                      : "border-rose-200 bg-rose-50/60 text-rose-950"
                  }`}
                >
                  <div className="font-mono font-bold">
                    Bước {i + 1}: {step.unitCode} (Lớp {step.grade}) —{" "}
                    {step.isCorrect ? "ĐÚNG" : "SAI"}
                  </div>
                  <p className="text-[11px]">{step.actionTaken}</p>
                </div>
              ))
            )}
          </div>

          {rootGapFound && (
            <div className="rounded-xl bg-slate-900 text-white p-4 space-y-1.5">
              <div className="text-[11px] font-mono text-amber-300 uppercase">
                Kết luận của Phiên tầm soát thích ứng
              </div>
              <div className="text-sm font-bold">
                Điểm bắt đầu lấp nền: {rootGapFound}
              </div>
              <p className="text-xs text-slate-300">
                Hệ thống tự động đẩy YCCĐ này vào Luồng Bổ trợ (60%) trong Kế hoạch môn Toán của Gia sư và cập nhật Bản đồ nhiệt.
              </p>
            </div>
          )}

          {/* Mục tiêu truyền động lực của học sinh (M13) */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 space-y-1">
            <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600" />
              Mục tiêu tương lai của {activeStudent.fullName} (Mã R1:{" "}
              {activeStudent.careerGoal.riasecCode})
            </div>
            <p className="text-xs text-indigo-900">
              {activeStudent.careerGoal.targetUniversity} →{" "}
              <strong>{activeStudent.careerGoal.targetCareer}</strong>. Mỗi YCCĐ
              lấp xong giúp em tiến gần hơn 4% tới mục tiêu!
            </p>
          </div>
        </div>
      </div>

      {/* Nhiệm vụ Bù lỗ hổng hôm nay (60/40) & Check-in Năng lượng học tập (B3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Nhiệm Vụ Học Tập Hôm Nay (Tỷ lệ 60% Lấp Nền / 40% Bám Lớp)
                </h3>
                <p className="text-xs text-slate-500">
                  Bấm vào từng nhiệm vụ để đánh dấu hoàn thành và nhận điểm XP
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Đã xong {dailyTasks.filter((t) => t.done).length}/
              {dailyTasks.length} nhiệm vụ
            </span>
          </div>

          <div className="space-y-2">
            {dailyTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleDailyTask(task.id)}
                className={`w-full text-left rounded-xl border p-3.5 flex items-center justify-between gap-3 transition ${
                  task.done
                    ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                    : "border-slate-200 bg-slate-50/60 hover:bg-white text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${
                      task.done ? "text-emerald-600" : "text-slate-300"
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {task.tag}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        ⏱ {task.duration}
                      </span>
                    </div>
                    <div
                      className={`text-xs font-bold mt-1 ${
                        task.done ? "line-through text-slate-500" : ""
                      }`}
                    >
                      {task.title}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
                  +{task.xp} XP
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Heart className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Check-in Cảm Xúc & Năng Lượng Học Tập (Trụ cột Tinh thần B3)
              </h3>
              <p className="text-xs text-slate-500">
                Giúp Cố vấn Cuộc sống điều chỉnh khối lượng bài tập phù hợp cho em
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {[
              {
                label: "Hào hứng & Tập trung",
                desc: "Sẵn sàng chinh phục cả bài nâng cao hôm nay!",
              },
              {
                label: "Bình thường & Ổn định",
                desc: "Duy trì tiến độ học tập tiêu chuẩn 60/40.",
              },
              {
                label: "Hơi mệt / Áp lực lịch thi trên trường",
                desc: "Đề xuất Cố vấn giảm 50% bài tập về nhà hôm nay.",
              },
            ].map((m) => (
              <button
                key={m.label}
                onClick={() => {
                  setStudentMood(m.label);
                  setMoodSavedNotice(
                    `Đã gửi trạng thái "${m.label}" tới Cố vấn Cuộc sống phụ trách.`
                  );
                  setTimeout(() => setMoodSavedNotice(null), 4000);
                }}
                className={`text-left p-3 rounded-xl border text-xs transition ${
                  studentMood === m.label
                    ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="font-bold">{m.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>

          {moodSavedNotice && (
            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{moodSavedNotice}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
