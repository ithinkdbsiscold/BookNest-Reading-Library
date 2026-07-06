const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        document.body.classList.toggle("menu-open", isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            document.body.classList.remove("menu-open");
        });
    });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    const dotsWrap = carousel.querySelector("[data-carousel-dots]");
    const delay = Number(carousel.dataset.autoplay || 0);
    let index = 0;
    let timer;

    if (!track || slides.length === 0) return;

    const dots = slides.map((_, dotIndex) => {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", `Show photo ${dotIndex + 1}`);
        button.addEventListener("click", () => {
            setSlide(dotIndex);
            restart();
        });
        dotsWrap?.appendChild(button);
        return button;
    });

    const setSlide = (nextIndex) => {
        index = (nextIndex + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === index);
        });
    };

    const restart = () => {
        if (!delay) return;
        window.clearInterval(timer);
        timer = window.setInterval(() => setSlide(index + 1), delay);
    };

    prev?.addEventListener("click", () => {
        setSlide(index - 1);
        restart();
    });

    next?.addEventListener("click", () => {
        setSlide(index + 1);
        restart();
    });

    setSlide(0);
    restart();
});

const enquiryForm = document.querySelector("[data-enquiry-form]");

if (enquiryForm) {
    const planSelect = enquiryForm.querySelector("[data-plan-select]");
    const standardSlot = enquiryForm.querySelector("[data-standard-slot]");
    const startTimeInput = enquiryForm.querySelector("[data-start-time]");
    const slotPreview = enquiryForm.querySelector("[data-slot-preview]");
    const formStatus = enquiryForm.querySelector("[data-form-status]");

    const plans = {
        standard: "Standard - 6 hours daily - Rs. 800/month",
        "standard-plus": "Standard Plus - 8 hours daily - Rs. 1,000/month",
        extended: "Extended - 12 hours daily - Rs. 1,500/month",
        executive: "Executive - 24-hour access - Rs. 1,800/month",
        premium: "Premium - 24-hour access + locker - Rs. 2,000/month",
    };

    const formatTime = (totalMinutes) => {
        const dayMinutes = ((totalMinutes % 1440) + 1440) % 1440;
        const hour24 = Math.floor(dayMinutes / 60);
        const minutes = dayMinutes % 60;
        const suffix = hour24 >= 12 ? "PM" : "AM";
        const hour12 = hour24 % 12 || 12;
        return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
    };

    const getSlotRange = (duration = 360) => {
        if (!startTimeInput.value) return "";
        const [hours, minutes] = startTimeInput.value.split(":").map(Number);
        const start = hours * 60 + minutes;
        return `${formatTime(start)} to ${formatTime(start + duration)}`;
    };

    const updateSlotState = () => {
        const isStandard = planSelect.value === "standard";
        const isStandardPlus = planSelect.value === "standard-plus";
        const isExtended = planSelect.value === "extended";
        const showSlot = isStandard || isStandardPlus || isExtended;
        const slotHours = isExtended ? 12 : (isStandardPlus ? 8 : 6);
        standardSlot.hidden = !showSlot;
        slotPreview.hidden = !showSlot;
        startTimeInput.required = showSlot;

        if (!showSlot) {
            startTimeInput.value = "";
            slotPreview.querySelector("span").textContent = `Your ${slotHours}-hour slot will appear here.`;
            return;
        }

        const range = getSlotRange(slotHours * 60);
        const planName = isExtended ? "Extended" : (isStandardPlus ? "Standard Plus" : "Standard");
        slotPreview.querySelector("span").textContent = range
            ? `Your ${planName} plan slot: ${range}`
            : `Select a start time and we will calculate the ${slotHours}-hour slot.`;
    };

    const requestedPlan = new URLSearchParams(window.location.search).get("plan");
    if (requestedPlan && plans[requestedPlan]) {
        planSelect.value = requestedPlan;
    }

    updateSlotState();
    planSelect.addEventListener("change", updateSlotState);
    startTimeInput.addEventListener("input", updateSlotState);

    enquiryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!enquiryForm.reportValidity()) return;

        const formData = new FormData(enquiryForm);
        const name = String(formData.get("name")).trim();
        const phone = String(formData.get("phone")).trim();
        const plan = String(formData.get("plan"));
        const isStandard = plan === "standard";
        const isStandardPlus = plan === "standard-plus";
        const isExtended = plan === "extended";
        const slotRange = (isStandard || isStandardPlus || isExtended) ? getSlotRange(isExtended ? 720 : (isStandardPlus ? 480 : 360)) : "";

        const messageLines = [
            "New BookNest enquiry",
            "",
            `Name: ${name}`,
            `Phone: ${phone}`,
            `Plan: ${plans[plan]}`,
        ];

        if (slotRange) {
            messageLines.push(`Preferred time slot: ${slotRange}`);
        }

        messageLines.push("", "Please contact me with the next steps.");

        const whatsappUrl = `https://api.whatsapp.com/send?phone=916352486412&text=${encodeURIComponent(messageLines.join("\n"))}`;
        formStatus.textContent = "Opening WhatsApp with your enquiry details...";
        window.open(whatsappUrl, "_blank", "noopener");
    });
}
