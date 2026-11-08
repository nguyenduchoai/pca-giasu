package com.allyourlife.oylg.service;

import com.tvd12.ezyfox.bean.annotation.EzySingleton;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Đặt tại module: oylg-sdk (SSOT)
 * Thực thi 4 Nguyên tắc Bảo vệ Bất biến (Mục 1.4 Đặc tả OYLG):
 * 1. DLP: Chặn & che số điện thoại, Zalo, link MXH trong biên bản buổi học/tin nhắn.
 * 2. Chống làm phiền phụ huynh: Tối đa 1 bản tin tổng hợp/ngày.
 * 3. Kiểm duyệt con người (Human-in-the-loop): Mọi nội dung AI sinh phải được duyệt.
 * 4. Nhận diện tín hiệu nguy cơ tâm lý (M14): Hiện ngay hotline 111 / 115.
 */
@EzySingleton
public class OylgGuardrailService {

    private static final Pattern VIETNAM_PHONE_PATTERN = Pattern.compile(
        "(?:\\+?84|0)(?:[35789])(?:[\\s.\\-]*\\d){8}\\b"
    );
    private static final Pattern SOCIAL_CONTACT_PATTERN = Pattern.compile(
        "(?i)\\b(zalo\\.me/\\S+|zalo\\s*[:\\-]?\\s*\\w+|fb\\.com/\\S+|facebook\\.com/\\S+|t\\.me/\\S+|@[a-zA-Z0-9_.]{3,})\\b"
    );

    private static final List<String> RED_SAFETY_KEYWORDS = Arrays.asList(
        "tự tử", "muốn chết", "không muốn sống", "tự làm đau", "cắt tay",
        "bạo hành", "xâm hại", "bắt nạt nghiêm trọng", "nhảy lầu", "kết thúc cuộc đời"
    );

    public String sanitizePrivateContactInfo(String rawText) {
        if (rawText == null || rawText.isEmpty()) {
            return "";
        }
        String maskedPhone = VIETNAM_PHONE_PATTERN
            .matcher(rawText)
            .replaceAll("[ĐÃ CHE SĐT THEO QUY ĐỊNH OYLG]");
        return SOCIAL_CONTACT_PATTERN
            .matcher(maskedPhone)
            .replaceAll("[ĐÃ CHE LIÊN HỆ CÁ NHÂN THEO QUY ĐỊNH OYLG]");
    }

    public boolean containsRedSafetySignal(String text) {
        if (text == null || text.isEmpty()) {
            return false;
        }
        String normalized = text.toLowerCase();
        for (String keyword : RED_SAFETY_KEYWORDS) {
            if (normalized.contains(keyword)) {
                return true;
            }
        }
        return false;
    }
}
