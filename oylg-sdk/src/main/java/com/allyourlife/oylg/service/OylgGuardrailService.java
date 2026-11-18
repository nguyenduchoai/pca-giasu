package com.allyourlife.oylg.service;

import com.tvd12.ezyfox.bean.annotation.EzySingleton;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@EzySingleton
public class OylgGuardrailService {

    private static final Pattern VIETNAM_PHONE_PATTERN = Pattern.compile(
        "(?:\\+?84|0)(?:[35789])(?:[\\s.\\-]*\\d){8}\\b"
    );
    private static final Pattern WORD_PHONE_PATTERN = Pattern.compile(
        "(?i)(?:không|khong)\\s+(?:chín|chin|ba|năm|nam|bảy|bay|tám|tam)(?:\\s+(?:không|khong|một|mot|hai|ba|bốn|bon|tư|tu|năm|nam|lăm|lam|sáu|sau|bảy|bay|tám|tam|chín|chin)){6,9}"
    );
    private static final Pattern SOCIAL_CONTACT_PATTERN = Pattern.compile(
        "(?i)(zalo\\.me/\\S+|zalo\\s*[:\\-]\\s*\\S+|fb\\.com/\\S+|facebook\\.com/\\S+|t\\.me/\\S+)"
    );

    private static final List<String> RED_SAFETY_KEYWORDS = Arrays.asList(
        "tự tử", "muốn chết", "không muốn sống", "tự làm đau", "cắt tay",
        "bạo hành", "xâm hại", "bắt nạt nghiêm trọng", "nhảy lầu",
        "kết thúc cuộc đời", "buông xuôi tất cả"
    );

    public static class GuardrailResult {
        private final String sanitizedText;
        private final int maskedCount;
        private final boolean redSafetyTriggered;

        public GuardrailResult(String sanitizedText, int maskedCount, boolean redSafetyTriggered) {
            this.sanitizedText = sanitizedText;
            this.maskedCount = maskedCount;
            this.redSafetyTriggered = redSafetyTriggered;
        }

        public String getSanitizedText() {
            return sanitizedText;
        }

        public int getMaskedCount() {
            return maskedCount;
        }

        public boolean isRedSafetyTriggered() {
            return redSafetyTriggered;
        }
    }

    public GuardrailResult inspectAndSanitize(String rawText) {
        if (rawText == null || rawText.isEmpty()) {
            return new GuardrailResult("", 0, false);
        }
        int count = 0;
        Matcher m1 = VIETNAM_PHONE_PATTERN.matcher(rawText);
        StringBuffer sb1 = new StringBuffer();
        while (m1.find()) {
            count++;
            m1.appendReplacement(sb1, "[ĐÃ CHE SĐT CÁ NHÂN]");
        }
        m1.appendTail(sb1);

        Matcher m2 = WORD_PHONE_PATTERN.matcher(sb1.toString());
        StringBuffer sb2 = new StringBuffer();
        while (m2.find()) {
            count++;
            m2.appendReplacement(sb2, "[ĐÃ CHE SĐT VIẾT CHỮ]");
        }
        m2.appendTail(sb2);

        Matcher m3 = SOCIAL_CONTACT_PATTERN.matcher(sb2.toString());
        StringBuffer sb3 = new StringBuffer();
        while (m3.find()) {
            count++;
            m3.appendReplacement(sb3, "[ĐÃ CHE LIÊN KẾT CÁ NHÂN]");
        }
        m3.appendTail(sb3);

        boolean safety = containsRedSafetySignal(rawText);
        return new GuardrailResult(sb3.toString(), count, safety);
    }

    public String sanitizePrivateContactInfo(String rawText) {
        return inspectAndSanitize(rawText).getSanitizedText();
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
