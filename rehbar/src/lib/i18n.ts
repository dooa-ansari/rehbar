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
    root_node: {
      designation: "Enter Designation"
    },
    child_node: {
      remove_node: "Remove Skill",
      remove_node_confirmation: "Are you sure you want to remove this skill?",
      yes: "Yes",
      no: "No"
    },
    skills_graph: {
      your_skills_graphs: "Your Skills Graphs",
      create_new: "Create New",
      create_skill: "Create Skill",
      title: "Title",
      status: "Status",
      slug: "Slug",
      created: "Created",
      actions: "Actions",
      edit: "Edit",
      view: "View",
      no_skills_graphs_found: "No skills graphs found",
      untitled: "Untitled",
      paused: "Paused",
      no_slug: "No slug",
      skills_graph_updated_successfully: "Skills graph updated successfully",
      skills_graph_created_successfully: "Skills graph created successfully",
      skills_graph_updated_error: "Skills graph updated error",
      skills_graph_created_error: "Skills graph created error",
      loading_skills_graph: "Loading skills graph",
    }
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    ns: ["common", "signup", "validations", "root_node", "skills_graph"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
