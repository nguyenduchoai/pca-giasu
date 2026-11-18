/* ==========================================================================
   OYLG Native EzyPlatform Interactive Client (Zero-Framework Vanilla JS)
   Connects Thymeleaf SSR views with /api/v1/oylg/* endpoints
   ========================================================================== */

(function () {
    "use strict";

    window.oylg = window.oylg || {};

    function fmtVnd(n) {
        var num = Math.round(Number(n) || 0);
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }
    window.oylg.fmtVnd = fmtVnd;

    window.oylg.toast = function (msg) {
        var el = document.getElementById("oylgToast");
        if (!el) return;
        el.textContent = msg;
        el.classList.add("is-visible");
        clearTimeout(el._timer);
        el._timer = setTimeout(function () {
            el.classList.remove("is-visible");
        }, 3600);
    };

    window.oylg.openModal = function (id) {
        var m = document.getElementById(id);
        if (m) m.classList.add("is-open");
    };

    window.oylg.closeModal = function (id) {
        var m = document.getElementById(id);
        if (m) m.classList.remove("is-open");
    };

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            var modals = document.querySelectorAll(".modal-backdrop.is-open");
            for (var i = 0; i < modals.length; i++) {
                modals[i].classList.remove("is-open");
            }
        }
    });

    function postJson(url, body, cb) {
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body || {})
        })
            .then(function (r) { return r.json(); })
            .then(function (data) { cb(null, data); })
            .catch(function (err) { cb(err); });
    }

    // 1. VietQR Package Checkout Modal
    window.oylg.openCheckout = function (pkgCode, pkgTitle, priceVnd, sessions) {
        var codeEl = document.getElementById("checkoutPkgCode");
        var titleEl = document.getElementById("checkoutPkgTitle");
        var priceEl = document.getElementById("checkoutPkgPrice");
        var sessEl = document.getElementById("checkoutPkgSessions");
        var qrImg = document.getElementById("checkoutVietQrImg");
        var resultBox = document.getElementById("checkoutSuccessBox");
        var formBox = document.getElementById("checkoutFormBox");

        if (codeEl) codeEl.value = pkgCode;
        if (titleEl) titleEl.textContent = pkgTitle;
        if (priceEl) priceEl.textContent = fmtVnd(priceVnd);
        if (sessEl) sessEl.textContent = sessions + " buổi";
        if (qrImg) {
            var info = encodeURIComponent("OYLG " + pkgCode);
            qrImg.src = "https://img.vietqr.io/image/MB-0368889999-compact2.png?amount=" + priceVnd + "&addInfo=" + info;
        }
        if (resultBox) resultBox.style.display = "none";
        if (formBox) formBox.style.display = "block";
        window.oylg.openModal("oylgCheckoutModal");
    };

    window.oylg.submitVietQrOrder = function (e) {
        if (e) e.preventDefault();
        var payload = {
            packageCode: document.getElementById("checkoutPkgCode").value,
            studentId: document.getElementById("checkoutStudentId") ? document.getElementById("checkoutStudentId").value : 1,
            parentName: document.getElementById("checkoutParentName").value,
            parentPhone: document.getElementById("checkoutParentPhone").value,
            studentName: document.getElementById("checkoutStudentName").value,
            voucherCode: document.getElementById("checkoutVoucher").value,
            referralCode: document.getElementById("checkoutReferral").value
        };
        postJson("/api/v1/oylg/ecommerce/checkout-vietqr", payload, function (err, data) {
            if (err || !data) {
                window.oylg.toast("Không thể tạo đơn hàng lúc này, vui lòng thử lại");
                return;
            }
            document.getElementById("checkoutFormBox").style.display = "none";
            var box = document.getElementById("checkoutSuccessBox");
            box.style.display = "block";
            document.getElementById("resOrderCode").textContent = data.orderCode;
            document.getElementById("resNetPaid").textContent = fmtVnd(data.netPaidAmountVnd);
            document.getElementById("resWalletAfter").textContent = data.walletBalance + " buổi";
            window.oylg.toast("Đã xác nhận thanh toán " + data.orderCode + " và cộng buổi vào ví");
        });
    };

    // 2. B6 Dynamic Fee Simulator
    window.oylg.recalcB6 = function () {
        var gradeEl = document.getElementById("b6Grade");
        if (!gradeEl) return;
        var basePrice = document.getElementById("b6BasePrice") ? document.getElementById("b6BasePrice").value : 0;
        var q = new URLSearchParams({
            basePrice: basePrice || 0,
            grade: gradeEl.value,
            expertTier: document.getElementById("b6ExpertTier").value,
            deliveryMode: document.getElementById("b6Mode").value,
            classType: document.getElementById("b6ClassType").value,
            termMonths: document.getElementById("b6Term").value,
            sessionsPerMonth: "8"
        });
        fetch("/api/v1/oylg/ecommerce/quote?" + q.toString())
            .then(function (r) { return r.json(); })
            .then(function (d) {
                var u = document.getElementById("b6OutUnit");
                var t = document.getElementById("b6OutTotal");
                var s = document.getElementById("b6OutSessions");
                var m = document.getElementById("b6OutMult");
                var disc = document.getElementById("b6OutDisc");
                if (u) u.textContent = fmtVnd(d.unitSessionPriceVnd);
                if (t) t.textContent = fmtVnd(d.netPayableVnd);
                if (s) s.textContent = d.totalSessionsInTerm + " buổi";
                if (m) m.textContent = d.combinedMultiplier + "x";
                if (disc) disc.textContent = "-" + d.discountPercent + "% (" + fmtVnd(d.discountAmountVnd) + ")";
            });
    };

    // 3. Consultation Lead Submission
    window.oylg.submitLeadForm = function (e, formEl) {
        if (e) e.preventDefault();
        var fd = new FormData(formEl);
        var payload = {
            parentName: fd.get("parentName"),
            phone: fd.get("phone"),
            studentName: fd.get("studentName"),
            grade: fd.get("grade") || 9,
            serviceInterest: fd.get("serviceInterest") || "Tư vấn lộ trình 3 tầng 1-1",
            assignedExpert: fd.get("assignedExpert") || "ThS. Lê Minh Tâm"
        };
        postJson("/api/v1/oylg/leads", payload, function (err, data) {
            if (err || !data || !data.ok) {
                window.oylg.toast("Gửi đăng ký thất bại, vui lòng kiểm tra lại");
                return;
            }
            formEl.reset();
            window.oylg.toast("Đã ghi nhận lịch hẹn cùng " + data.assignedExpert + " (Mã phiếu #" + data.leadId + ")");
        });
    };

    // 4. Parent Portal Actions
    window.oylg.rescheduleLesson = function (lessonId, newSlot) {
        postJson("/api/v1/oylg/lessons/" + lessonId + "/reschedule", { scheduleLabel: newSlot }, function (err, data) {
            if (!err && data && data.ok) {
                var slotEl = document.getElementById("lessonSlot-" + lessonId);
                if (slotEl) slotEl.textContent = data.scheduleLabel;
                window.oylg.toast("Đã dời lịch học sang " + data.scheduleLabel);
            }
        });
    };

    window.oylg.switchModality = function (lessonId, mode) {
        postJson("/api/v1/oylg/lessons/" + lessonId + "/switch-mode", { deliveryMode: mode }, function (err, data) {
            if (!err && data && data.ok) {
                window.oylg.toast("Đã đổi sang " + mode + " · Đơn giá buổi: " + fmtVnd(data.sessionPriceVnd));
                setTimeout(function () { location.reload(); }, 600);
            }
        });
    };

    window.oylg.refundOrder14d = function (orderId) {
        postJson("/api/v1/oylg/orders/" + orderId + "/refund-14d", {}, function (err, data) {
            if (!err && data && data.ok) {
                window.oylg.toast("Đã hoàn " + fmtVnd(data.refundedAmountVnd) + " cho đơn " + data.orderCode);
                setTimeout(function () { location.reload(); }, 700);
            }
        });
    };

    // 5. Student Adaptive Quiz & Daily Tasks
    var quizSteps = {
        9: {
            code: "TOAN.09.CBH.01 · Lớp 9",
            title: "Rút gọn biểu thức căn bậc hai với điều kiện x < 3:",
            formula: "P = căn((x - 3)^2) + x - 1",
            hint: "Hãy xét dấu của (x - 3) khi x < 3 trước khi bỏ dấu giá trị tuyệt đối |x - 3|.",
            options: [
                { key: "A", label: "A. P = 2x - 4", correct: false, nextGrade: 8, reason: "Sai dấu giá trị tuyệt đối |x - 3| → Hệ thống lùi về kiểm tra Hằng đẳng thức Lớp 8 (TOAN.08.HDT.01)" },
                { key: "B", label: "B. P = 2", correct: true, nextGrade: 9, reason: "Chính xác: vì x < 3 nên |x - 3| = 3 - x, suy ra P = 3 - x + x - 1 = 2 → Tự động suy luận ĐẠT nhánh tiên quyết dưới" },
                { key: "C", label: "C. P = 4 - 2x", correct: false, nextGrade: 8, reason: "Nhầm dấu khi thu gọn đa thức → Lùi về kiểm tra TOAN.08.HDT.01" }
            ]
        },
        8: {
            code: "TOAN.08.HDT.01 · Lớp 8 (Truy ngược bậc 1)",
            title: "Khai triển hằng đẳng thức bình phương của một hiệu (x - 3)^2:",
            formula: "(x - 3)^2 = ?",
            hint: "Áp dụng (A - B)^2 = A^2 - 2AB + B^2 với A = x và B = 3.",
            options: [
                { key: "A", label: "A. x^2 - 9", correct: false, nextGrade: 7, reason: "Nhầm sang hiệu hai bình phương → Lùi tiếp về Lũy thừa số hữu tỉ Lớp 7 (TOAN.07.SHT.02)" },
                { key: "B", label: "B. x^2 - 6x + 9", correct: true, nextGrade: 8, reason: "Nắm vững khai triển Lớp 8 → Khoanh vùng lỗ hổng nằm ở bước phá trị tuyệt đối Lớp 9" },
                { key: "C", label: "C. x^2 - 3x + 9", correct: false, nextGrade: 7, reason: "Thiếu hệ số 2AB → Lùi tiếp về Lớp 7 để kiểm tra phép nhân đơn thức" }
            ]
        },
        7: {
            code: "TOAN.07.SHT.02 · Lớp 7 (Điểm gốc tiên quyết)",
            title: "Tính giá trị lũy thừa của số âm: (-3)^2 bằng bao nhiêu?",
            formula: "(-3)^2 = (-3) × (-3)",
            hint: "Tích của hai số âm là một số dương.",
            options: [
                { key: "A", label: "A. -9", correct: false, nextGrade: 7, reason: "Khoanh vùng xong: Lỗ hổng gốc nằm ở quy tắc dấu lũy thừa Lớp 7 (TOAN.07.SHT.02)" },
                { key: "B", label: "B. 9", correct: true, nextGrade: 8, reason: "Nền Lớp 7 đã vững → Xác nhận lỗ hổng gốc chính xác tại TOAN.08.HDT.01 (Lớp 8), xếp 60% thời lượng bù gốc" },
                { key: "C", label: "C. -6", correct: false, nextGrade: 7, reason: "Nhầm lũy thừa với phép nhân 2 → Khoanh vùng gốc tại TOAN.07.SHT.02" }
            ]
        }
    };

    window.oylg.renderQuizGrade = function (grade) {
        var step = quizSteps[grade] || quizSteps[9];
        var codeEl = document.getElementById("quizUnitCode");
        if (!codeEl) return;
        codeEl.textContent = step.code;
        document.getElementById("quizStem").textContent = step.title;
        document.getElementById("quizFormula").textContent = step.formula;
        var hintBox = document.getElementById("quizHintBox");
        hintBox.style.display = "none";
        hintBox.textContent = step.hint;

        var optWrap = document.getElementById("quizOptions");
        optWrap.innerHTML = "";
        step.options.forEach(function (opt) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "btn btn--outline btn--full";
            btn.style.justifyContent = "flex-start";
            btn.textContent = opt.label;
            btn.onclick = function () {
                var traceLog = document.getElementById("quizTraceOutcome");
                traceLog.textContent = opt.reason;
                traceLog.className = opt.correct ? "card card--compact tag--pos" : "card card--compact tag--neg";
                traceLog.style.height = "auto";
                traceLog.style.whiteSpace = "normal";
                if (!opt.correct && opt.nextGrade !== grade) {
                    setTimeout(function () {
                        window.oylg.renderQuizGrade(opt.nextGrade);
                    }, 900);
                }
            };
            optWrap.appendChild(btn);
        });
    };

    window.oylg.toggleHint = function () {
        var b = document.getElementById("quizHintBox");
        if (b) b.style.display = b.style.display === "none" ? "block" : "none";
    };

    window.oylg.completeStudentTask = function (studentId, btnEl, xp) {
        if (btnEl.dataset.done === "1") return;
        btnEl.dataset.done = "1";
        btnEl.textContent = "Đã hoàn thành (+" + xp + " XP)";
        btnEl.classList.remove("btn--secondary");
        btnEl.classList.add("tag--pos");
        postJson("/api/v1/oylg/students/" + studentId + "/progress", { deltaXp: xp }, function (err, data) {
            if (!err && data && data.ok) {
                var xpEl = document.getElementById("studentXpVal");
                if (xpEl) xpEl.textContent = data.xpPoints + " XP";
                window.oylg.toast("Cộng +" + xp + " XP vào hồ sơ học tập");
            }
        });
    };

    window.oylg.setStudentMood = function (studentId, moodCode, label) {
        postJson("/api/v1/oylg/students/" + studentId + "/progress", { deltaXp: 0, moodStatus: moodCode }, function () {
            window.oylg.toast("Đã gửi trạng thái '" + label + "' tới Cố vấn Cuộc sống");
        });
    };

    // 6. Coach 4D Heatmap Slider & 60s Lesson Log DLP
    window.oylg.setHeatmapWeek = function (week, btnEl) {
        var btns = document.querySelectorAll("[data-hm-week]");
        for (var i = 0; i < btns.length; i++) btns[i].classList.remove("btn--primary");
        if (btnEl) btnEl.classList.add("btn--primary");

        var boost = week === 1 ? 0 : (week === 4 ? 18 : (week === 8 ? 36 : 54));
        var cards = document.querySelectorAll("[data-base-score]");
        for (var j = 0; j < cards.length; j++) {
            var base = parseInt(cards[j].getAttribute("data-base-score"), 10) || 40;
            var next = Math.min(98, base + boost);
            var scoreSpan = cards[j].querySelector(".hm-score");
            var badgeSpan = cards[j].querySelector(".hm-badge");
            if (scoreSpan) scoreSpan.textContent = next + "%";
            if (badgeSpan) {
                if (next >= 70) {
                    badgeSpan.className = "tag tag--pos hm-badge";
                    badgeSpan.textContent = "Đã nắm vững";
                } else {
                    badgeSpan.className = "tag tag--neg hm-badge";
                    badgeSpan.textContent = "Cần bù gốc";
                }
            }
        }
    };

    window.oylg.previewLessonDlp = function () {
        var input = document.getElementById("lessonRawNotes");
        if (!input) return;
        postJson("/api/v1/oylg/lessons/preview-dlp", { rawText: input.value }, function (err, data) {
            if (err || !data) return;
            var out = document.getElementById("lessonSanitizedPreview");
            var meta = document.getElementById("lessonDlpMeta");
            var alertBox = document.getElementById("lessonM14Alert");
            if (out) out.textContent = data.sanitizedText || "(Chưa có nội dung)";
            if (meta) {
                meta.textContent = data.maskedCount > 0
                    ? "Đã tự động che " + data.maskedCount + " thông tin liên hệ cá nhân"
                    : "Nội dung hợp lệ chuẩn bảo mật OYLG";
            }
            if (alertBox) {
                alertBox.style.display = data.redSafetyTriggered ? "block" : "none";
            }
        });
    };

    window.oylg.fillSampleNote = function (kind) {
        var input = document.getElementById("lessonRawNotes");
        if (!input) return;
        if (kind === "dlp") {
            input.value = "Hôm nay con nắm vững hằng đẳng thức số 1 và 2. Phụ huynh nhắn riêng zalo.me/thayviettoan hoặc gọi không chín không năm một hai ba bốn tám chín để trao đổi thêm.";
        } else {
            input.value = "Con chia sẻ tuần này kiệt sức kéo dài và xuất hiện suy nghĩ không muốn sống do áp lực thi cử.";
        }
        window.oylg.previewLessonDlp();
    };

    window.oylg.submitLessonLogForm = function (e) {
        if (e) e.preventDefault();
        var payload = {
            studentId: document.getElementById("logStudentId").value,
            unitCode: document.getElementById("logUnitCode").value,
            understandingLevel: document.getElementById("logUnderstanding").value,
            moodObserved: document.getElementById("logMood").value,
            focusScore: document.getElementById("logFocus").value,
            rawTutorNotes: document.getElementById("lessonRawNotes").value,
            internalNotes: document.getElementById("logInternalNotes").value
        };
        postJson("/api/v1/oylg/lessons/log", payload, function (err, data) {
            if (!err && data) {
                var msg = data.redSafetyTriggered
                    ? "Đã lưu biên bản và kích hoạt Cờ Đỏ M14 (Tổng đài 111 / 115)"
                    : "Đã lưu biên bản 60s và cập nhật Bản tin Phụ huynh";
                window.oylg.toast(msg);
                setTimeout(function () { location.reload(); }, 800);
            }
        });
    };

    // 7. Sales Commission & Lead Actions + Boarding QR
    window.oylg.recalcCommission = function () {
        var fp = document.getElementById("commFirstPay");
        if (!fp) return;
        var payload = {
            firstPaymentVnd: fp.value,
            sixMonthValueVnd: document.getElementById("commSixMonth").value,
            collectedPeriods: document.getElementById("commPeriods").value,
            totalPeriods: 6,
            isDirectByLeader: document.getElementById("commRole").value === "LEADER_DIRECT",
            isCareUpsell: document.getElementById("commRole").value === "CARE_UPSELL"
        };
        var pLabel = document.getElementById("commPeriodsLabel");
        if (pLabel) pLabel.textContent = payload.collectedPeriods + " / 6 kỳ";
        postJson("/api/v1/oylg/commission/simulate", payload, function (err, d) {
            if (err || !d) return;
            document.getElementById("commOutDthh").textContent = fmtVnd(d.dthhBaseVnd);
            document.getElementById("commOutEntitled").textContent = fmtVnd(d.totalEntitledVnd);
            document.getElementById("commOutUnlocked").textContent = fmtVnd(d.unlockedPayableVnd);
            document.getElementById("commOutClawback").textContent = fmtVnd(d.cancelledUncollectedVnd);
        });
    };

    window.oylg.advanceLead = function (leadId) {
        postJson("/api/v1/oylg/leads/" + leadId + "/advance", {}, function (err, d) {
            if (!err && d && d.ok) {
                window.oylg.toast("Đã chuyển trạng thái hồ sơ sang " + d.stage);
                setTimeout(function () { location.reload(); }, 600);
            }
        });
    };

    window.oylg.verifyPickup = function (pickupId) {
        postJson("/api/v1/oylg/boarding/verify-pickup", { pickupId: pickupId }, function (err, d) {
            if (err || !d) return;
            var box = document.getElementById("pickupVerifyResult");
            if (box) {
                box.style.display = "block";
                box.className = d.authorized ? "card card--compact tag--pos" : "card card--compact tag--neg";
                box.style.height = "auto";
                box.style.whiteSpace = "normal";
                box.textContent = d.message;
            }
            window.oylg.toast(d.message);
            setTimeout(function () { location.reload(); }, 1100);
        });
    };

    // 8. Admin / Studio Actions on Web Portals
    window.oylg.saveWebBasePrice = function () {
        var v = document.getElementById("execBasePrice").value;
        postJson("/api/v1/oylg/settings/base-price", { basePriceVnd: v }, function (err, d) {
            if (!err && d && d.ok) {
                window.oylg.toast("Đã lưu đơn giá gốc B6: " + fmtVnd(d.basePriceVnd) + " vào ezy_settings");
                window.oylg.recalcB6();
            }
        });
    };

    window.oylg.groupAction = function (groupId, action) {
        postJson("/api/v1/oylg/group-classes/" + groupId + "/action", { action: action }, function () {
            window.oylg.toast("Đã cập nhật trạng thái lớp nhóm");
            setTimeout(function () { location.reload(); }, 500);
        });
    };

    window.oylg.reviewQuestionWeb = function (id, status) {
        postJson("/api/v1/oylg/questions/" + id + "/review", { status: status }, function () {
            window.oylg.toast("Đã cập nhật trạng thái thẩm định câu hỏi");
            setTimeout(function () { location.reload(); }, 500);
        });
    };

    window.oylg.generateQuestionWeb = function (e) {
        if (e) e.preventDefault();
        var payload = {
            subjectLabel: document.getElementById("genSubject").value,
            unitCode: document.getElementById("genUnitCode").value,
            diagnosticGoal: document.getElementById("genGoal").value
        };
        postJson("/api/v1/oylg/questions/generate", payload, function (err, d) {
            if (!err && d && d.ok) {
                window.oylg.toast("Đã tạo bản nháp câu hỏi " + d.questionCode);
                setTimeout(function () { location.reload(); }, 600);
            }
        });
    };

    document.addEventListener("DOMContentLoaded", function () {
        window.oylg.recalcB6();
        window.oylg.renderQuizGrade(9);
        window.oylg.previewLessonDlp();
        window.oylg.recalcCommission();
    });
})();
