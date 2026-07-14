// =========================
// Global Reveal Animation
// =========================
(function () {
    const revealSelectors = [
        ".login-card",
        ".dashboard-shell",
        ".dashboard-card",
        ".market-card",
        ".profile-card",
        ".otp-card",
        ".reset-card",
        ".forgotpw-container",
        ".upload-box",
        ".farm-success-box",
        ".success-box",
        ".policy-box",
        ".modal-box"
    ];

    const staggerSelectors = [
        "form > div",
        ".password-rules > *",
        ".terms-row",
        ".farm-action-row > *",
        ".upload-section > *",
        ".dashboard-grid > *",
        ".dashboard-actions > *"
    ];

    function addClassIfMissing(element, className) {
        if (!element || element.classList.contains("reveal") || element.classList.contains("reveal-left") || element.classList.contains("reveal-right") || element.classList.contains("reveal-scale")) {
            return;
        }
        element.classList.add(className);
    }

    function prepareRevealTargets() {
        revealSelectors.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (element) {
                addClassIfMissing(element, "reveal-scale");
            });
        });

        document.querySelectorAll("main h1, main h2, main > p, .login-card > h1, .login-card > p, .dashboard-title, .dashboard-copy").forEach(function (element) {
            addClassIfMissing(element, "reveal");
        });

        staggerSelectors.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (element, index) {
                addClassIfMissing(element, "reveal");
                element.classList.add("stagger-item");
                element.style.setProperty("--stagger-index", String(index % 8));
            });
        });
    }

    function observeRevealTargets() {
        const targets = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");

        if (!("IntersectionObserver" in window)) {
            targets.forEach(function (target) {
                target.classList.add("show");
            });
            return;
        }

        const observer = new IntersectionObserver(function (entries, instance) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    instance.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.14,
            rootMargin: "0px 0px -48px 0px"
        });

        targets.forEach(function (target) {
            observer.observe(target);
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        prepareRevealTargets();
        observeRevealTargets();
    });
})();