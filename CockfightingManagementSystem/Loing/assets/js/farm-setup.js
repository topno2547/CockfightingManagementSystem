const farmSetupForm = document.querySelector("#farm-setup-form");
const FARM_SETUP_ENDPOINT = ""; // TODO: เมื่อ Backend พร้อม ให้เปลี่ยนเป็น endpoint จริง เช่น "../api/farms.php"
const DASHBOARD_URL = "dashboard.php";

const farmName = document.querySelector("#farm-name");
const farmPhone = document.querySelector("#farm-phone");
const farmAddress = document.querySelector("#farm-address");
const farmDescription = document.querySelector("#farm-description");

const farmProfileImage = document.querySelector("#farm-profile-image");
const farmProfilePreview = document.querySelector("#farm-profile-preview");

const farmCoverImage = document.querySelector("#farm-cover-image");
const farmCoverPreview = document.querySelector("#farm-cover-preview");

const saveFarmBtn = document.querySelector("#save-farm-btn");
const skipFarmBtn = document.querySelector("#skip-farm-btn");

const farmSuccessModal = document.querySelector("#farm-success-modal");
const goDashboardBtn = document.querySelector("#go-dashboard-btn");

const farmNameError = document.querySelector("#farm-name-error");
const farmPhoneError = document.querySelector("#farm-phone-error");
const farmAddressError = document.querySelector("#farm-address-error");
const farmDescriptionError = document.querySelector("#farm-description-error");
const farmProfileImageError = document.querySelector("#farm-profile-image-error");
const farmCoverImageError = document.querySelector("#farm-cover-image-error");

/* =========================
   Event Validation
========================= */
farmName.addEventListener("input", validateFarmName);
farmPhone.addEventListener("input", validateFarmPhone);
farmAddress.addEventListener("input", validateFarmAddress);
farmDescription.addEventListener("input", validateFarmDescription);

farmProfileImage.addEventListener("change", function () {
    previewImage(farmProfileImage, farmProfilePreview, farmProfileImageError);
});

farmCoverImage.addEventListener("change", function () {
    previewImage(farmCoverImage, farmCoverPreview, farmCoverImageError);
});

/* =========================
   Validate Farm Name
========================= */
function validateFarmName() {
    const value = farmName.value.trim();

    if (value === "") {
        setError(farmName, farmNameError, "*กรุณากรอกชื่อฟาร์ม");
        return false;
    }

    if (value.length < 2) {
        setError(farmName, farmNameError, "*ชื่อฟาร์มต้องมีอย่างน้อย 2 ตัวอักษร");
        return false;
    }

    if (value.length > 80) {
        setError(farmName, farmNameError, "*ชื่อฟาร์มต้องไม่เกิน 80 ตัวอักษร");
        return false;
    }

    setSuccess(farmName, farmNameError);
    return true;
}

/* =========================
   Validate Farm Phone
========================= */
function validateFarmPhone() {
    const value = farmPhone.value.trim();
    const pattern = /^[0-9]{10}$/;

    if (value === "") {
        setError(farmPhone, farmPhoneError, "*กรุณากรอกเบอร์โทรติดต่อ");
        return false;
    }

    if (!pattern.test(value)) {
        setError(farmPhone, farmPhoneError, "*กรอกเบอร์โทร 10 หลัก เช่น 0912345678");
        return false;
    }

    setSuccess(farmPhone, farmPhoneError);
    return true;
}

/* =========================
   Validate Farm Address
========================= */
function validateFarmAddress() {
    const value = farmAddress.value.trim();

    if (value === "") {
        setError(farmAddress, farmAddressError, "*กรุณากรอกที่อยู่ฟาร์ม");
        return false;
    }

    if (value.length < 10) {
        setError(farmAddress, farmAddressError, "*ที่อยู่ควรมีอย่างน้อย 10 ตัวอักษร");
        return false;
    }

    setSuccess(farmAddress, farmAddressError);
    return true;
}

