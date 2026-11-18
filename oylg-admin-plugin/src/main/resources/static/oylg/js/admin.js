var oylgAdmin = window.oylgAdmin || {};

oylgAdmin.toast = function (msg, ok) {
    if (window.ezyadmin && typeof ezyadmin.shortToast === 'function') {
        ezyadmin.shortToast(ok === false ? 'bg-danger' : 'bg-success', msg);
    } else {
        alert(msg);
    }
};

oylgAdmin.postJson = function (path, body, successMsg) {
    fetch('/oylg/api/v1' + path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body || {})
    })
        .then(function (r) {
            if (!r.ok) {
                throw new Error('HTTP ' + r.status);
            }
            return r.json();
        })
        .then(function () {
            oylgAdmin.toast(successMsg || 'Đã lưu cập nhật thành công', true);
            setTimeout(function () {
                window.location.reload();
            }, 600);
        })
        .catch(function (e) {
            oylgAdmin.toast('Không thể lưu dữ liệu: ' + e.message, false);
        });
};

oylgAdmin.confirmPayment = function (orderCode) {
    oylgAdmin.postJson(
        '/webhooks/payment',
        { orderCode: orderCode },
        'Đã xác nhận thu học phí và cộng buổi học cho học sinh'
    );
};

oylgAdmin.sendDigest = function (studentId) {
    oylgAdmin.postJson(
        '/digests/dispatch',
        { studentId: studentId || 1 },
        'Đã gửi báo cáo ngày về Cổng Phụ huynh'
    );
};

oylgAdmin.reviewQuestion = function (id, status) {
    oylgAdmin.postJson(
        '/questions/' + id + '/review',
        { status: status },
        status === 'APPROVED' ? 'Đã duyệt câu hỏi vào Ngân hàng đề' : 'Đã gửi yêu cầu chỉnh sửa đề'
    );
};

oylgAdmin.resolveFlag = function (id) {
    oylgAdmin.postJson(
        '/safety-flags/' + id + '/resolve',
        {},
        'Đã đánh dấu xử lý xong cảnh báo an toàn'
    );
};

oylgAdmin.groupAction = function (id, action) {
    oylgAdmin.postJson(
        '/group-classes/' + id + '/action',
        { action: action },
        action === 'ADD_STUDENT' ? 'Đã ghép thêm 1 học sinh vào lớp nhóm' : 'Đã khai giảng lớp nhóm'
    );
};

oylgAdmin.pickSwatch = function (hex) {
    var input = document.getElementById('oylgPrimaryColor');
    var picker = document.getElementById('oylgPrimaryColorPicker');
    if (input) {
        input.value = hex;
    }
    if (picker) {
        picker.value = hex;
    }
    oylgAdmin.syncSettingsPreview();
};

oylgAdmin.syncSettingsPreview = function () {
    var colorInput = document.getElementById('oylgPrimaryColor');
    var textInput = document.getElementById('oylgAnnouncementText');
    var enabledInput = document.getElementById('oylgAnnouncementEnabled');
    var bar = document.getElementById('oylgPreviewBar');
    var btn = document.getElementById('oylgPreviewBtn');
    var hex = (colorInput && colorInput.value) || '#c84b31';
    if (bar) {
        bar.style.background = hex;
        bar.style.display = enabledInput && !enabledInput.checked ? 'none' : 'block';
        bar.textContent = (textInput && textInput.value) || 'Thông báo đầu trang';
    }
    if (btn) {
        btn.style.background = hex;
    }
};

oylgAdmin.saveSiteSettings = function () {
    var payload = {
        primaryColor: (document.getElementById('oylgPrimaryColor') || {}).value || '#c84b31',
        announcementEnabled: !!(document.getElementById('oylgAnnouncementEnabled') || {}).checked,
        announcementText: (document.getElementById('oylgAnnouncementText') || {}).value || '',
        hotline: (document.getElementById('oylgHotline') || {}).value || '1900 636 888',
        showPackages: !!(document.getElementById('oylgShowPackages') || {}).checked,
        showExperts: !!(document.getElementById('oylgShowExperts') || {}).checked,
        showBoarding: !!(document.getElementById('oylgShowBoarding') || {}).checked,
        showConsultation: !!(document.getElementById('oylgShowConsultation') || {}).checked,
        baseSessionPriceVnd: parseInt((document.getElementById('oylgBasePrice') || {}).value || '200000', 10)
    };
    fetch('/oylg/api/v1/settings', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(function (r) {
            if (!r.ok) {
                throw new Error('HTTP ' + r.status);
            }
            oylgAdmin.toast('Đã lưu cài đặt giao diện & học phí (đồng bộ Website sau 3 giây)', true);
        })
        .catch(function (e) {
            oylgAdmin.toast('Lỗi lưu cài đặt: ' + e.message, false);
        });
};
