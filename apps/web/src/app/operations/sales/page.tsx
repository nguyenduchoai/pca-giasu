"use client";

import React from "react";
import { usePlatform } from "@/lib/platform-store";
import { SalesCareBoardingWorkspace } from "@/components/SalesCareBoardingWorkspace";
import { Users, CheckCircle2, QrCode, ShoppingBag, RotateCcw } from "lucide-react";

export default function SalesOperationsPage() {
  const { leads, advanceLeadStage, ecomOrders, requestOrderRefund14d } = usePlatform();

  return (
    <div className="space-y-6">
      {/* 1. DANH SÁCH KHÁCH HÀNG ĐĂNG KÝ & ĐƠN HÀNG (CRM PIPELINE) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">
                Quản Lý Khách Hàng Đăng Ký (Lead Pipeline) & Đơn Hàng POS
              </h1>
              <p className="text-xs text-slate-500">
                Khách hàng đăng ký từ Trang chủ hoặc Quầy sự kiện được giữ quyền sở hữu 30 ngày cho CTV giới thiệu
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-2.5 px-3">Phụ huynh & Học sinh</th>
                <th className="py-2.5 px-3">Dịch vụ đăng ký</th>
                <th className="py-2.5 px-3">Kênh / Mã CTV</th>
                <th className="py-2.5 px-3">Giá trị đơn</th>
                <th className="py-2.5 px-3">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((ld) => (
                <tr key={ld.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">
                      {ld.parentName} ({ld.phone})
                    </div>
                    <div className="text-[11px] text-slate-500">
                      HS: {ld.studentName} · Lớp {ld.grade} ({ld.province})
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {ld.serviceInterest}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {ld.refCode ?? "Tự đến"}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Kênh: {ld.channel} · {ld.createdAt}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    {ld.amountVnd.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        ld.stage === "PAID"
                          ? "bg-emerald-100 text-emerald-800"
                          : ld.stage === "QUALIFIED"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {ld.stage === "PAID"
                        ? "ĐÃ THANH TOÁN & CẤP TÀI KHOẢN"
                        : ld.stage === "QUALIFIED"
                        ? "ĐÃ TƯ VẤN – CHỜ THANH TOÁN"
                        : "MỚI ĐĂNG KÝ"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {ld.stage !== "PAID" ? (
                      <button
                        onClick={() =>
                          advanceLeadStage(
                            ld.id,
                            "PAID",
                            "ThS. Lê Minh Tâm"
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 inline-flex items-center gap-1"
                      >
                        <QrCode className="w-3 h-3" />
                        Xác nhận Thu tiền & Cấp User
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đã bàn giao CSKH
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. ĐƠN HÀNG E-COMMERCE & ĐỐI SOÁT VIETQR TRỰC TUYẾN */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#1A2E26] text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Đơn Hàng E-Commerce Trực Tuyến & Đối Soát VietQR Tự Động
              </h2>
              <p className="text-xs text-slate-500">
                Đồng bộ tức thời từ Giỏ hàng Website, tự động nạp buổi vào Ví học sinh và tính hoa hồng 2 tầng theo tiến độ thực thu
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-2.5 px-3">Mã đơn & Thời gian</th>
                <th className="py-2.5 px-3">Phụ huynh & Học sinh</th>
                <th className="py-2.5 px-3">Gói dịch vụ E-Commerce</th>
                <th className="py-2.5 px-3">Số buổi nạp</th>
                <th className="py-2.5 px-3">Thực thu VietQR</th>
                <th className="py-2.5 px-3">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Bảo lãnh 14 ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ecomOrders.map((ord) => (
                <tr key={ord.orderCode} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3">
                    <div className="font-mono font-bold text-slate-900">
                      {ord.orderCode}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {ord.createdAt}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">
                      {ord.parentName} ({ord.phone})
                    </div>
                    <div className="text-[11px] text-slate-500">
                      HS: {ord.studentName} ({ord.studentCode})
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {ord.itemsSummary}
                    {ord.voucherCode && (
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        Mã ưu đãi: {ord.voucherCode} (-{ord.voucherDiscountVnd.toLocaleString("vi-VN")}đ)
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">
                    +{ord.sessionsGranted} buổi
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    {ord.netPaidVnd.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        ord.status === "PAID"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ord.status === "PAID"
                        ? "ĐÃ THU VIETQR & NẠP VÍ"
                        : "ĐÃ HOÀN TIỀN 14 NGÀY"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {ord.status === "PAID" ? (
                      <button
                        onClick={() => requestOrderRefund14d(ord.orderCode)}
                        className="px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 font-bold hover:bg-amber-100 inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Xử lý Hoàn tiền 14N
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Đã tất toán</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. BẢNG TÍNH HOA HỒNG 2 CẤP CHI DẦN & POS */}
      <SalesCareBoardingWorkspace />
    </div>
  );
}
