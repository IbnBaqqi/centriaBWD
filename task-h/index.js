// index.js
// Author: Abdulbaki Salaudeen
// Date: 2025-11-06
// Handles form validation and appending registration rows to the table

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const table = document.getElementById("registrationTable");
  const tableBody = table.querySelector("tbody");
  const timestamp = document.getElementById("timestamp");
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const birthDate = document.getElementById("birthDate");
  const terms = document.getElementById("terms");

  const errors = {
    name: document.getElementById("errorName"),
    email: document.getElementById("errorEmail"),
    phone: document.getElementById("errorPhone"),
    birth: document.getElementById("errorBirth"),
    terms: document.getElementById("errorTerms")
  };

  function clearErrors() {
    Object.values(errors).forEach(errorEl => errorEl.textContent = '');
  }

  function validate() {
    clearErrors();
    let isValid = true;

    // Full name validation
    const name = fullName.value.trim();
    if (!name) {
      errors.name.textContent = "Full name is required.";
      isValid = false;
    } else {
      const words = name.split(/\s+/).filter(word => word.length > 0);
      if (words.length < 2) {
        errors.name.textContent = "Enter your full name (first and last).";
        isValid = false;
      } else if (words.some(word => word.length < 2)) {
        errors.name.textContent = "Each part of the name must be at least 2 characters long.";
        isValid = false;
      }
    }

    // Email validation
    const emailVal = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      errors.email.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // Phone validation (Finnish: +358 + 10 digits)
    const phoneVal = phone.value.trim();
    const cleanPhone = phoneVal.replace(/[\s\-]/g, '');
    if (!phoneVal || !cleanPhone.startsWith('+358') || cleanPhone.length !== 13) {
      errors.phone.textContent = "Please enter a valid Finnish phone number, e.g., +358 40 123 4567.";
      isValid = false;
    }

    // Birth date validation
    const birthVal = birthDate.value;
    if (!birthVal) {
      errors.birth.textContent = "Birth date is required.";
      isValid = false;
    } else {
      const birth = new Date(birthVal + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      birth.setHours(0, 0, 0, 0);

      if (birth > today) {
        errors.birth.textContent = "Birth date cannot be in the future.";
        isValid = false;
      } else {
        // Calculate age
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        if (age < 13) {
          errors.birth.textContent = "You must be at least 13 years old.";
          isValid = false;
        }
      }
    }

    // Terms validation
    if (!terms.checked) {
      errors.terms.textContent = "You must accept the terms and conditions to submit.";
      isValid = false;
    }

    return isValid;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    timestamp.value = new Date().toLocaleString();

    if (!validate()) {
      return;
    }

    // Create and append new row
    const row = document.createElement("tr");
    const data = [
      timestamp.value,
      fullName.value.trim(),
      email.value.trim(),
      phone.value.trim(),
      birthDate.value,
      "Accepted"
    ];
    data.forEach(text => {
      const td = document.createElement("td");
      td.textContent = text;
      row.appendChild(td);
    });
    tableBody.appendChild(row);

    // Reset form
    form.reset();
    timestamp.value = '';
    fullName.focus();
  });

  form.addEventListener("reset", () => {
    clearErrors();
    timestamp.value = '';
    fullName.focus();
  });
});