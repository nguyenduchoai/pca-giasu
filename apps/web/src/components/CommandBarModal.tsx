"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Calculator,
  GitBranch,
  CheckCircle2,
  UserCheck,
  MessageSquare,
  Building2,
  X,
} from "lucide-react";

export type WorkspaceTabId =
  | "EXECUTIVE"
  | "COACH_EXPERT"
  | "CONTENT_STUDIO"
  | "FAMILY_PARENT"
  | "STUDENT_SPACE"
  | "SALES_CARE_BOARDING";

interface CommandBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateWorkspace: (tab: WorkspaceTabId, highlightNote?: string) => void;
}

interface AiCommandOption {
  id: string;
  title: string;
  subtitle: string;
  moduleTag: string;
  targetTab: WorkspaceTabId;
  badgeColor: string;
  icon: React.ReactNode;
}

const COMMAND_OPTIONS: AiCommandOption[] = [
  {
    id: "cmd-heatmap",
    title: "Mở Bản đồ nhiệt Kiến thức 4D & Truy ngược lỗ hổng gốc (Toán 6→11)",
    subtitle: "Kéo thanh trượt Tuần 1 → Tuần 12 xem ô Đỏ TOAN.08.HDT.01 chuyển sang Xanh",
    moduleTag: "Đồ thị YCCĐ 4D",
    targetTab: "COACH_EXPERT",
    badgeColor: "bg-indigo-100 text-indigo-700",
    icon: <GitBranch className="w-4 h-4 text-indigo-600" />,
  },
  {
    id: "cmd-tracie",
    title: "Màn hình Duyệt hàng loạt câu hỏi AI & YCCĐ (Cố vấn Tracie Anh)",
    subtitle: "Duyệt nhanh bằng phím tắt, kiểm tra cờ độ phân biệt IRT âm và câu kích hoạt an toàn",
    moduleTag: "Xưởng Nội dung",
    targetTab: "CONTENT_STUDIO",
    badgeColor: "bg-purple-100 text-purple-700",
    icon: <CheckCircle2 className="w-4 h-4 text-purple-600" />,
  },
  {
    id: "cmd-pricing",
    title: "Mô phỏng Bảng giá Hệ số B6 & Thưởng KPI Quý 10% Chuyên gia",
    subtitle: "Giá gốc × Cấp chuyên gia × Cấp học × Hình thức (Zoom/Trung tâm/Nhà) × Kiểu lớp",
    moduleTag: "Học phí & KPI",
    targetTab: "EXECUTIVE",
    badgeColor: "bg-emerald-100 text-emerald-700",
    icon: <Calculator className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: "cmd-parent-ai",
    title: "Trợ lý AI CSKH 24/7 với Generative UI Cards & Đổi hình thức buổi học",
    subtitle: "Trả lời từ kho tri thức chuẩn đã duyệt, hiện Thẻ Dời Lịch, Thẻ Đổi Zoom↔Nhà & VietQR",
    moduleTag: "Cổng Phụ huynh",
    targetTab: "FAMILY_PARENT",
    badgeColor: "bg-sky-100 text-sky-700",
    icon: <MessageSquare className="w-4 h-4 text-sky-600" />,
  },
  {
    id: "cmd-student-assess",
    title: "Làm thử Phiên Tầm Soát Thích Ứng (Adaptive Assessment) < 500ms",
    subtitle: "Trả lời sai câu Lớp 9 → Thuật toán tự động lùi xuống Lớp 8 & Lớp 7 tìm lỗ hổng gốc",
    moduleTag: "Cổng Học sinh",
    targetTab: "STUDENT_SPACE",
    badgeColor: "bg-amber-100 text-amber-700",
    icon: <Sparkles className="w-4 h-4 text-amber-600" />,
  },
  {
    id: "cmd-commission",
    title: "Tính Hoa hồng 2 cấp đúng pháp luật & POS Hội thảo",
    subtitle: "CTV 10% + Leader 5%, Leader tự bán 15% trên max(kỳ đầu, 6 tháng), chi dần theo tiền thực thu",
    moduleTag: "Tư vấn & Đối soát",
    targetTab: "SALES_CARE_BOARDING",
    badgeColor: "bg-rose-100 text-rose-700",
    icon: <UserCheck className="w-4 h-4 text-rose-600" />,
  },
  {
    id: "cmd-boarding",
    title: "Kiosk Quản sinh Nội trú & Bán trú – Xác thực ảnh người đón an toàn",
    subtitle: "Quét QR 4 mốc/ngày, chặn người đón lạ ngoài danh sách được ủy quyền, cảnh báo dị ứng",
    moduleTag: "An toàn Nội trú",
    targetTab: "SALES_CARE_BOARDING",
    badgeColor: "bg-teal-100 text-teal-700",
    icon: <Building2 className="w-4 h-4 text-teal-600" />,
  },
  {
    id: "cmd-safety",
    title: "Kiểm thử Rào chắn Chống lộ SĐT/Zalo & Cảnh báo An toàn Tâm lý (111/115)",
    subtitle: "Tự động che SĐT viết bằng chữ và kích hoạt quy trình khẩn cấp bảo vệ trẻ vị thành niên",
    moduleTag: "Rào chắn An toàn",
    targetTab: "COACH_EXPERT",
    badgeColor: "bg-red-100 text-red-700",
    icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
  },
];

export function CommandBarModal({
  isOpen,
  onClose,
  onNavigateWorkspace,
}: CommandBarModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = COMMAND_OPTIONS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.moduleTag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-slate-950/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-indigo-100 overflow-hidden">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-gradient-to-r from-indigo-50/60 via-white to-emerald-50/40">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Gõ lệnh AI hoặc tìm phân hệ (VD: 'lỗ hổng gốc', 'hoa hồng 6 tháng', 'Tracie Anh', 'nội trú', 'B6')..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Không tìm thấy tác vụ phù hợp với &ldquo;{query}&rdquo;. Hãy thử từ khóa &ldquo;Toán&rdquo;, &ldquo;B6&rdquo;, &ldquo;hoa hồng&rdquo; hoặc &ldquo;an toàn&rdquo;.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigateWorkspace(item.targetTab, item.title);
                  onClose();
                }}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-indigo-50/60 transition text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-white transition mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">
                        {item.title}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${item.badgeColor}`}
                      >
                        {item.moduleTag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Footer Guardrail Status */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Gateway: Ẩn danh dữ liệu trẻ em (NĐ 13/2023) · Không tự gửi nội dung chưa duyệt
          </span>
          <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
            ESC để đóng
          </span>
        </div>
      </div>
    </div>
  );
}
