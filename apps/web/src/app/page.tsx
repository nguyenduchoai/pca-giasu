"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlatform } from "@/lib/platform-store";
import {
  Compass,
  HeartHandshake,
  GraduationCap,
  CheckCircle2,
  Star,
  QrCode,
  ArrowUpRight,
  ShieldCheck,
  Calculator,
  X,
  Lock,
  PhoneCall,
  Sparkles,
  Calendar,
  BookOpen,
  Users,
  Award,
} from "lucide-react";

interface SelectedPackageCheckout {
  code: string;
  title: string;
  tierLabel: string;
  amountVnd: number;
  summary: string;
  imageUrl: string;
  accentGradient: string;
  badgeClass: string;
  highlights: string[];
}

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

export default function HomePage() {
  const router = useRouter();
  const {
    isLoggedIn,
    loginAsPersona,
    currentPersona,
    addLeadAndOrder,
    ezyPageFragments,
    ezyTeamMembers,
    baseSessionPriceVnd,
    ecomProducts,
    addToCart,
    checkoutCartWithVietQr,
  } = usePlatform();

  // Bộ cấu hình Học phí Cá nhân hóa (Công thức B6)
  const [simGrade, setSimGrade] = useState<number>(9);
  const [simExpertTier, setSimExpertTier] = useState<
    "STANDARD" | "SENIOR" | "MASTER"
  >("MASTER");
  const [simMode, setSimMode] = useState<
    "ONLINE_ZOOM" | "AT_CENTER" | "AT_HOME"
  >("AT_CENTER");
  const [simClassType, setSimClassType] = useState<
    "ONE_ON_ONE" | "SMALL_GROUP" | "LARGE_GROUP"
  >("ONE_ON_ONE");
  const [simDurationMonths, setSimDurationMonths] = useState<1 | 3 | 6 | 12>(6);

  // Luồng Modal Mua Gói Học (Bước 1: Đăng nhập Phụ huynh -> Bước 2: Hồ sơ Con & VietQR -> Bước 3: Hoàn tất)
  const [checkoutPackage, setCheckoutPackage] =
    useState<SelectedPackageCheckout | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<
    "AUTH" | "PAYMENT" | "SUCCESS"
  >("AUTH");
  const [authParentName, setAuthParentName] = useState("Chị Nguyễn Thị Lan");
  const [authParentPhone, setAuthParentPhone] = useState("0905123489");
  const [checkoutStudentName, setCheckoutStudentName] =
    useState("Nguyễn Minh Khôi");
  const [checkoutGrade, setCheckoutGrade] = useState<number>(9);
  const [checkoutRefCode, setCheckoutRefCode] = useState<string>("CTV-A102");
  const [createdOrderCode, setCreatedOrderCode] = useState<string>("");

  // Biểu mẫu Đặt lịch Tư vấn Miễn phí (không cần mua gói ngay)
  const [consultParentName, setConsultParentName] = useState<string>("");
  const [consultPhone, setConsultPhone] = useState<string>("");
  const [consultStudentName, setConsultStudentName] = useState<string>("");
  const [consultGrade, setConsultGrade] = useState<number>(9);
  const [consultConcern, setConsultConcern] = useState<string>(
    "Con mất gốc Toán/Anh lớp dưới và chưa rõ định hướng chọn trường cấp 3 / Đại học"
  );
  const [consultSubmitted, setConsultSubmitted] = useState<boolean>(false);

  const threeTierIntroText =
    ezyPageFragments.find(
      (f) =>
        f.pageName === "home" &&
        f.fragmentName === "three_tier_ecosystem_intro"
    )?.contentVi ?? "";
  const b6IntroText =
    ezyPageFragments.find(
      (f) =>
        f.pageName === "home" &&
        f.fragmentName === "b6_pricing_simulator_intro"
    )?.contentVi ?? "";

  // Công thức tính học phí từng buổi (B6)
  const kTier =
    simExpertTier === "MASTER" ? 1.7 : simExpertTier === "SENIOR" ? 1.3 : 1.0;
  const kGrade =
    simGrade <= 5 ? 0.8 : simGrade <= 9 ? 1.0 : simGrade <= 11 ? 1.2 : 1.4;
  const kMode =
    simMode === "AT_HOME" ? 1.5 : simMode === "AT_CENTER" ? 1.2 : 1.0;
  const kClass =
    simClassType === "LARGE_GROUP"
      ? 0.35
      : simClassType === "SMALL_GROUP"
      ? 0.6
      : 1.0;
  const discountRate =
    simDurationMonths === 12
      ? 0.12
      : simDurationMonths === 6
      ? 0.07
      : simDurationMonths === 3
      ? 0.03
      : 0;

  const singleSessionPrice = Math.round(
    baseSessionPriceVnd * kTier * kGrade * kMode * kClass
  );
  const totalSessions = simDurationMonths * 8;
  const totalPackageBeforeDiscount = singleSessionPrice * totalSessions;
  const totalPackageAfterDiscount = Math.round(
    totalPackageBeforeDiscount * (1 - discountRate)
  );

  const handleStartBuyPackage = (pkg: SelectedPackageCheckout) => {
    setCheckoutPackage(pkg);
    if (isLoggedIn) {
      setCheckoutStep("PAYMENT");
    } else {
      setCheckoutStep("AUTH");
    }
  };

  const handleConfirmParentLoginForCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsPersona("PARENT_LAN");
    setCheckoutStep("PAYMENT");
  };

  const handleConfirmPaymentAndActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPackage) return;
    const createdOrder = checkoutCartWithVietQr({
      parentName: isLoggedIn ? currentPersona.fullName : authParentName,
      phone: authParentPhone,
      studentName: checkoutStudentName,
      grade: checkoutGrade,
      refCode: checkoutRefCode.trim() || "CTV-A102",
      channel: "WEBSITE_ECOM",
      overridePackage: {
        title: checkoutPackage.title,
        amountVnd: checkoutPackage.amountVnd,
      },
    });
    setCreatedOrderCode(createdOrder.orderCode);
    setCheckoutStep("SUCCESS");
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !consultParentName.trim() ||
      !consultPhone.trim() ||
      !consultStudentName.trim()
    )
      return;

    addLeadAndOrder({
      parentName: consultParentName,
      phone: consultPhone,
      studentName: consultStudentName,
      grade: consultGrade,
      province: "Đắk Lắk",
      serviceInterest: `Tư vấn: ${consultConcern}`,
      channel: "ONLINE",
      stage: "NEW",
      amountVnd: 0,
    });
    setConsultSubmitted(true);
  };

  const STANDARD_PACKAGES: SelectedPackageCheckout[] = [
    {
      code: "PKG-TIER-1",
      title: "Gói Khám Phá Hướng Nghiệp & Bản Đồ Thành Công",
      tierLabel: "Tầng 1 · Hướng Nghiệp",
      amountVnd: 1_800_000,
      imageUrl:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      accentGradient: "btn-oylg-amber bg-amber-600 from-amber-500 to-orange-500",
      badgeClass: "bg-amber-100 text-amber-900 border border-amber-200",
      summary:
        "Đánh giá đa chiều Holland RIASEC, Big Five & Giá trị sống + Phiên tham vấn 1-1 cùng Chuyên gia Hướng nghiệp + Xuất bản Bản đồ Thành công R1.",
      highlights: [
        "Bài trắc nghiệm RIASEC & Big Five chuẩn hóa",
        "2 phiên tham vấn 1-1 cùng Chuyên gia Hướng nghiệp",
        "Báo cáo Bản đồ Thành công & Chọn khối/ngành R1",
      ],
    },
    {
      code: "PKG-TIER-1-2",
      title: "Gói Hướng Nghiệp + Tầm Soát 3 Mặt & Lộ Trình 60/40",
      tierLabel: "Tầng 1 & 2 · Toàn Diện Nhất",
      amountVnd: 4_500_000,
      imageUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      accentGradient: "btn-oylg-emerald bg-emerald-600 from-emerald-600 to-teal-600",
      badgeClass: "bg-emerald-100 text-emerald-900 border border-emerald-200",
      summary:
        "Bao gồm toàn bộ Tầng 1 + Tầm soát lỗ hổng kiến thức từ Lớp 1 đến hiện tại (Toán, Lý, Hóa, Anh, Văn GDPT 2018), Tinh thần & Thể chất + Lộ trình 60/40.",
      highlights: [
        "Truy vết lỗ hổng gốc 5 môn theo chuẩn GDPT 2018",
        "Đánh giá động lực học tập, giấc ngủ & sức khỏe tinh thần",
        "Thiết kế lộ trình 60% bù gốc / 40% bám sát lớp hiện tại",
      ],
    },
    {
      code: "PKG-TIER-3-CUSTOM",
      title: `Gói Đồng Hành Chuyên Gia Bộ Môn (${simDurationMonths} tháng · ${totalSessions} buổi)`,
      tierLabel: "Tầng 3 · Gia Sư 60/40",
      amountVnd: totalPackageAfterDiscount,
      imageUrl:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
      accentGradient: "btn-oylg-indigo bg-indigo-600 from-indigo-600 to-blue-600",
      badgeClass: "bg-indigo-100 text-indigo-900 border border-indigo-200",
      summary: `Kèm sát theo lộ trình 60% bù gốc / 40% bám sát lớp ${simGrade}. Linh hoạt đổi hình thức từng buổi (Zoom · Trung tâm · Tại nhà). Hoàn tiền 100% buổi chưa học trong 14 ngày.`,
      highlights: [
        `Nạp ngay ${totalSessions} buổi vào Ví học tập gia đình`,
        "Đổi linh hoạt Online Zoom ↔ Trung tâm ↔ Tại nhà từng buổi",
        "Bảo lãnh hoàn tiền 100% buổi chưa học trong 14 ngày",
      ],
    },
  ];

  return (
    <div className="space-y-20">
      {/* ====================================================================
          1. HERO SECTION — SPLIT 2-COLUMN VỚI HÌNH ẢNH SINH ĐỘNG & MÀU SẮC TƯƠI SÁNG
          ==================================================================== */}
      <section className="pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* CỘT TRÁI: THÔNG ĐIỆP TRỌNG TÂM & NÚT HÀNH ĐỘNG KHÔNG RỚT DÒNG */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-gradient-to-r from-amber-100 via-orange-50 to-emerald-100 border border-amber-200/80 text-xs font-bold text-[#141413] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E85D3F] shrink-0" />
              <span className="whitespace-nowrap">
                Hệ Sinh Thái Hướng Nghiệp & Đồng Hành Lớp 1–12 & Sinh Viên
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl xl:text-[54px] font-bold tracking-tight leading-[1.12] text-[#141413]">
              Giúp con biết mình sẽ trở thành ai,{" "}
              <span className="text-[#E85D3F]">
                lấp đúng lỗ hổng kiến thức gốc
              </span>{" "}
              và có Cố vấn đồng hành toàn diện.
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {threeTierIntroText}
            </p>

            {/* 3 Thẻ Điểm Nhấn Đầy Màu Sắc (Không Rớt Dòng) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Tầng 1: Hướng nghiệp RIASEC</span>
              </span>
              <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tầng 2: Cố vấn Cuộc sống 3 Mặt</span>
              </span>
              <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Tầng 3: Gia sư Bù hổng 60/40</span>
              </span>
            </div>

            {/* Cụm Nút CTA Tương Phản Cao & Không Rớt Dòng */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href="#bang-gia-goi-hoc"
                className="btn-oylg-primary whitespace-nowrap shrink-0 group inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-[#E85D3F] text-white text-sm font-bold shadow-md shadow-orange-500/20 transition active:scale-[0.98]"
              >
                <span className="whitespace-nowrap">
                  Chọn Gói Đồng Hành & Đăng Ký
                </span>
                <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </a>

              <a
                href="#dang-ky-tu-van"
                className="whitespace-nowrap shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-950 border-2 border-emerald-600/30 text-sm font-bold transition shadow-2xs"
              >
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="whitespace-nowrap">
                  Đặt Lịch Tư Vấn 1-1 Miễn Phí
                </span>
              </a>
            </div>

            {/* Dải Tín Nhiệm Học Sinh & Phụ Huynh */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-600">
              <div className="flex -space-x-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center ring-2 ring-white text-[10px]">
                  MK
                </span>
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center ring-2 ring-white text-[10px]">
                  HA
                </span>
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold flex items-center justify-center ring-2 ring-white text-[10px]">
                  GB
                </span>
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold flex items-center justify-center ring-2 ring-white text-[10px]">
                  +1K
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1 font-bold text-[#141413]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9/5 từ 1.280+ Học sinh & Phụ huynh toàn quốc</span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Cam kết hoàn học phí 100% các buổi chưa học trong 14 ngày đầu
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: HÌNH ẢNH HỌC SINH & CỐ VẤN + THẺ TRỰC QUAN SINH ĐỘNG */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[32px] p-3 bg-gradient-to-br from-amber-400/30 via-emerald-400/25 to-indigo-500/30 shadow-xl">
              <div className="relative rounded-[24px] overflow-hidden bg-stone-900 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85"
                  alt="Học sinh và Sinh viên hào hứng khám phá lộ trình hướng nghiệp cùng Cố vấn All Your Life"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                {/* Chú thích trên ảnh chính */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 text-white">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap">
                      Đồng hành Cá nhân hóa 1-1
                    </span>
                    <div className="font-editorial text-xl sm:text-2xl font-bold mt-1.5">
                      Học tập chủ động, hiểu rõ tương lai
                    </div>
                  </div>
                  <div className="px-3.5 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold whitespace-nowrap">
                    Tỷ lệ tiến bộ sau 8 tuần: <span className="text-emerald-300">96,4%</span>
                  </div>
                </div>
              </div>

              {/* Thẻ Nổi 1 (Góc Trên Trái): Bản đồ Hướng nghiệp RIASEC */}
              <div className="hidden sm:block absolute -top-5 -left-5 bg-white rounded-2xl p-4 shadow-xl border border-amber-200/80 w-60 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-800">
                  <span className="whitespace-nowrap">BẢN ĐỒ HƯỚNG NGHIỆP R1</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    RIASEC
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <div className="flex justify-between font-bold text-stone-700">
                      <span>Nghiên cứu & Công nghệ</span>
                      <span className="text-emerald-700">92%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden mt-0.5">
                      <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-stone-700">
                      <span>Sáng tạo & Nghệ thuật</span>
                      <span className="text-amber-600">86%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden mt-0.5">
                      <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Thẻ Nổi 2 (Góc Dưới Phải): Phác đồ Lấp Hổng 60/40 */}
              <div className="hidden sm:flex absolute -bottom-5 -right-4 bg-white rounded-2xl p-3.5 shadow-xl border border-emerald-200 items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=240&q=80"
                  alt="Phiên kèm 1-1"
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="text-xs">
                  <div className="font-extrabold text-emerald-900 whitespace-nowrap">
                    Phác đồ Bù gốc 60% / 40%
                  </div>
                  <div className="text-[11px] text-stone-600 whitespace-nowrap">
                    Truy vết từ Lớp 1 → Lớp 12 (GDPT 2018)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. MÔ HÌNH 3 TẦNG DỊCH VỤ NỐI TIẾP — CÓ HÌNH ẢNH & MÀU SẮC ĐẶC TRƯNG TỪNG TẦNG
          ==================================================================== */}
      <section id="lo-trinh-3-tang" className="space-y-10 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase tracking-wider">
              <span>Phương Pháp Tiếp Cận Từ Gốc Rễ</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413] leading-tight">
              Vì sao học thêm nhiều nơi vẫn không tiến bộ? Chúng tôi giải quyết
              bằng 3 Tầng Đồng Hành Khép Kín.
            </h2>
          </div>
        </div>

        {/* 3 THẺ TẦNG DỊCH VỤ CÓ HÌNH ẢNH MINH HỌA & MÀU SẮC TƯƠI SÁNG */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tầng 1 */}
          <div className="rounded-3xl bg-gradient-to-b from-amber-50/90 to-white border-2 border-amber-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Tầng 1 Hướng nghiệp khám phá bản thân"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="whitespace-nowrap px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-extrabold shadow-xs">
                    TẦNG 1 · HƯỚNG NGHIỆP
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-editorial text-2xl font-bold text-stone-900">
                  Biết rõ mình sẽ trở thành ai
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Giải mã thiên hướng nghề nghiệp Holland RIASEC, tính cách Big
                  Five và giá trị cốt lõi để xây dựng{" "}
                  <strong>Bản đồ Thành công R1</strong> tới trường và ngành mục
                  tiêu.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2 flex flex-wrap gap-2">
              <span className="whitespace-nowrap px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                Trắc nghiệm RIASEC
              </span>
              <span className="whitespace-nowrap px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-[11px] font-bold">
                Tham vấn 1-1 Chuyên gia
              </span>
            </div>
          </div>

          {/* Tầng 2 */}
          <div className="rounded-3xl bg-gradient-to-b from-emerald-50/90 to-white border-2 border-emerald-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                  alt="Tầng 2 Cố vấn cuộc sống và tầm soát 3 mặt"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="whitespace-nowrap px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold shadow-xs">
                    TẦNG 2 · CỐ VẤN CUỘC SỐNG
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-editorial text-2xl font-bold text-stone-900">
                  Tầm soát 3 mặt & Truy vết lỗ hổng
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Tầm soát toàn diện 3 mặt: <strong>Kiến thức</strong> từ Lớp 1
                  đến lớp hiện tại, <strong>Sức khỏe tinh thần</strong> và{" "}
                  <strong>Thể chất</strong> để tháo gỡ áp lực điểm số và thiết
                  kế lộ trình 60/40.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2 flex flex-wrap gap-2">
              <span className="whitespace-nowrap px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                Đồ thị Kiến thức GDPT 2018
              </span>
              <span className="whitespace-nowrap px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-[11px] font-bold">
                Đồng hành Tâm lý & Kỹ năng
              </span>
            </div>
          </div>

          {/* Tầng 3 */}
          <div className="rounded-3xl bg-gradient-to-b from-indigo-50/90 to-white border-2 border-indigo-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80"
                  alt="Tầng 3 Gia sư bộ môn 60/40 và Nội trú an toàn"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="whitespace-nowrap px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-extrabold shadow-xs">
                    TẦNG 3 · GIA SƯ BỘ MÔN 60/40
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-editorial text-2xl font-bold text-stone-900">
                  Bù lỗ hổng gốc & Luyện thi bứt phá
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Kèm sát từng chủ đề bị hổng theo tỷ lệ{" "}
                  <strong>60% bù gốc lớp dưới / 40% bám sát lớp hiện tại</strong>{" "}
                  với hình thức linh hoạt từng buổi (Zoom · Trung tâm · Tại nhà).
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2 flex flex-wrap gap-2">
              <span className="whitespace-nowrap px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-[11px] font-bold">
                Toán · Lý · Hóa · Anh · Văn
              </span>
              <span className="whitespace-nowrap px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-[11px] font-bold">
                Đổi hình thức từng buổi
              </span>
            </div>
          </div>
        </div>

        {/* Khối Giải Thích Công Nghệ Tầm Soát 60/40 & 4 Cam Kết Vàng */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-3xl bg-white border-2 border-emerald-200/70 p-7 sm:p-9 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="whitespace-nowrap inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
                Công nghệ Tầm soát Thích ứng · Chương trình GDPT 2018
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413]">
                Truy ngược đúng điểm đứt gãy kiến thức từ các lớp dưới
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Khi học sinh Lớp 9 không giải được bài Rút gọn căn thức, nguyên
                nhân thực sự thường nằm ở 7 Hằng đẳng thức đáng nhớ của Lớp 8
                hoặc phân số Lớp 6. Hệ thống đánh giá thích ứng của OYLG tự động
                dò tìm điểm gốc rễ bị hổng ở cả 5 môn (Toán, Lý, Hóa, Anh, Văn)
                mà không bắt con làm những đề kiểm tra dài lê thê.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                <div className="font-extrabold text-amber-950 text-sm">
                  60% Thời lượng Bù Lỗ Hổng Gốc
                </div>
                <p className="text-stone-600 mt-1">
                  Lấp đầy các đơn vị kiến thức tiên quyết bị khuyết từ lớp dưới
                  theo đồ thị chương trình phổ thông mới.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                <div className="font-extrabold text-emerald-950 text-sm">
                  40% Thời lượng Bám Sát Trên Lớp
                </div>
                <p className="text-stone-600 mt-1">
                  Giúp con theo kịp bài giảng hiện tại trên trường và tự tin
                  trong các kỳ thi học kỳ, chuyển cấp.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl surface-oylg-dark bg-[#112A22] text-white p-7 sm:p-9 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="whitespace-nowrap inline-block px-3.5 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-extrabold">
                Chuẩn Mực Đạo Đức & An Toàn Học Đường
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                4 Cam kết Bảo vệ Bất biến của All Your Life
              </h3>
            </div>

            <ul className="space-y-3.5 text-xs text-stone-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Chuyên gia duyệt 100%:</strong>{" "}
                  Mọi báo cáo đánh giá và lộ trình học tập đều do Hội đồng Chuyên
                  môn kiểm định trước khi gửi tới Phụ huynh.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">
                    Bảo mật thông tin liên lạc:
                  </strong>{" "}
                  Mọi trao đổi chuyên môn diễn ra minh bạch trên cổng hệ thống,
                  bảo vệ quyền riêng tư của gia đình.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">
                    Không làm phiền Phụ huynh:
                  </strong>{" "}
                  Tổng hợp tiến độ gọn gàng vào 1 bản tin cuối ngày; chỉ thông
                  báo tức thì khi có lịch đưa đón hoặc cảnh báo quan trọng.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">
                    Hoàn học phí 100% trong 14 ngày:
                  </strong>{" "}
                  Thanh toán VietQR minh bạch về tài khoản Công ty TNHH All Your
                  Life và hoàn 100% số buổi chưa học trong 14 ngày đầu.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. CHỌN GÓI ĐỒNG HÀNH & BỘ TÍNH HỌC PHÍ (CÓ ẢNH MINH HỌA & MÀU SẮC NỔI BẬT)
          ==================================================================== */}
      <section id="bang-gia-goi-hoc" className="space-y-10 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-extrabold uppercase tracking-wider">
              <span>Cửa Hàng Gói Học & Biểu Phí Minh Bạch</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413]">
              Lựa chọn Gói Đồng Hành phù hợp hoặc Nhận Tư Vấn 1-1 cùng Cố Vấn
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">{b6IntroText}</p>
          </div>
        </div>

        {/* 3 GÓI DỊCH VỤ CHỦ LỰC — CÓ HÌNH ẢNH, MÀU SẮC & NÚT KHÔNG RỚT DÒNG */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {STANDARD_PACKAGES.map((pkg, idx) => {
            const isFeatured = idx === 1;
            return (
              <div
                key={pkg.code}
                className={`rounded-3xl bg-white overflow-hidden flex flex-col justify-between transition shadow-sm hover:shadow-xl ${
                  isFeatured
                    ? "border-2 border-emerald-600 ring-4 ring-emerald-500/10"
                    : "border border-stone-200"
                }`}
              >
                <div>
                  {/* Ảnh bìa gói học */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span
                        className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-extrabold ${pkg.badgeClass}`}
                      >
                        {pkg.tierLabel}
                      </span>
                      {isFeatured && (
                        <span className="btn-oylg-primary whitespace-nowrap px-3 py-1 rounded-full bg-[#E85D3F] text-white text-[11px] font-extrabold shadow-xs">
                          Phổ biến nhất
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="text-2xl font-extrabold">
                        {pkg.amountVnd.toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="font-editorial text-2xl font-bold text-[#141413] leading-snug">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {pkg.summary}
                    </p>
                    <ul className="space-y-2 pt-1 text-xs text-stone-700">
                      {pkg.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-4 border-t border-stone-100 space-y-2.5 bg-stone-50/60">
                  <button
                    onClick={() => handleStartBuyPackage(pkg)}
                    className={`whitespace-nowrap w-full group flex items-center justify-between pl-5 pr-2 py-2.5 rounded-full bg-gradient-to-r ${pkg.accentGradient} text-white text-xs font-extrabold shadow-xs hover:opacity-95 transition`}
                  >
                    <span className="whitespace-nowrap">
                      Đăng ký & Mua ngay qua VietQR
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const matched = ecomProducts[idx] ?? ecomProducts[0];
                      addToCart(matched, undefined, true);
                    }}
                    className="whitespace-nowrap w-full py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-950 transition"
                  >
                    + Thêm vào Giỏ gói học (Áp mã OYLG2026)
                  </button>

                  <a
                    href="#dang-ky-tu-van"
                    onClick={() =>
                      setConsultConcern(`Cần tư vấn kỹ hơn về ${pkg.title}`)
                    }
                    className="whitespace-nowrap w-full block text-center py-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-600 transition"
                  >
                    Nhận tư vấn miễn phí trước
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* BỘ CẤU HÌNH HỌC PHÍ CÁ NHÂN HÓA TẦNG 3 (B6) */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/80 border-2 border-indigo-200/80 p-6 sm:p-9 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-extrabold text-indigo-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                <span>Công cụ Tự Tính Học Phí Bộ Môn (Tầng 3)</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
                Tuỳ chỉnh Hình thức Học, Cấp bậc Giáo viên & Kỳ hạn Ưu đãi
              </h3>
            </div>
            <span className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold">
              Đổi linh hoạt từng buổi trên Cổng Phụ Huynh
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-2xs space-y-1.5">
                <label className="font-extrabold text-indigo-950 block">
                  1. Khối Lớp của Học sinh
                </label>
                <select
                  value={simGrade}
                  onChange={(e) => setSimGrade(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold text-stone-900"
                >
                  <option value={4}>Tiểu học Lớp 1–5 (Hệ số 0.8x)</option>
                  <option value={9}>THCS Lớp 6–9 (Hệ số 1.0x)</option>
                  <option value={11}>THPT Lớp 10–11 (Hệ số 1.2x)</option>
                  <option value={12}>Lớp 12 & Luyện thi Đại học (1.4x)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-2xs space-y-1.5">
                <label className="font-extrabold text-indigo-950 block">
                  2. Cấp bậc Chuyên gia Bộ môn
                </label>
                <select
                  value={simExpertTier}
                  onChange={(e) =>
                    setSimExpertTier(
                      e.target.value as "STANDARD" | "SENIOR" | "MASTER"
                    )
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold text-stone-900"
                >
                  <option value="STANDARD">Giáo viên Chuẩn (1.0x)</option>
                  <option value="SENIOR">Chuyên gia Cao cấp (1.3x)</option>
                  <option value="MASTER">Chuyên gia Trưởng môn (1.7x)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-2xs space-y-1.5">
                <label className="font-extrabold text-indigo-950 block">
                  3. Hình thức Học tập
                </label>
                <select
                  value={simMode}
                  onChange={(e) =>
                    setSimMode(
                      e.target.value as "ONLINE_ZOOM" | "AT_CENTER" | "AT_HOME"
                    )
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold text-stone-900"
                >
                  <option value="ONLINE_ZOOM">Online qua Zoom (1.0x)</option>
                  <option value="AT_CENTER">Tại Trung tâm OYLG (1.2x)</option>
                  <option value="AT_HOME">Gia sư Tại nhà Học sinh (1.5x)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-2xs space-y-1.5">
                <label className="font-extrabold text-indigo-950 block">
                  4. Quy mô Lớp & Kỳ hạn Đăng ký
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={simClassType}
                    onChange={(e) =>
                      setSimClassType(
                        e.target.value as
                          | "ONE_ON_ONE"
                          | "SMALL_GROUP"
                          | "LARGE_GROUP"
                      )
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold text-stone-900"
                  >
                    <option value="ONE_ON_ONE">Kèm 1-1 (1.0x)</option>
                    <option value="SMALL_GROUP">Nhóm 2–5 HS (0.6x)</option>
                    <option value="LARGE_GROUP">Nhóm 6–20 HS (0.35x)</option>
                  </select>
                  <select
                    value={simDurationMonths}
                    onChange={(e) =>
                      setSimDurationMonths(
                        Number(e.target.value) as 1 | 3 | 6 | 12
                      )
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold text-stone-900"
                  >
                    <option value={1}>1 Tháng (0%)</option>
                    <option value={3}>3 Tháng (-3%)</option>
                    <option value={6}>6 Tháng (-7%)</option>
                    <option value={12}>12 Tháng (-12%)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-3xl surface-oylg-indigo-dark bg-indigo-950 text-white p-6 space-y-4 shadow-lg">
              <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-indigo-200 font-semibold">
                  Chi phí 1 buổi học (90 phút)
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {singleSessionPrice.toLocaleString("vi-VN")} đ
                </div>
              </div>

              <div className="pt-3 border-t border-white/15 space-y-1.5 text-xs text-indigo-100">
                <div className="flex justify-between">
                  <span>Tổng số buổi ({simDurationMonths} tháng):</span>
                  <strong className="text-white">{totalSessions} buổi</strong>
                </div>
                <div className="flex justify-between">
                  <span>Ưu đãi cam kết dài hạn:</span>
                  <strong className="text-emerald-300">
                    Giảm {Math.round(discountRate * 100)}%
                  </strong>
                </div>
                <div className="flex justify-between pt-1 text-sm font-extrabold text-white">
                  <span>Thành tiền trọn gói:</span>
                  <span className="text-amber-300">
                    {totalPackageAfterDiscount.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(
                    {
                      id: `custom-b6-${simGrade}-${simExpertTier}-${simMode}-${simClassType}-${simDurationMonths}`,
                      code: `PKG-B6-L${simGrade}-${simDurationMonths}M`,
                      tierLabel: `Tầng 3 Tự Cấu Hình · Kỳ ${simDurationMonths} Tháng`,
                      title: `Gói Gia Sư Cá Nhân Hóa Lớp ${simGrade} (${totalSessions} buổi)`,
                      subtitle: `Chuyên gia ${simExpertTier} · Hình thức ${simMode} · Lớp ${simClassType}`,
                      listPriceVnd: totalPackageBeforeDiscount,
                      netPriceVnd: totalPackageAfterDiscount,
                      sessionsGranted: totalSessions,
                      sixMonthReferenceValueVnd: singleSessionPrice * 48 * 0.93,
                      highlights: [
                        `Đơn giá 1 buổi: ${singleSessionPrice.toLocaleString("vi-VN")}đ`,
                        `Tổng cộng ${totalSessions} buổi học nạp vào Ví gia đình`,
                      ],
                    },
                    `Lớp ${simGrade} · ${simMode} · ${simDurationMonths} tháng (${totalSessions} buổi)`,
                    true
                  );
                }}
                className="whitespace-nowrap w-full py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-stone-950 text-xs font-extrabold transition shadow-md"
              >
                + Thêm Cấu Hình Này Vào Giỏ Gói Học →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. HỘI ĐỒNG CHUYÊN GIA & CỐ VẤN — CÓ ẢNH CHÂN DUNG CHUYÊN NGHIỆP
          ==================================================================== */}
      <section id="doi-ngu-chuyen-gia" className="space-y-8 scroll-mt-24">
        <div className="max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Hội Đồng Chuyên Môn & Cố Vấn Đồng Hành</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413]">
            Đội ngũ Cố vấn Cuộc sống, Chuyên gia Hướng nghiệp & Trưởng Bộ môn
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Bấm vào từng Chuyên gia để xem hồ sơ năng lực chi tiết và đặt lịch
            tham vấn trực tiếp 1-1.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ezyTeamMembers.map((member) => {
            const portraitUrl =
              EXPERT_PORTRAITS[member.slug] ??
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80";
            return (
              <Link
                key={member.slug}
                href={`/pages/${member.slug}`}
                className="rounded-3xl bg-white border border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-xl overflow-hidden group flex flex-col justify-between transition"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-stone-100">
                    <img
                      src={portraitUrl}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="whitespace-nowrap px-2.5 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-extrabold flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-stone-950" />
                        {member.rating}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="whitespace-nowrap inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
                        {member.ezyRole}
                      </span>
                      <h3 className="font-editorial text-xl font-bold mt-1">
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs font-bold text-emerald-800 line-clamp-2">
                      {member.roleTitle}
                    </p>
                    <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-stone-600 leading-relaxed">
                      {member.achievementSummary}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3.5 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between text-xs font-extrabold text-[#E85D3F]">
                  <span className="whitespace-nowrap">
                    Xem hồ sơ & Đặt lịch 1-1
                  </span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          5. KHU NỘI TRÚ & BÁN TRÚ AN TOÀN 4 MỐC ĐIỂM DANH — CÓ HÌNH ẢNH TRỰC QUAN
          ==================================================================== */}
      <section
        id="noi-tru-an-toan"
        className="scroll-mt-24 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-emerald-50 border-2 border-sky-200/80 p-7 sm:p-10 shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="whitespace-nowrap inline-block px-3.5 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-extrabold uppercase tracking-wider">
              Dịch Vụ Nội Trú & Bán Trú Tiêu Chuẩn An Toàn Cao
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413] leading-tight">
              An tâm tuyệt đối với Điểm danh 4 mốc & Xác thực Người đón bằng Mã
              QR
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Dành cho các gia đình bận rộn hoặc học sinh ở xa tại TP. Buôn Ma
              Thuột & Tây Nguyên: Khu Bán trú và Nội trú của All Your Life tích
              hợp trực tiếp chế độ dinh dưỡng (cảnh báo dị ứng thực phẩm tự
              động), theo dõi thời lượng giấc ngủ để tránh quá tải học tập, và
              chỉ bàn giao học sinh cho đúng người được Phụ huynh ủy quyền có
              ảnh xác thực.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-sky-200 shadow-2xs space-y-1">
                <div className="font-extrabold text-sky-900">
                  1. Đến Trung tâm (Check-in QR)
                </div>
                <p className="text-stone-600">
                  Quét QR lúc đến, gửi thông báo tự động về điện thoại Phụ huynh.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-1">
                <div className="font-extrabold text-emerald-900">
                  2. Bữa ăn & Dinh dưỡng
                </div>
                <p className="text-stone-600">
                  Thực đơn tách riêng các món dị ứng theo hồ sơ sức khỏe của con.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-1">
                <div className="font-extrabold text-amber-900">
                  3. Đón trả An toàn (Ảnh + QR)
                </div>
                <p className="text-stone-600">
                  Chặn tuyệt đối người lạ chưa có trong danh sách ủy quyền của bố
                  mẹ.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-2xs space-y-1">
                <div className="font-extrabold text-indigo-900">
                  4. Điểm danh Giấc ngủ 21:30
                </div>
                <p className="text-stone-600">
                  Đồng bộ số giờ ngủ với Cố vấn để điều chỉnh khối lượng bài tập.
                </p>
              </div>
            </div>
          </div>

          {/* Bộ Ảnh Không Gian Học Tập & Nội Trú */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden h-48 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
                alt="Không gian học tập hiện đại"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-xs font-bold">
                Phòng học thông minh & Tự học có Cố vấn
              </span>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-48 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
                alt="Học sinh trao đổi 1-1"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-xs font-bold">
                Góc Tham vấn Tâm lý & Hướng nghiệp
              </span>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-48 shadow-sm col-span-2">
              <img
                src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1000&q=80"
                alt="Hoạt động ngoại khóa & kỹ năng sống"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-bold">
                <span>
                  Khu Bán trú & Rèn luyện Kỹ năng Sống — TP. Buôn Ma Thuột
                </span>
                <span className="whitespace-nowrap px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px]">
                  An toàn 4 Mốc QR
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. BIỂU MẪU ĐẶT LỊCH TƯ VẤN MIỄN PHÍ (#dang-ky-tu-van)
          ==================================================================== */}
      <section
        id="dang-ky-tu-van"
        className="scroll-mt-24 rounded-3xl surface-oylg-dark bg-[#112A22] text-white p-7 sm:p-10 shadow-xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-extrabold uppercase tracking-wider">
              <span>Đồng Hành Cùng Gia Đình Ngay Hôm Nay</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-white leading-tight">
              Đặt lịch trò chuyện 1-1 cùng Cố vấn Cuộc sống của All Your Life
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Nếu Quý Phụ huynh và Học sinh chưa biết nên bắt đầu từ gói dịch vụ
              nào, hãy để lại thông tin. Cố vấn Chuyên môn sẽ liên hệ trong vòng
              2 giờ làm việc để lắng nghe tình hình học tập hiện tại của con và
              tư vấn hướng đi phù hợp nhất.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-300">
              <span className="whitespace-nowrap flex items-center gap-1.5 text-emerald-300 font-bold">
                <PhoneCall className="w-4 h-4" />
                Hotline Tư vấn: 1900 636 888
              </span>
              <span>·</span>
              <span className="whitespace-nowrap">
                Bảo mật 100% thông tin Gia đình
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white text-[#141413] rounded-3xl p-6 sm:p-8 shadow-lg">
            {consultSubmitted ? (
              <div className="space-y-4 text-xs">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#141413]">
                  Cảm ơn Quý Phụ huynh {consultParentName}!
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Yêu cầu tư vấn cho em <strong>{consultStudentName}</strong>{" "}
                  (Lớp {consultGrade}) đã được chuyển tới bộ phận Cố vấn Cuộc
                  sống. Chuyên gia của chúng tôi sẽ liên hệ qua số điện thoại{" "}
                  <strong>{consultPhone}</strong> trong thời gian sớm nhất.
                </p>
                <button
                  onClick={() => setConsultSubmitted(false)}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#E85D3F] text-white font-bold"
                >
                  Gửi thêm yêu cầu khác
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleConsultationSubmit}
                className="space-y-3.5 text-xs"
              >
                <div className="text-base font-extrabold text-[#141413]">
                  Đăng ký Nhận Tư Vấn Lộ Trình 1-1 Miễn Phí
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">
                      Họ tên Phụ huynh *
                    </label>
                    <input
                      type="text"
                      required
                      value={consultParentName}
                      onChange={(e) => setConsultParentName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Thị Lan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">
                      Số điện thoại liên hệ *
                    </label>
                    <input
                      type="tel"
                      required
                      value={consultPhone}
                      onChange={(e) => setConsultPhone(e.target.value)}
                      placeholder="Ví dụ: 0905 123 489"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">
                      Họ tên Học sinh *
                    </label>
                    <input
                      type="text"
                      required
                      value={consultStudentName}
                      onChange={(e) => setConsultStudentName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Minh Khôi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">
                      Khối lớp *
                    </label>
                    <select
                      value={consultGrade}
                      onChange={(e) => setConsultGrade(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                        <option key={g} value={g}>
                          Lớp {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Vấn đề Gia đình đang quan tâm nhất
                  </label>
                  <textarea
                    rows={2}
                    value={consultConcern}
                    onChange={(e) => setConsultConcern(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-oylg-primary whitespace-nowrap w-full py-3 rounded-full bg-[#E85D3F] text-white font-extrabold transition shadow-md"
                >
                  Gửi Yêu Cầu Đặt Lịch Tư Vấn 1-1 Miễn Phí
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ====================================================================
          MODAL ĐĂNG NHẬP MUA GÓI & THANH TOÁN VIETQR (3 BƯỚC ĐÚNG MÔ HÌNH)
          ==================================================================== */}
      {checkoutPackage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-6 surface-oylg-dark bg-[#112A22] text-white flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-amber-300 font-bold">
                  {checkoutStep === "AUTH"
                    ? "Bước 1 / 3 · Đăng Nhập Tài Khoản Phụ Huynh"
                    : checkoutStep === "PAYMENT"
                    ? "Bước 2 / 3 · Hồ Sơ Học Sinh & Thanh Toán VietQR"
                    : "Bước 3 / 3 · Kích Hoạt Hồ Sơ Thành Công"}
                </div>
                <h3 className="text-base font-bold mt-1">
                  {checkoutPackage.title}
                </h3>
              </div>
              <button
                onClick={() => setCheckoutPackage(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {checkoutStep === "AUTH" && (
              <form
                onSubmit={handleConfirmParentLoginForCheckout}
                className="p-6 space-y-4 text-xs"
              >
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-stone-700">
                  Để bảo vệ quyền lợi học phí, lưu trữ báo cáo tầm soát và theo
                  dõi lộ trình của con, Quý Phụ huynh vui lòng{" "}
                  <strong>Đăng nhập hoặc Khởi tạo tài khoản Phụ huynh</strong>{" "}
                  trước khi thanh toán gói dịch vụ.
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-[#141413] block mb-1">
                      Họ và tên Phụ huynh *
                    </label>
                    <input
                      type="text"
                      required
                      value={authParentName}
                      onChange={(e) => setAuthParentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#141413] block mb-1">
                      Số điện thoại Phụ huynh (nhận OTP & thông báo) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={authParentPhone}
                      onChange={(e) => setAuthParentPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-oylg-primary whitespace-nowrap w-full py-3 rounded-full bg-[#E85D3F] text-white font-extrabold flex items-center justify-center gap-2 transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Xác Thực Tài Khoản Phụ Huynh & Tiếp Tục →</span>
                </button>
              </form>
            )}

            {checkoutStep === "PAYMENT" && (
              <form
                onSubmit={handleConfirmPaymentAndActivate}
                className="p-6 space-y-4 text-xs"
              >
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="font-bold text-[#141413] block mb-1">
                      Họ tên Học sinh thụ hưởng *
                    </label>
                    <input
                      type="text"
                      required
                      value={checkoutStudentName}
                      onChange={(e) => setCheckoutStudentName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#141413] block mb-1">
                      Khối lớp *
                    </label>
                    <select
                      value={checkoutGrade}
                      onChange={(e) =>
                        setCheckoutGrade(Number(e.target.value))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-bold"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                        <option key={g} value={g}>
                          Lớp {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#141413] block mb-1">
                    Mã Chuyên viên / CTV giới thiệu (nếu có)
                  </label>
                  <input
                    type="text"
                    value={checkoutRefCode}
                    onChange={(e) => setCheckoutRefCode(e.target.value)}
                    placeholder="Ví dụ: CTV-A102"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 font-mono"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-emerald-200 flex flex-col items-center justify-center shrink-0">
                    <QrCode className="w-10 h-10 text-emerald-800" />
                    <span className="text-[9px] font-bold mt-1">VietQR</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] text-stone-600">
                      Đơn vị thụ hưởng chính thức:
                    </div>
                    <div className="font-extrabold text-[#141413]">
                      CÔNG TY TNHH ALL YOUR LIFE (OYLG)
                    </div>
                    <div className="text-sm font-extrabold text-emerald-700">
                      Số tiền:{" "}
                      {checkoutPackage.amountVnd.toLocaleString("vi-VN")} đ
                    </div>
                    <div className="text-[11px] text-stone-600">
                      Cam kết hoàn tiền 100% các buổi chưa học trong 14 ngày đầu
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="whitespace-nowrap w-full py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold transition"
                >
                  Xác Nhận Đã Chuyển Khoản & Kích Hoạt Gói Học
                </button>
              </form>
            )}

            {checkoutStep === "SUCCESS" && (
              <div className="p-6 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
                  <div className="font-extrabold flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Đã kích hoạt thành công Mã hồ sơ #{createdOrderCode}!
                    </span>
                  </div>
                  <p>
                    Hồ sơ đồng hành của em{" "}
                    <strong>{checkoutStudentName}</strong> (Lớp {checkoutGrade})
                    đã sẵn sàng trên Cổng Phụ Huynh và Không Gian Học Sinh.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      setCheckoutPackage(null);
                      router.push("/parent");
                    }}
                    className="whitespace-nowrap py-3 px-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-center"
                  >
                    Vào Cổng Phụ Huynh →
                  </button>
                  <button
                    onClick={() => {
                      setCheckoutPackage(null);
                      router.push("/student");
                    }}
                    className="whitespace-nowrap py-3 px-4 rounded-full border-2 border-indigo-600 text-indigo-700 font-extrabold text-center"
                  >
                    Mở Bài Tầm Soát Cho Con →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
