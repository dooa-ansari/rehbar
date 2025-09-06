"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    common: {
      welcome: "Welcome to our website",
      about: "About us",
    },
    validations: {
      required: "This field is required.",
      email_pattern: "Please enter a valid email.",
      password_min_length: "The password length should be 8 characters or more",
      passwords_match_error: "Passwords do not match",
    },
    signup: {
      signup: "Sign Up",
      username: "Username",
      password: "Password",
      email: "Email",
      repeat_password: "Repeat Password",
      invite_code: "Invite Code",
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    ns: ["common", "signup", "validations"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
