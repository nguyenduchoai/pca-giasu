"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePlatform } from "@/lib/platform-store";
import {
  Puzzle,
  Save,
  CheckCircle2,
  Globe,
  Code2,
  Sparkles,
} from "lucide-react";

export default function EzyAdminPageFragmentsPage() {
  const { ezyPageFragments, updateEzyPageFragment } = usePlatform();
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const f of ezyPageFragments) {
      map[`${f.pageName}/${f.fragmentName}`] = f.contentVi;
    }
    return map;
  });
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const handleSave = (pageName: string, fragmentName: string) => {
    const key = `${pageName}/${fragmentName}`;
    updateEzyPageFragment(pageName, fragmentName, drafts[key] ?? "");
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Card chuẩn EzyAdmin */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-bold">
            <Puzzle className="w-4 h-4" />
            <span>
              /ezyarticle/pages/fragments · OylgPageFragmentConfig.java (oylg-sdk)
            </span>
          </div>
          <h1 className="text-lg font-extrabold text-slate-900 mt-1">
            Quản lý Đoạn Trang Cố Định (Editable Page Fragments — Chuẩn
            Consulting Theme)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Chỉnh sửa trực tiếp nội dung các khối trên Website (
            <code>layout:decorate=&quot;~&#123;ezytheme&#125;&quot;</code>) mà
            không cần sửa code HTML hay biên dịch lại Java.
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
        >
          <Globe className="w-4 h-4" />
          <span>Mở Website Công Khai Kiểm Tra Ngay</span>
        </Link>
      </div>

      {/* Danh sách các Page Fragments đã đăng ký trong OylgPageFragmentConfig */}
      <div className="grid grid-cols-1 gap-4">
        {ezyPageFragments.map((frag) => {
          const key = `${frag.pageName}/${frag.fragmentName}`;
          return (
            <div
              key={key}
              className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
            >
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[11px] font-bold">
                    {frag.pageName}/{frag.fragmentName}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {frag.titleVi}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="font-mono flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                    th:replace=&quot;~&#123;fragments/fragment :: content(name=&apos;{frag.fragmentName}&apos;)&#125;&quot;
                  </span>
                  <span>Cập nhật: {frag.updatedAt}</span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <textarea
                  rows={2}
                  value={drafts[key] ?? frag.contentVi}
                  onChange={(e) =>
                    setDrafts((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full rounded border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>
                      Nạp tự động qua{" "}
                      <code>OylgWebViewDecorator.java (Reactive.multiple)</code>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {savedKey === key && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Đã đồng bộ trực tiếp ra Website Công Khai!
                      </span>
                    )}
                    <button
                      onClick={() =>
                        handleSave(frag.pageName, frag.fragmentName)
                      }
                      className="px-3.5 py-1.5 rounded bg-[#007bff] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu Fragment (SSOT)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
