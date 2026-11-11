/* ==========================================================================
   CART AND ORDER - COMPLETE CLIENT JAVASCRIPT
   Clean, Fast & Future-Friendly
   ========================================================================== */
"use strict";



const CONFIG = {
  // 1. Deployed Google Apps Script Web App URL:
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyFHM5oTaWfDjSsNTSt5HePDtrmSZnFyqrCx-xyOHi2CrorKf_Iuk_bEAEHYiA4YWTk/exec",
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzPBEnMjpPHnwOgaem2RxfrSkr_ybVfBt5zMB32ddk0X3GTY4-PUWRGQgtas7fdNvfrQw/exec"
  // 2. Play Store / Direct App Download Link:
  // APP_DOWNLOAD_URL: "https://play.google.com/store/apps/details?id=com.cartandorder",

  // 3. Official Social Media URLs:
  SOCIAL: {
    linkedin: "https://www.linkedin.com/company/cart-and-order",
    facebook: "https://www.facebook.com/cartandorder",
    instagram: "https://www.instagram.com/cart_and_order?xtok=MXc2NXhkcmtyeHFmYg==",
    youtube: "https://www.youtube.com/@cartandorder"
  }
};

/* DOM Elements */
const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const contactForm = document.getElementById("contactForm");
const submitButton = document.getElementById("submitButton");
const submitText = document.getElementById("submitText");
const formMessage = document.getElementById("formMessage");
const inquiryField = document.getElementById("inquiry");
const charCount = document.getElementById("charCount");
const downloadBtn = document.getElementById("appDownloadBtn");

/* Navigation Scroll Effect */
function updateHeader() {
  if (!header) return;
  if (window.scrollY > 25) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* Mobile Navigation Menu */
if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* Inquiry Character Counter */
if (inquiryField && charCount) {
  inquiryField.addEventListener("input", () => {
    charCount.textContent = `${inquiryField.value.length}/500`;
  });
}

/* Form Helper & Validation */
function clearErrors() {
  document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
  document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
}

function showFieldError(field, message) {
  field.classList.add("invalid");
  const parent = field.closest(".form-group");
  if (!parent) return;
  const err = parent.querySelector(".error-message");
  if (err) err.textContent = message;
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

function validateContactForm() {
  clearErrors();
  let isValid = true;

  const fullName = document.getElementById("fullName");
  const contactInfo = document.getElementById("contactInfo");
  const inquiry = document.getElementById("inquiry");

  if (fullName.value.trim().length < 2) {
    showFieldError(fullName, "Please enter your full name.");
    isValid = false;
  }

  const contactVal = contactInfo.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9\s().-]{7,20}$/;

  if (!emailRegex.test(contactVal) && !phoneRegex.test(contactVal)) {
    showFieldError(contactInfo, "Enter a valid 10-digit phone number or email address.");
    isValid = false;
  }

  if (inquiry.value.trim().length < 10) {
    showFieldError(inquiry, "Please enter at least 10 characters.");
    isValid = false;
  }

  return isValid;
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showFormMessage("", "");

    if (!validateContactForm()) {
      showFormMessage("Please correct highlighted fields.", "error");
      return;
    }

    if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
      showFormMessage("Apps Script URL missing. Please add it in script.js.", "error");
      return;
    }

    submitButton.disabled = true;
    submitText.textContent = "Submitting...";

    const payload = {
      fullName: document.getElementById("fullName").value.trim(),
      contactInfo: document.getElementById("contactInfo").value.trim(),
      role: document.querySelector('input[name="role"]:checked').value,
      businessName: document.getElementById("businessName").value.trim(),
      inquiry: document.getElementById("inquiry").value.trim()
    };

    try {
      const urlParams = new URLSearchParams();
      Object.keys(payload).forEach(key => urlParams.append(key, payload[key]));

      await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlParams
      });

      showFormMessage("Thank you! Your inquiry has been submitted successfully.", "success");
      contactForm.reset();
      if (charCount) charCount.textContent = "0/500";
    } catch (err) {
      console.error("Submission failed:", err);
      showFormMessage("Unable to send inquiry right now. Please try again later.", "error");
    } finally {
      submitButton.disabled = false;
      submitText.textContent = "Submit Inquiry";
    }
  });
}

/* App Download Button Handler */
if (downloadBtn) {
  downloadBtn.addEventListener("click", (e) => {
    if (CONFIG.APP_DOWNLOAD_URL && CONFIG.APP_DOWNLOAD_URL.startsWith("http")) {
      e.preventDefault();
      window.open(CONFIG.APP_DOWNLOAD_URL, "_blank", "noopener,noreferrer");
    }
  });
}