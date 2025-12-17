document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       Sticky Header
    ========================== */
    const header = document.getElementById("header");
    if (header) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 100) {
                header.classList.add("sticky");
            } else {
                header.classList.remove("sticky");
            }
        });
    }

    /* =========================
       Smooth Scrolling
    ========================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            const target = document.querySelector(targetId);

            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    /* =========================
       EmailJS Init
    ========================== */
    if (typeof emailjs !== "undefined") {
        emailjs.init("A3W2uS1mSnH0qyBhK");
    }

    /* =========================
       Contact Form
    ========================== */
    const form = document.getElementById("contactForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = form.querySelector('[name="name"]').value.trim();
            const company = form.querySelector('[name="company"]').value.trim();
            const email = form.querySelector('[name="email"]').value.trim();
            const phone = form.querySelector('[name="phone"]').value.trim();
            const message = form.querySelector('[name="message"]').value.trim();

            // Validation
            if (!name || !email || !message) {
                alert("Please fill in required fields.");
                return;
            }

            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Invalid email address.");
                return;
            }

            const phoneRegex = /^[0-9+\\-\\s()]{6,20}$/;
            if (phone && !phoneRegex.test(phone)) {
                alert("Invalid phone number.");
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            emailjs.sendForm(
                "service_vo2bik7",
                "template_fjeesss",
                form
            ).then(() => {
                alert("Message sent successfully ✅");
                form.reset();
            }).catch(err => {
                alert("Failed to send message ❌");
                console.error(err);
            }).finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = "Send Message";
            });
        });
    }

    /* =========================
       WhatsApp Click to Chat
    ========================== */
    window.openWhatsApp = function () {
        if (!form) return;

        const name = form.querySelector('[name="name"]').value.trim();
        const company = form.querySelector('[name="company"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const phone = form.querySelector('[name="phone"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();

        if (!name || !email || !message) {
            alert("Please fill required fields first.");
            return;
        }

        const text = encodeURIComponent(
`New Contact Message
Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}
------------------
Message:
${message}`
        );

        window.open(`https://wa.me/201064661217?text=${text}`, "_blank");
    };

    /* =========================
       Scroll Animation
    ========================== */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll("section").forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition = "all 0.6s ease";
        observer.observe(section);
    });

});