/* =========================
   Validate Description
========================= */
function validateFarmDescription() {
    const value = farmDescription.value.trim();

    // ไม่บังคับกรอก ถ้าว่างให้ผ่านเลย
    if (value === "") {
        setSuccess(farmDescription, farmDescriptionError);
        return true;
    }

    // ถ้ากรอกมา ค่อยเช็กว่าไม่ยาวเกินไป
    if (value.length > 300) {
        setError(farmDescription, farmDescriptionError, "*รายละเอียดฟาร์มต้องไม่เกิน 300 ตัวอักษร");
        return false;
    }

    setSuccess(farmDescription, farmDescriptionError);
    return true;
}

/* =========================
   Error / Success UI
========================= */
function setError(input, errorElement, message) {
    const inputGroup = input.closest(".input-group");

    if (inputGroup) {
        inputGroup.classList.remove("success");
        inputGroup.classList.add("error");
    }

    errorElement.textContent = message;
}

function setSuccess(input, errorElement) {
    const inputGroup = input.closest(".input-group");

    if (inputGroup) {
        inputGroup.classList.remove("error");
        inputGroup.classList.add("success");
    }

    errorElement.textContent = "";
}

/* =========================
   Image Preview
========================= */
function previewImage(input, preview, errorElement) {
    const file = input.files[0];

    errorElement.textContent = "";

    if (!file) {
        preview.src = "";
        preview.classList.remove("show");
        return false;
    }

    const allowTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowTypes.includes(file.type)) {
        errorElement.textContent = "*รองรับเฉพาะไฟล์ JPG, PNG หรือ WEBP";
        input.value = "";
        preview.src = "";
        preview.classList.remove("show");
        return false;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
        errorElement.textContent = "*รูปภาพต้องมีขนาดไม่เกิน 2MB";
        input.value = "";
        preview.src = "";
        preview.classList.remove("show");
        return false;
    }

    const imageUrl = URL.createObjectURL(file);

    preview.src = imageUrl;
    preview.classList.add("show");

    return true;
}

/* =========================
   Loading State
========================= */
function setLoading(isLoading) {
    if (isLoading) {
        saveFarmBtn.classList.add("loading");
        saveFarmBtn.disabled = true;
        saveFarmBtn.innerHTML = `<span class="spinner"></span>กำลังบันทึก...`;
    } else {
        saveFarmBtn.classList.remove("loading");
        saveFarmBtn.disabled = false;
        saveFarmBtn.innerHTML = "บันทึกข้อมูลฟาร์ม";
    }
}

/* =========================
   Submit Farm Setup
========================= */
farmSetupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const isFarmNameValid = validateFarmName();
    const isFarmPhoneValid = validateFarmPhone();
    const isFarmAddressValid = validateFarmAddress();
    const isFarmDescriptionValid = validateFarmDescription();

    if (
        !isFarmNameValid ||
        !isFarmPhoneValid ||
        !isFarmAddressValid ||
        !isFarmDescriptionValid
    ) {
        return;
    }

    setLoading(true);

    // ตอนนี้ยังเป็น Frontend Demo เพราะยังไม่พบ endpoint PHP สำหรับบันทึกข้อมูลฟาร์ม
    // TODO: เมื่อมี FARM_SETUP_ENDPOINT แล้ว ให้ส่ง new FormData(farmSetupForm) ด้วย fetch แบบ POST
    setTimeout(function () {
        setLoading(false);
        farmSuccessModal.classList.add("show");
    }, 1500);
});

/* =========================
   Skip Farm Setup
========================= */
skipFarmBtn.addEventListener("click", function () {
    window.location.href = DASHBOARD_URL;
});

/* =========================
   Go Dashboard
========================= */
goDashboardBtn.addEventListener("click", function () {
    window.location.href = DASHBOARD_URL;
});
