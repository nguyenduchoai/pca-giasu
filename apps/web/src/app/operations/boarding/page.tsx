"use client";

import React, { useState } from "react";
import { usePlatform } from "@/lib/platform-store";
import {
  Building2,
  UserCheck,
  AlertOctagon,
  QrCode,
  Utensils,
  Clock,
  CheckCircle2,
  BedDouble,
} from "lucide-react";

const PICKUP_CANDIDATES = [
  {
    id: "pk-1",
    name: "Chị Nguyễn Thị Lan",
    relation: "Mẹ ruột (Chủ tài khoản)",
    phoneMasked: "0905.***.*89",
    isAuthorized: true,
    badgeNote: "Có trong danh sách người được phép đón · Ảnh đối chiếu khớp 100%",
  },
  {
    id: "pk-2",
    name: "Ông Nguyễn Văn Hòa",
    relation: "Ông ngoại (Đã đăng ký trước)",
    phoneMasked: "0914.***.*22",
    isAuthorized: true,
    badgeNote: "Có trong danh sách người được phép đón · Đã xác thực CCCD",
  },
  {
    id: "pk-3",
    name: "Anh Lê Văn Lạ (Chưa đăng ký trong hồ sơ)",
    relation: "Người quen chưa xác thực",
    phoneMasked: "0977.***.*00",
    isAuthorized: false,
    badgeNote:
      "KHÔNG CÓ TRONG DANH SÁCH ĐƯỢC PHÉP ĐÓN! Hệ thống tự động chặn & gọi xác minh Phụ huynh!",
  },
];

export default function BoardingManagementPage() {
  const { boardingLogs, addBoardingLog } = usePlatform();
  const [selectedPickupId, setSelectedPickupId] = useState<string>("pk-1");

  const selectedPickup =
    PICKUP_CANDIDATES.find((p) => p.id === selectedPickupId) ??
    PICKUP_CANDIDATES[0];

  const handleConfirmPickup = () => {
    const nowStr = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (selectedPickup.isAuthorized) {
      addBoardingLog({
        studentCode: "HS-2026-0089",
        studentName: "Nguyễn Minh Khôi",
        time: nowStr,
        type: "LEAVE",
        detail: `Xác nhận ${selectedPickup.name} (${selectedPickup.relation}) đón học sinh · Đã gửi thông báo thời gian thực tới Cổng Phụ Huynh`,
        status: "OK",
      });
    } else {
      addBoardingLog({
        studentCode: "HS-2026-0089",
        studentName: "Nguyễn Minh Khôi",
        time: nowStr,
        type: "SECURITY_ALERT",
        detail: `Chặn bàn giao cho ${selectedPickup.name} do không có trong danh sách được phép đón · Đang gọi khẩn cho Mẹ (Chị Lan)`,
        status: "BLOCKED",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tổng quan phòng & giường Nội trú / Bán trú */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-teal-600 text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Quản Lý Cơ Sở Nội Trú & Bán Trú — Cơ Sở Trung Tâm Buôn Ma Thuột
              </h1>
              <p className="text-xs text-slate-500">
                Sơ đồ phòng ở, điểm danh QR 4 mốc/ngày, kiểm soát dị ứng thực phẩm và xác thực người đón an toàn
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-teal-900">
              <span>Phòng Bán Trú Nam B2</span>
              <BedDouble className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-sm font-bold text-slate-900">
              Nguyễn Minh Khôi (Lớp 9) — Giường #08
            </div>
            <p className="text-xs text-rose-700 font-semibold flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5" />
              Lưu ý bếp ăn: Dị ứng tôm/cua biển
            </p>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
              <span>Phòng Nội Trú Nữ N302</span>
              <BedDouble className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-sm font-bold text-slate-900">
              Trần Bảo Ngọc (Lớp 11) — Giường #02
            </div>
            <p className="text-xs text-amber-800 font-semibold">
              Giờ ngủ TB tuần này: 5.6h/đêm (Đã đồng bộ cảnh báo sang Cố vấn)
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5">
            <div className="text-xs font-bold text-slate-700">
              Công suất Lưu trú Hiện tại
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              24 / 30 Giường
            </div>
            <p className="text-xs text-slate-500">
              Ca trực quản sinh hiện tại: Thầy Vũ Hải Nam (Ca Chiều – Tối)
            </p>
          </div>
        </div>
      </div>

      {/* Bàn kiểm soát Đưa – Đón An toàn & Nhật ký Điểm danh */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Xác Thực Người Đón Học Sinh Bán Trú (Nguyễn Minh Khôi)
          </h2>
          <p className="text-xs text-slate-500">
            Quản sinh đối chiếu hình ảnh và CCCD của người đón với danh sách được phụ huynh ủy quyền trước khi bàn giao học sinh.
          </p>

          <div className="space-y-2.5">
            {PICKUP_CANDIDATES.map((cand) => (
              <button
                key={cand.id}
                onClick={() => setSelectedPickupId(cand.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                  selectedPickupId === cand.id
                    ? cand.isAuthorized
                      ? "border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20"
                      : "border-rose-600 bg-rose-50/70 ring-2 ring-rose-500/20"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {cand.name} ({cand.relation})
                  </div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      cand.isAuthorized
                        ? "text-teal-700 font-medium"
                        : "text-rose-700 font-bold"
                    }`}
                  >
                    {cand.badgeNote}
                  </div>
                </div>
                {cand.isAuthorized ? (
                  <UserCheck className="w-5 h-5 text-teal-600 shrink-0" />
                ) : (
                  <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleConfirmPickup}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-2 ${
              selectedPickup.isAuthorized
                ? "bg-teal-600 hover:bg-teal-700"
                : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            <QrCode className="w-4 h-4" />
            {selectedPickup.isAuthorized
              ? `Xác nhận Bàn giao cho ${selectedPickup.name} & Bắn thông báo Phụ huynh`
              : `CHẶN BÀN GIAO NGƯỜI LẠ & GỌI KHẨN CHO PHỤ HUYNH`}
          </button>
        </div>

        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">
              Nhật Ký Điểm Danh & Sự Việc Lưu Trú Thời Gian Thực
            </h2>
          </div>

          <div className="space-y-2.5">
            {boardingLogs.map((log) => (
              <div
                key={log.id}
                className={`rounded-xl border p-3.5 text-xs flex items-start justify-between gap-2 ${
                  log.status === "BLOCKED"
                    ? "border-rose-300 bg-rose-50 text-rose-950"
                    : "border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                      {log.time}
                    </span>
                    <span>
                      {log.studentName} ({log.studentCode}) — {log.type}
                    </span>
                  </div>
                  <p className="text-[11px] mt-1 opacity-90">{log.detail}</p>
                </div>
                {log.status === "OK" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
