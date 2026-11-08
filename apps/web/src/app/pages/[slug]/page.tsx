"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePlatform } from "@/lib/platform-store";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Award,
  BookOpen,
} from "lucide-react";

const EXPERT_PORTRAITS: Record<string, string> = {
  "co-van-tracie-anh":
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80",
  "ths-le-minh-tam":
    "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=700&q=80",
  "thay-dang-quoc-viet":
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=80",
  "co-le-bao-tram":
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
};

export default function EzyTeamMemberLandingPage() {
  const params = useParams<{ slug: string }>();
  const { ezyTeamMembers, addLeadAndOrder } = usePlatform();

  const currentMember =
    ezyTeamMembers.find((m) => m.slug === params?.slug) ?? ezyTeamMembers[0];

  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState(9);
  const [booked, setBooked] = useState(false);

  const handleBookWithMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !phone.trim() || !studentName.trim()) return;
    addLeadAndOrder({
      parentName,
      phone,
      studentName,
      grade,
      province: "Đắk Lắk",
      serviceInterest: `Đặt lịch tham vấn cùng ${currentMember.name}`,
      channel: "ONLINE",
      stage: "SCHEDULED",
      assignedExpert: currentMember.name,
      amountVnd: 4_500_000,
    });
    setBooked(true);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Thanh điều hướng giữa các Chuyên gia */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="whitespace-nowrap px-4 py-2 rounded-full bg-white border border-amber-200 hover:bg-amber-50 text-xs font-bold text-[#141413] flex items-center gap-2 transition shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#E85D3F]" />
          <span>Quay về Trang chủ</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {ezyTeamMembers.map((m) => (
            <Link
              key={m.slug}
              href={`/pages/${m.slug}`}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                m.slug === currentMember.slug
                  ? "bg-gradient-to-r from-[#FF6B4A] to-[#E85D3F] text-white shadow-xs"
                  : "bg-white border border-stone-200 text-stone-600 hover:text-[#141413]"
              }`}
            >
              {m.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Hồ sơ Chuyên gia chuẩn Editorial */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0F5132] via-[#112A22] to-[#1E1B4B] text-white p-7 sm:p-10 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="whitespace-nowrap inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-extrabold">
              <ShieldCheck className="w-4 h-4" />
              <span>Chuyên gia Chính thức · {currentMember.ezyRole}</span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={
                  EXPERT_PORTRAITS[currentMember.slug] ??
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                }
                alt={currentMember.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shrink-0"
              />
              <div>
                <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-white">
                  {currentMember.name}
                </h1>
                <p className="text-sm text-emerald-200 mt-1">
                  {currentMember.roleTitle}
                </p>
              </div>
            </div>

            <p className="text-sm text-stone-200 leading-relaxed">
              {currentMember.bio}
            </p>

            <div className="flex flex-wrap gap-3 pt-2 text-xs">
              <div className="whitespace-nowrap px-3.5 py-2 rounded-full bg-white/10">
                Cấp bậc:{" "}
                <strong className="text-amber-300">
                  {currentMember.expertTier}
                </strong>
              </div>
              <div className="whitespace-nowrap px-3.5 py-2 rounded-full bg-white/10 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <strong>{currentMember.rating} / 5.0</strong>
              </div>
              <div className="whitespace-nowrap px-3.5 py-2 rounded-full bg-white/10">
                Đã đồng hành:{" "}
                <strong>{currentMember.studentsCount} học sinh</strong>
              </div>
            </div>
          </div>

          {/* Form Đặt lịch Tham vấn trực tiếp */}
          <div className="lg:col-span-5 bg-white text-[#141413] rounded-3xl p-6 space-y-4 shadow-lg">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#575653]">
                Đặt Lịch Tham Vấn & Đồng Hành
              </div>
              <h3 className="font-editorial text-2xl font-medium text-[#141413]">
                Đăng ký làm việc cùng {currentMember.name}
              </h3>

              {booked ? (
                <div className="p-4 rounded-2xl bg-[#EDF3EC] text-[#346538] text-xs space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã ghi nhận lịch hẹn thành công!
                  </div>
                  <p>
                    Bộ phận Điều phối Chuyên môn sẽ liên hệ với Phụ huynh{" "}
                    <strong>{parentName}</strong> để xác nhận khung giờ làm việc
                    cùng <strong>{currentMember.name}</strong>.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleBookWithMember}
                  className="space-y-3 text-xs"
                >
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Họ tên Phụ huynh..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FBF9F5]"
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại liên hệ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FBF9F5]"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Họ tên Học sinh..."
                      className="col-span-2 px-3.5 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FBF9F5]"
                    />
                    <select
                      value={grade}
                      onChange={(e) => setGrade(Number(e.target.value))}
                      className="px-2 py-2.5 rounded-xl border border-[#DEDAD2] bg-[#FBF9F5] font-bold"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                        <option key={g} value={g}>
                          Lớp {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="whitespace-nowrap w-full py-3 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#E85D3F] text-white font-extrabold transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Gửi Yêu Cầu Đặt Lịch Hẹn</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      {/* Lĩnh vực chuyên môn & Bằng cấp */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="double-bezel-shell">
          <div className="double-bezel-core p-6 space-y-3">
            <h2 className="font-editorial text-xl font-medium text-[#141413] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#575653]" />
              <span>Lĩnh vực Chuyên môn Phụ trách</span>
            </h2>
            <ul className="space-y-2.5 text-xs text-[#3F3E3A]">
              {currentMember.subjects.map((sub) => (
                <li key={sub} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{sub}</span>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-[#E8E5DF] text-xs text-[#575653]">
              Hình thức làm việc:{" "}
              <strong className="text-[#141413]">
                {currentMember.modes.join(" · ")}
              </strong>
            </div>
          </div>
        </div>

        <div className="double-bezel-shell">
          <div className="double-bezel-core p-6 space-y-3">
            <h2 className="font-editorial text-xl font-medium text-[#141413] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#575653]" />
              <span>Thành tựu & Quá trình Đào tạo</span>
            </h2>
            <div className="p-3.5 rounded-2xl bg-[#FBF3DB] text-[#956400] text-xs font-semibold">
              {currentMember.achievementSummary}
            </div>
            <ul className="space-y-2 text-xs text-[#575653]">
              {currentMember.education.map((ed) => (
                <li key={ed}>• {ed}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
