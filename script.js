document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       Sticky Header
    ========================== */
    const header = document.getElementById("header");
    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("sticky", window.scrollY > 100);
        });
    }

    /* =========================
       Smooth Scrolling
    ========================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    /* =========================
       EmailJS Init
    ========================== */
    if (typeof emailjs !== "undefined") {
        emailjs.init("EMAILJS_PUBLIC_KEY"); // 🔴 ضع Public Key
    }

    /* =========================
       Contact Form Logic
    ========================== */
    const form = document.getElementById("contactForm");
    if (!form) return;

    const requestType = document.getElementById("requestType");
    const companyField = document.getElementById("companyField");
    const messageField = document.getElementById("message");

    /* ---------- Language ---------- */
    let currentLang = "en";

    const texts = {
        en: {
            validation: "Please fill in all required fields.",
            emailSuccess: "Message sent successfully ✅",
            emailFail: "Failed to send message ❌",
            companyMsg: "Tell us about your project or service needs",
            studentMsg: "Which course are you interested in?"
        },
        ar: {
            validation: "من فضلك املأ جميع الحقول المطلوبة",
            emailSuccess: "تم إرسال الرسالة بنجاح ✅",
            emailFail: "فشل إرسال الرسالة ❌",
            companyMsg: "احكي لنا عن مشروعك أو الخدمة المطلوبة",
            studentMsg: "ما هو الكورس الذي تهتم به؟"
        }
    };

    window.setLang = function (lang) {
        currentLang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    };

    /* ---------- Request Type Change ---------- */
    requestType.addEventListener("change", () => {
        if (requestType.value === "student") {
            companyField.classList.add("hidden");
            companyField.value = "";
            messageField.placeholder = texts[currentLang].studentMsg;
        } else if (requestType.value === "company") {
            companyField.classList.remove("hidden");
            messageField.placeholder = texts[currentLang].companyMsg;
        }
    });

    /* =========================
       Validation
    ========================== */
    function validateForm() {
        const name = form.querySelector("#name").value.trim();
        const email = form.querySelector("#email").value.trim();
        const phone = form.querySelector("#phone").value.trim();
        const message = messageField.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9+\-\s()]{6,20}$/;

        if (!requestType.value || !name || !email || !phone || !message) {
            alert(texts[currentLang].validation);
            return false;
        }

        if (!emailRegex.test(email)) {
            alert("Invalid email address");
            return false;
        }

        if (!phoneRegex.test(phone)) {
            alert("Invalid phone number");
            return false;
        }

        return true;
    }

    /* =========================
       EmailJS Submit
    ========================== */
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateForm()) return;

        const submitBtn = form.querySelector("button[type='submit']");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }

        emailjs.sendForm(
            "SERVICE_ID",   // 🔴 Service ID
            "TEMPLATE_ID",  // 🔴 Template ID
            form
        ).then(() => {
            alert(texts[currentLang].emailSuccess);
            form.reset();
        }).catch(err => {
            console.error(err);
            alert(texts[currentLang].emailFail);
        }).finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Send Message";
            }
        });
    });

    /* =========================
       WhatsApp
    ========================== */
    window.sendWhatsApp = function () {
        if (!validateForm()) return;

        const name = form.querySelector("#name").value;
        const company = companyField.value;
        const email = form.querySelector("#email").value;
        const phone = form.querySelector("#phone").value;
        const message = messageField.value;

        const text =
            requestType.value === "company"
                ? `Company Inquiry\n\nName: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\n\nDetails:\n${message}`
                : `Student Course Inquiry\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nInterest:\n${message}`;

        const whatsappNumber = "201064661217"; // 🔴 رقم واتساب
        window.open(
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
            "_blank"
        );
    };

    /* =========================
       Scroll Animations
    ========================== */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll("section").forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition = "all 0.6s ease";
        observer.observe(section);
    });

});
// Video & Sound Button
const video = document.getElementById("heroVideo");
const soundBtn = document.getElementById("soundToggle");

let soundEnabled = false;

// أول ضغطة في أي مكان تشغل الصوت
function enableSound() {
    if (!soundEnabled) {
        video.muted = false;
        video.volume = 1;
        soundEnabled = true;
        soundBtn.textContent = "🔊";
    }
}

// استماع لأول click على الصفحة
document.addEventListener("click", enableSound, { once: true });

// زر كتم / تشغيل الصوت
soundBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // يمنع أول click من التفعيل
    video.muted = !video.muted;
    soundBtn.textContent = video.muted ? "🔇" : "🔊";
});


