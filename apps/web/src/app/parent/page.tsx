"use client";

import React, { useState } from "react";
import { usePlatform } from "@/lib/platform-store";
import {
  calculateModeSwitchDiff,
  detectSafetyRisk,
  DeliveryMode,
} from "@oylg/shared";
import { APPROVED_KB_ANSWERS } from "@/data/oylg-mock-data";
import {
  Compass,
  Calendar,
  Video,
  Building,
  Home,
  MessageSquare,
  Send,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Clock,
  FileText,
  ShoppingBag,
  RotateCcw,
  Users,
  CreditCard,
  Headphones,
} from "lucide-react";

interface ChatTurn {
  id: string;
  sender: "USER" | "AI";
  text: string;
  kbCitation?: string;
  cardType?:
    | "RESCHEDULE_CARD"
    | "MODE_SWITCH_CARD"
    | "PAYOS_QR_CARD"
    | "HUMAN_TICKET_CARD"
    | "SAFETY_EMERGENCY_CARD";
}

export default function ParentPortalPage() {
  const {
    studentCases,
    selectedStudentId,
    setSelectedStudentId,
    bookings,
    updateBookingMode,
    rescheduleBooking,
    lessonLogs,
    boardingLogs,
    baseSessionPriceVnd,
    ecomOrders,
    requestOrderRefund14d,
    setIsCartOpen,
  } = usePlatform();

  const child =
    studentCases.find((s) => s.id === selectedStudentId) ?? studentCases[0];

  const childBookings = bookings.filter((b) => b.studentCode === child.code);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const activeBooking =
    childBookings.find((b) => b.id === selectedBookingId) ??
    childBookings[0] ??
    bookings[0];

  const childLessonLogs = lessonLogs.filter(
    (l) => l.studentName === child.fullName
  );
  const displayedLessonLogs =
    childLessonLogs.length > 0 ? childLessonLogs : lessonLogs;

  const childBoardingLogs = boardingLogs.filter(
    (b) => b.studentCode === child.code
  );
  const displayedBoardingLogs =
    childBoardingLogs.length > 0 ? childBoardingLogs : boardingLogs.slice(0, 2);

  const [targetMode, setTargetMode] = useState<DeliveryMode>(
    activeBooking?.mode ?? "AT_CENTER"
  );
  const [modeSavedNotice, setModeSavedNotice] = useState<string | null>(null);
  const [rescheduleSavedNotice, setRescheduleSavedNotice] = useState<
    string | null
  >(null);
  const [refundSavedNotice, setRefundSavedNotice] = useState<string | null>(
    null
  );

  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([
    {
      id: "w-1",
      sender: "AI",
      text: `Xin chào ${child.parentName}! Em là Trợ lý AI CSKH 24/7 của All Your Life. Em kết nối trực tiếp với lịch học, ví buổi học và hồ sơ của bé ${child.fullName}. Anh/chị cần dời lịch, đổi hình thức học hay tra cứu học phí ạ?`,
      kbCitation: "Kho câu trả lời chuẩn đã duyệt",
    },
  ]);

  const modeDiff = calculateModeSwitchDiff(
    {
      basePriceVnd: baseSessionPriceVnd,
      expertTier: activeBooking?.expertTier ?? 3,
      grade: child.grade,
      classType: activeBooking?.classType ?? "ONE_ON_ONE",
    },
    activeBooking?.mode ?? "AT_CENTER",
    targetMode
  );

  const handleApplyModeChange = () => {
    if (!activeBooking) return;
    updateBookingMode(activeBooking.id, targetMode);
    setModeSavedNotice(
      `Đã cập nhật hình thức buổi học "${activeBooking.title}" sang ${
        targetMode === "ONLINE_ZOOM"
          ? "Online qua Zoom"
          : targetMode === "AT_CENTER"
          ? "Tại Trung tâm"
          : "Tại nhà học sinh"
      }.`
    );
    setTimeout(() => setModeSavedNotice(null), 4000);
  };

  const handleSendChat = (presetText?: string) => {
    const query = (presetText ?? chatInput).trim();
    if (!query) return;

    const userTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      sender: "USER",
      text: query,
    };

    const safety = detectSafetyRisk(query);
    if (safety.level === "HIGH" || safety.level === "MEDIUM") {
      setChatHistory((prev) => [
        ...prev,
        userTurn,
        {
          id: `ai-${Date.now()}`,
          sender: "AI",
          text: "TÍN HIỆU KHẨN CẤP AN TOÀN HỌC SINH: Hệ thống đã gửi cảnh báo tức thời đến Cố vấn cuộc sống phụ trách và bộ phận Tâm lý học đường. Vui lòng liên hệ ngay Tổng đài Quốc gia Bảo vệ Trẻ em 111 (miễn phí 24/7) hoặc 115.",
          cardType: "SAFETY_EMERGENCY_CARD",
        },
      ]);
      setChatInput("");
      return;
    }

    const lower = query.toLowerCase();
    const matchedKb = APPROVED_KB_ANSWERS.find((kb) =>
      kb.triggers.some((t) => lower.includes(t))
    );

    if (matchedKb) {
      setChatHistory((prev) => [
        ...prev,
        userTurn,
        {
          id: `ai-${Date.now()}`,
          sender: "AI",
          text: matchedKb.approvedAnswer,
          kbCitation: matchedKb.topic,
          cardType: matchedKb.generativeCardType,
        },
      ]);
    } else {
      setChatHistory((prev) => [
        ...prev,
        userTurn,
        {
          id: `ai-${Date.now()}`,
          sender: "AI",
          text: "Yêu cầu này cần sự hỗ trợ của Chuyên viên CSKH hoặc phê duyệt từ Ban Giám đốc (như hoàn tiền/đổi chuyên gia). Em đã tạo phiếu hỗ trợ #TK-2026-882 chuyển cho nhân viên phụ trách gia đình mình phản hồi trong giờ làm việc ạ.",
          cardType: "HUMAN_TICKET_CARD",
        },
      ]);
    }
    setChatInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header tổng quan của con + Chuyển đổi hồ sơ con + Mua thêm gói */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1A2E26] via-[#223B31] to-[#13221C] text-white p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200">
              <Users className="w-3.5 h-3.5" />
              Chọn hồ sơ con đang theo dõi:
            </span>
            {studentCases.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStudentId(st.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  st.id === child.id
                    ? "bg-[#C86D51] text-white shadow-xs"
                    : "bg-white/10 text-slate-200 hover:bg-white/20"
                }`}
              >
                {st.fullName} (Lớp {st.grade})
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#1A2E26] text-xs font-extrabold hover:bg-amber-50 transition shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C86D51]" />
            Mua thêm Gói học / Gia hạn Ví buổi
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-full">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              Hồ sơ Đồng hành Gia đình · Mã học sinh: {child.code}
            </div>
            <h1 className="text-xl font-extrabold">
              {child.fullName} — Lớp {child.grade} ({child.schoolName})
            </h1>
            <p className="text-xs text-slate-300">
              Định hướng nghề nghiệp:{" "}
              <strong className="text-amber-300">
                {child.careerGoal.targetCareer}
              </strong>{" "}
              · Mục tiêu: <strong>{child.careerGoal.targetUniversity}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 border border-white/15 px-3.5 py-2 text-right">
              <div className="text-[11px] text-emerald-200">Ví buổi học còn lại</div>
              <div className="text-lg font-extrabold text-emerald-300">
                {child.sessionCreditsRemaining} buổi
              </div>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/15 px-3.5 py-2 text-right">
              <div className="text-[11px] text-emerald-200">Chuyên cần tháng này</div>
              <div className="text-lg font-extrabold text-white">
                {child.attendanceRatePct}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột Trái: Lịch học & Đổi hình thức từng buổi + Bản tin ngày */}
        <div className="lg:col-span-7 space-y-6">
          {/* Lịch học sắp tới & Đổi hình thức linh hoạt */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Lịch Học Sắp Tới & Đổi Hình Thức Học Theo Từng Buổi
                  </h2>
                  <p className="text-xs text-slate-500">
                    Linh hoạt chọn Online Zoom, Tại trung tâm hoặc Tại nhà cho từng buổi học
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {childBookings.map((bk) => (
                <div
                  key={bk.id}
                  onClick={() => {
                    setSelectedBookingId(bk.id);
                    setTargetMode(bk.mode);
                  }}
                  className={`rounded-xl border p-4 space-y-2.5 cursor-pointer transition ${
                    activeBooking?.id === bk.id
                      ? "border-indigo-400 bg-indigo-50/40 shadow-2xs"
                      : "border-slate-200 bg-slate-50/60 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                        {bk.subject} · {bk.dateLabel} ({bk.timeRange})
                      </span>
                      {bk.status === "RESCHEDULED" && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Đã dời lịch
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {bk.mode === "ONLINE_ZOOM"
                        ? "Online qua Zoom"
                        : bk.mode === "AT_CENTER"
                        ? "Tại Trung tâm OYLG"
                        : "Tại Nhà học sinh"}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {bk.title}
                  </div>
                  <div className="text-xs text-slate-600">
                    Chuyên gia phụ trách: <strong>{bk.expertName}</strong> ·{" "}
                    {bk.zoomUrl ? (
                      <span className="text-indigo-600 font-medium">
                        Phòng Zoom: {bk.zoomUrl}
                      </span>
                    ) : (
                      <span>Địa điểm: {bk.locationText}</span>
                    )}
                  </div>
                  <div
                    className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-[11px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="font-semibold text-slate-500">
                      Dời lịch nhanh (trước 24h miễn phí):
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { d: "Thứ Bảy, 14/11/2026", t: "14:00 – 15:30" },
                        { d: "Chủ Nhật, 15/11/2026", t: "09:00 – 10:30" },
                      ].map((slot) => (
                        <button
                          key={slot.d}
                          onClick={() => {
                            rescheduleBooking(bk.id, slot.d, slot.t);
                            setRescheduleSavedNotice(
                              `Đã dời lịch buổi "${bk.title}" sang ${slot.d} (${slot.t}).`
                            );
                            setTimeout(
                              () => setRescheduleSavedNotice(null),
                              4000
                            );
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-indigo-700 font-semibold transition"
                        >
                          Dời sang {slot.d.split(",")[0]} ({slot.t})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {rescheduleSavedNotice && (
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{rescheduleSavedNotice}</span>
                </div>
              )}
            </div>

            {/* Khung đổi hình thức buổi học tiếp theo */}
            {activeBooking && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-3">
                <div className="text-xs font-bold text-slate-900">
                  Đổi hình thức cho buổi: &ldquo;{activeBooking.title}&rdquo;
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        id: "ONLINE_ZOOM",
                        label: "Online Zoom (1.0x)",
                        icon: <Video className="w-3.5 h-3.5" />,
                      },
                      {
                        id: "AT_CENTER",
                        label: "Tại Trung tâm (1.2x)",
                        icon: <Building className="w-3.5 h-3.5" />,
                      },
                      {
                        id: "AT_HOME",
                        label: "Tại Nhà (1.5x)",
                        icon: <Home className="w-3.5 h-3.5" />,
                      },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setTargetMode(m.id)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                        targetMode === m.id
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {m.icon}
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border border-indigo-100 text-xs">
                  <div>
                    <div className="font-bold text-slate-800">
                      Mức phí buổi học: {modeDiff.fromPriceVnd.toLocaleString("vi-VN")}đ →{" "}
                      {modeDiff.toPriceVnd.toLocaleString("vi-VN")}đ
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {modeDiff.actionSummary}
                    </div>
                  </div>
                  <button
                    onClick={handleApplyModeChange}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                  >
                    Xác nhận đổi hình thức
                  </button>
                </div>

                {modeSavedNotice && (
                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {modeSavedNotice}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Buổi học Online được ghi hình tự động để kiểm soát chất lượng và lưu đến hết gói + 30 ngày.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Nhận xét từ Gia sư & Nhật ký Bán trú/Nội trú */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Bản Tin Tổng Hợp Ngày & Nhận Xét Sau Buổi Học
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gộp gọn 1 bản tin tổng hợp/ngày để phụ huynh dễ nắm bắt mà không bị làm phiền
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {displayedLessonLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-slate-200 p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">
                      {log.subject} · Mã kiến thức {log.unitCode}
                    </span>
                    <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                      Mức nắm bài: {log.masteryLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {log.sanitizedNoteToParent}
                  </p>
                  <div className="text-[11px] text-slate-400">
                    Cập nhật lúc: {log.createdAt} · Tâm trạng trên lớp: {log.mood}
                  </div>
                </div>
              ))}

              {displayedBoardingLogs.map((bl) => (
                <div
                  key={bl.id}
                  className="rounded-xl border border-teal-200 bg-teal-50/40 p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-teal-950">
                      [Nội trú / Bán trú – {bl.time}] {bl.studentName}:
                    </span>{" "}
                    <span className="text-teal-900">{bl.detail}</span>
                  </div>
                  <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Lịch sử Đơn hàng E-Commerce & Bảo lãnh Hoàn tiền 14 ngày */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#1A2E26]" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Đơn Hàng Gói Học E-Commerce & Hoá Đơn VietQR
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cam kết hoàn tiền 100% số buổi chưa học trong 14 ngày đầu nếu gia đình chưa hài lòng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#1A2E26] text-white text-xs font-bold hover:bg-[#253f34] transition"
              >
                + Đăng ký thêm gói dịch vụ
              </button>
            </div>

            <div className="space-y-3">
              {ecomOrders.map((ord) => (
                <div
                  key={ord.orderCode}
                  className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900">
                        {ord.orderCode}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          ord.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.status === "PAID"
                          ? "Đã thanh toán VietQR"
                          : "Đã hoàn tiền 100% (Bảo lãnh 14 ngày)"}
                      </span>
                      <span className="text-slate-400">· {ord.createdAt}</span>
                    </div>
                    <div className="font-semibold text-slate-700">
                      {ord.itemsSummary}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Đã cộng: <strong>+{ord.sessionsGranted} buổi</strong> vào Ví học sinh · Thực thu:{" "}
                      <strong className="text-[#1A2E26]">
                        {ord.netPaidVnd.toLocaleString("vi-VN")}đ
                      </strong>
                    </div>
                  </div>

                  {ord.status === "PAID" && (
                    <button
                      onClick={() => {
                        const res = requestOrderRefund14d(ord.orderCode);
                        if (res) {
                          setRefundSavedNotice(
                            `Đã hoàn tiền 100% (${res.refundAmountVnd.toLocaleString(
                              "vi-VN"
                            )}đ cho ${res.unusedSessions} buổi chưa học) của đơn ${
                              ord.orderCode
                            }.`
                          );
                          setTimeout(() => setRefundSavedNotice(null), 5000);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 font-bold hover:bg-amber-100 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Hoàn tiền 14 ngày
                    </button>
                  )}
                </div>
              ))}
              {refundSavedNotice && (
                <div className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{refundSavedNotice}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cột Phải: Trợ lý AI CSKH 24/7 */}
        <div className="lg:col-span-5 rounded-2xl border border-indigo-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Trợ Lý AI Chăm Sóc Khách Hàng 24/7
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Hỗ trợ dời lịch, đổi hình thức học & thanh toán tự động
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Trực tuyến 24/7
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                onClick={() =>
                  handleSendChat("Chị muốn dời lịch buổi Toán tối thứ Năm")
                }
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200 hover:bg-indigo-100"
              >
                <Calendar className="w-3 h-3" />
                Dời lịch buổi học
              </button>
              <button
                onClick={() =>
                  handleSendChat("Lấy mã QR thanh toán gia hạn gói 6 tháng")
                }
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100"
              >
                <CreditCard className="w-3 h-3" />
                Thanh toán VietQR
              </button>
              <button
                onClick={() =>
                  handleSendChat("Chị muốn hỏi thủ tục hoàn tiền gói học")
                }
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 hover:bg-amber-100"
              >
                <Headphones className="w-3 h-3" />
                Chuyển nhân viên CSKH
              </button>
            </div>

            <div className="h-96 overflow-y-auto space-y-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {chatHistory.map((turn) => (
                <div
                  key={turn.id}
                  className={`flex flex-col ${
                    turn.sender === "USER" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl p-3 text-xs leading-relaxed ${
                      turn.sender === "USER"
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-slate-200 text-slate-800 shadow-2xs"
                    }`}
                  >
                    <p>{turn.text}</p>
                    {turn.kbCitation && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-indigo-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {turn.kbCitation}
                      </div>
                    )}

                    {turn.cardType === "RESCHEDULE_CARD" && activeBooking && (
                      <div className="mt-2.5 rounded-xl bg-indigo-50 border border-indigo-200 p-2.5 space-y-1.5 text-slate-900">
                        <div className="text-[11px] font-bold text-indigo-950">
                          Chọn khung giờ mới cho buổi {activeBooking.subject}:
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {[
                            { d: "Thứ Bảy, 14/11/2026", t: "14:00 – 15:30" },
                            { d: "Chủ Nhật, 15/11/2026", t: "09:00 – 10:30" },
                          ].map((slot) => (
                            <button
                              key={slot.d}
                              onClick={() => {
                                rescheduleBooking(
                                  activeBooking.id,
                                  slot.d,
                                  slot.t
                                );
                                setRescheduleSavedNotice(
                                  `Đã dời lịch buổi "${activeBooking.title}" sang ${slot.d} (${slot.t}).`
                                );
                                setTimeout(
                                  () => setRescheduleSavedNotice(null),
                                  4000
                                );
                              }}
                              className="p-2 rounded-lg bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-[11px] font-semibold transition text-left"
                            >
                              Dời sang: {slot.d} ({slot.t})
                            </button>
                          ))}
                        </div>
                        {rescheduleSavedNotice && (
                          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{rescheduleSavedNotice}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {turn.cardType === "PAYOS_QR_CARD" && (
                      <div className="mt-2.5 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 flex items-center justify-between text-slate-900">
                        <div className="text-[11px]">
                          <div className="font-bold text-emerald-950">
                            CONG TY TNHH ALL YOUR LIFE
                          </div>
                          <div>Gói 6 tháng (Đã giảm 7%): 11.160.000đ</div>
                        </div>
                        <QrCode className="w-8 h-8 text-emerald-700 shrink-0" />
                      </div>
                    )}

                    {turn.cardType === "SAFETY_EMERGENCY_CARD" && (
                      <div className="mt-2.5 rounded-xl bg-rose-950 text-white p-2.5 text-[11px] font-bold flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>Tổng đài Bảo vệ Trẻ em: 111 · Cấp cứu: 115</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="Nhập câu hỏi cho Trợ lý AI CSKH..."
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-600 focus:outline-none"
            />
            <button
              onClick={() => handleSendChat()}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
