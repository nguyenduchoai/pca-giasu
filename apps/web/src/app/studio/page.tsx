"use client";

import React, { useState } from "react";
import { usePlatform } from "@/lib/platform-store";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Award,
  PlusCircle,
} from "lucide-react";

export default function ContentStudioPage() {
  const {
    questions,
    decideQuestionApproval,
    addAiGeneratedQuestion,
  } = usePlatform();

  const [toolkitFilter, setToolkitFilter] = useState<string>("ALL");
  const [genSubject, setGenSubject] = useState<string>("Toán (Lớp 9)");
  const [genYccd, setGenYccd] = useState<string>("TOAN.09.HPT.02");
  const [genPrompt, setGenPrompt] = useState<string>(
    "Tạo câu hỏi trắc nghiệm chẩn đoán học sinh nhầm dấu khi thế nghiệm vào hệ phương trình bậc nhất hai ẩn"
  );

  const filteredItems = questions.filter((item) =>
    toolkitFilter === "ALL" ? true : item.toolkit === toolkitFilter
  );

  const approvedCount = questions.filter(
    (i) => i.finalApprovalStatus === "APPROVED"
  ).length;
  const pendingCount = questions.filter(
    (i) => i.finalApprovalStatus === "PENDING_TRACIE_ANH"
  ).length;

  const handleGenerateQuestionWithAi = (e: React.FormEvent) => {
    e.preventDefault();
    addAiGeneratedQuestion({
      code: `Q-B2-${genYccd.replace(/\./g, "")}-${Math.floor(Math.random() * 90 + 10)}`,
      toolkit: "B2_KNOWLEDGE",
      subject: genSubject,
      gradeRange: "Lớp 8 – Lớp 9",
      yccdCode: `${genYccd} (Tiên quyết: TOAN.08.PTB1.03)`,
      questionType: "Trắc nghiệm chẩn đoán lỗ hổng (AI Sinh)",
      stem: `[AI Sinh theo yêu cầu: "${genPrompt}"] Cho hệ phương trình 2x - y = 5 và x + 2y = 5. Cặp nghiệm (x; y) nào sau đây thỏa mãn hệ?`,
      formulaLatex: "\\begin{cases} 2x - y = 5 \\\\ x + 2y = 5 \\end{cases}",
      options: [
        "A. (x = 3; y = 1) (Đáp án đúng – Thực hiện đúng phép thế và cộng đại số)",
        "B. (x = 1; y = 3) (Lỗi đảo thứ tự nghiệm x và y)",
        "C. (x = 3; y = -1) (Lỗi sai dấu khi chuyển vế -y = 5 - 2x)",
        "D. (x = 2; y = 1) (Lỗi tính nhẩm sai hệ số)",
      ],
      correctAnswer: "A. (x = 3; y = 1)",
      aiConfidence: 96,
      subjectLeadReviewer: "Thầy Đặng Quốc Việt (Trưởng môn Toán – Đã rà)",
      subjectLeadStatus: "VERIFIED_BY_LEAD",
      finalApprovalStatus: "PENDING_TRACIE_ANH",
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. CÔNG CỤ AI SOẠN CÂU HỎI MỚI THEO YCCĐ CHƯƠNG TRÌNH GDPT 2018 */}
      <form
        onSubmit={handleGenerateQuestionWithAi}
        className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-xs space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">
                AI Soạn Học Liệu & Ngân Hàng Câu Hỏi Theo Đồ Thị YCCĐ (GDPT 2018)
              </h1>
              <p className="text-xs text-slate-500">
                Bám sát bộ SGK Kết nối tri thức với cuộc sống · Tự động tạo phương án nhiễu chẩn đoán đúng lỗi sai của học sinh
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Môn & Khối lớp
            </label>
            <select
              value={genSubject}
              onChange={(e) => setGenSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold bg-white"
            >
              <option value="Toán (Lớp 9)">Toán (Lớp 9)</option>
              <option value="Toán (Lớp 8)">Toán (Lớp 8)</option>
              <option value="Tiếng Anh (Lớp 10)">Tiếng Anh (Lớp 10)</option>
              <option value="Vật Lý (Lớp 11)">Vật Lý (Lớp 11)</option>
              <option value="Hóa Học (Lớp 10)">Hóa Học (Lớp 10)</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mã Yêu cầu cần đạt (YCCĐ)
            </label>
            <input
              type="text"
              value={genYccd}
              onChange={(e) => setGenYccd(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold"
            />
          </div>
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mục tiêu chẩn đoán lỗ hổng
            </label>
            <input
              type="text"
              value={genPrompt}
              onChange={(e) => setGenPrompt(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
            />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              AI Sinh Câu Hỏi
            </button>
          </div>
        </div>
      </form>

      {/* 2. HÀNG ĐỢI DUYỆT CUỐI CỦA CỐ VẤN TRACIE ANH */}
      <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Hàng Đợi Phê Duyệt Cuối — Cố Vấn Tracie Anh & Hội Đồng Trưởng Môn
            </h2>
            <p className="text-xs text-slate-500">
              Chỉ các câu hỏi ở trạng thái ĐÃ DUYỆT mới được đưa vào phiên đánh giá thật của học sinh
            </p>
          </div>
          <div className="text-xs font-bold text-slate-800 bg-purple-50 border border-purple-200 px-3.5 py-2 rounded-xl">
            Đã duyệt: {approvedCount}/{questions.length} · Đang chờ duyệt:{" "}
            <span className="text-purple-700">{pendingCount}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {[
            { id: "ALL", label: "Tất cả Bộ công cụ (B1–B4)" },
            { id: "B1_CAREER", label: "B1 – Hướng nghiệp" },
            { id: "B2_KNOWLEDGE", label: "B2 – Tầm soát Kiến thức" },
            { id: "B3_MENTAL", label: "B3 – Sức khỏe Tinh thần" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setToolkitFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                toolkitFilter === tab.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 transition ${
                item.finalApprovalStatus === "APPROVED"
                  ? "border-emerald-300 bg-emerald-50/20"
                  : item.finalApprovalStatus === "RETURNED"
                  ? "border-rose-300 bg-rose-50/20"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
                    {item.code}
                  </span>
                  <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md">
                    {item.subject}
                  </span>
                  <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                    {item.yccdCode}
                  </span>
                  {item.isSafetyTrigger && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Câu kích hoạt Cờ An toàn
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {item.subjectLeadReviewer}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      item.finalApprovalStatus === "APPROVED"
                        ? "bg-emerald-600 text-white"
                        : item.finalApprovalStatus === "RETURNED"
                        ? "bg-rose-600 text-white"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.finalApprovalStatus === "APPROVED"
                      ? "✓ Đã duyệt"
                      : item.finalApprovalStatus === "RETURNED"
                      ? "✕ Trả lại sửa"
                      : "Chờ duyệt cuối"}
                  </span>
                </div>
              </div>

              {item.statsFlag && (
                <div className="mt-2.5 rounded-xl bg-amber-50 border border-amber-300 px-3 py-2 flex items-center gap-2 text-xs text-amber-900 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{item.statsFlag}</span>
                </div>
              )}

              <div className="mt-2.5 space-y-2">
                <div className="text-sm font-semibold text-slate-900">
                  {item.stem}
                </div>
                {item.formulaLatex && (
                  <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs">
                    Công thức: {item.formulaLatex}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => decideQuestionApproval(item.id, "RETURNED")}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Yêu cầu chỉnh sửa
                </button>
                <button
                  onClick={() => decideQuestionApproval(item.id, "APPROVED")}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Phê duyệt đưa vào Ngân hàng câu hỏi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
