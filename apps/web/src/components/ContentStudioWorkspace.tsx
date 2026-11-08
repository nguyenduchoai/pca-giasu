"use client";

import React, { useState } from "react";
import {
  APPROVAL_QUEUE_ITEMS,
  ReviewableQuestionItem,
} from "@/data/oylg-mock-data";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Award,
} from "lucide-react";

export function ContentStudioWorkspace() {
  const [items, setItems] = useState<ReviewableQuestionItem[]>(
    APPROVAL_QUEUE_ITEMS
  );
  const [toolkitFilter, setToolkitFilter] = useState<string>("ALL");
  const [reviewerNote, setReviewerNote] = useState<Record<string, string>>({});

  const filteredItems = items.filter((item) =>
    toolkitFilter === "ALL" ? true : item.toolkit === toolkitFilter
  );

  const approvedCount = items.filter(
    (i) => i.finalApprovalStatus === "APPROVED"
  ).length;
  const pendingCount = items.filter(
    (i) => i.finalApprovalStatus === "PENDING_TRACIE_ANH"
  ).length;

  const handleDecision = (
    id: string,
    decision: "APPROVED" | "RETURNED"
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, finalApprovalStatus: decision } : item
      )
    );
  };

  const handleApproveAllVerified = () => {
    setItems((prev) =>
      prev.map((item) =>
        item.subjectLeadStatus === "VERIFIED_BY_LEAD" && !item.statsFlag
          ? { ...item, finalApprovalStatus: "APPROVED" }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Studio duyệt học liệu */}
      <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              M04.3 & Phụ lục B1-9/10 · AI Content & Curriculum Approval Studio
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Màn Hình Duyệt Hàng Loạt Học Liệu & Đồ Thị YCCĐ — Cố Vấn Tracie Anh (`CONTENT_APPROVER`)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quy trình 2 bước (Chốt v1.0): AI soạn theo SGK Kết nối tri thức → Trưởng môn (Gia sư Cấp 3) rà chuyên môn → Cố vấn Tracie Anh duyệt cuối trước khi mở bán.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500">Tiến độ duyệt lô hiện tại</div>
              <div className="text-sm font-bold text-slate-900">
                Đã duyệt {approvedCount}/{items.length} · Chờ duyệt {pendingCount}
              </div>
            </div>
            <button
              onClick={handleApproveAllVerified}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Duyệt nhanh các câu Trưởng môn đã xác nhận (Không có cờ IRT)
            </button>
          </div>
        </div>

        {/* Bộ lọc theo Bộ công cụ B1-B4 */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {[
            { id: "ALL", label: "Tất cả Bộ công cụ (B1–B4)" },
            { id: "B1_CAREER", label: "B1 – Hướng nghiệp (RIASEC / Big Five)" },
            { id: "B2_KNOWLEDGE", label: "B2 – Tầm soát Kiến thức (5 môn Lớp 1–12)" },
            { id: "B3_MENTAL", label: "B3 – Sức khỏe Tinh thần & An toàn Tâm lý" },
            { id: "B4_PHYSICAL_SKILLS", label: "B4 – Thể chất & Kỹ năng sống" },
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
      </div>

      {/* Danh sách câu hỏi chờ duyệt */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border bg-white p-5 shadow-xs transition ${
              item.finalApprovalStatus === "APPROVED"
                ? "border-emerald-300 bg-emerald-50/20"
                : item.finalApprovalStatus === "RETURNED"
                ? "border-rose-300 bg-rose-50/20"
                : "border-slate-200"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
                  {item.code}
                </span>
                <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md">
                  {item.subject} · {item.gradeRange}
                </span>
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                  YCCĐ: {item.yccdCode}
                </span>
                {item.isSafetyTrigger && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Câu kích hoạt Cờ An toàn Tâm lý
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Đã rà bởi: {item.subjectLeadReviewer}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.finalApprovalStatus === "APPROVED"
                      ? "bg-emerald-600 text-white"
                      : item.finalApprovalStatus === "RETURNED"
                      ? "bg-rose-600 text-white"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.finalApprovalStatus === "APPROVED"
                    ? "✓ ĐÃ DUYỆT CUỐI (ACTIVE)"
                    : item.finalApprovalStatus === "RETURNED"
                    ? "✕ ĐÃ TRẢ LẠI SỬA"
                    : "CHỜ CỐ VẤN TRACIE ANH DUYỆT"}
                </span>
              </div>
            </div>

            {/* Cờ thống kê bất thường nếu có */}
            {item.statsFlag && (
              <div className="mt-3 rounded-xl bg-amber-50 border border-amber-300 px-3.5 py-2.5 flex items-center gap-2 text-xs text-amber-900 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{item.statsFlag}</span>
              </div>
            )}

            <div className="mt-3 space-y-2">
              <div className="text-sm font-semibold text-slate-900">
                {item.stem}
              </div>
              {item.formulaLatex && (
                <div className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto">
                  LaTeX (KaTeX Ready): {item.formulaLatex}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                {item.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs ${
                      item.correctAnswer && opt.startsWith(item.correctAnswer.slice(0, 2))
                        ? "border-emerald-300 bg-emerald-50/70 font-semibold text-emerald-950"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <input
                type="text"
                value={reviewerNote[item.id] ?? ""}
                onChange={(e) =>
                  setReviewerNote((prev) => ({
                    ...prev,
                    [item.id]: e.target.value,
                  }))
                }
                placeholder="Ghi chú của Cố vấn Tracie Anh (nếu yêu cầu chỉnh sửa thuật ngữ / đáp án nhiễu)..."
                className="flex-1 min-w-64 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecision(item.id, "RETURNED")}
                  className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Trả lại kèm ghi chú
                </button>
                <button
                  onClick={() => handleDecision(item.id, "APPROVED")}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Duyệt đưa vào Ngân hàng câu hỏi thật
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
