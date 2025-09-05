"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useState } from "react";
import Card from "@/components/card";
import Lottie from "lottie-react";
import PeaceAnimation from "@/assets/animations/peace.json";
import { useTranslation } from "react-i18next";
import { Space } from "lucide-react";

//how to protect this page

interface FormState {
  [key: string]: { value: string; isValid: boolean };
}

const SignUp = () => {
  const { t } = useTranslation("signup");
  const [signUpForm, setSignupForm] = useState<FormState>({
    email: { value: "", isValid: false },
    username: { value: "", isValid: false },
    password: { value: "", isValid: false },
    repeat_password: { value: "", isValid: false },
    invite_code: { value: "", isValid: false },
  });

  const isFormValid = Object.values(signUpForm).every((field) => field.isValid);

  const handleChange = (name: string, value: string, isValid: boolean) => {
    setSignupForm((prev) => ({
      ...prev,
      [name]: { value, isValid },
    }));
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center bg-primary">
      <div className="grid md:grid-cols-2 w-full">
        <div>
          <Lottie animationData={PeaceAnimation} loop={true} autoplay={true} />
        </div>
        <div className="bg-secondary min-h-screen shadow-2xl container-padding">
          <h1 className="heading-margin">{t("signup")}</h1>
          <div className="items-center grid grid-cols-1 gap-4 [&>*:last-child]:mt-4">
            <Input
              name="user-name"
              placeHolder={t("username")}
              onChange={(val) =>
                handleChange("username", val, signUpForm.email.isValid)
              }
              required
            />
            <Input
              name="email"
              placeHolder="email"
              onChange={(val) =>
                handleChange("email", val, signUpForm.email.isValid)
              }
              onValidationChange={(isValid) =>
                handleChange("email", signUpForm.email.value, isValid)
              }
              required
              type="email"
            />
            <Input
              name="password"
              placeHolder={t("password")}
              onChange={(val) =>
                handleChange("password", val, signUpForm.email.isValid)
              }
              onValidationChange={(isValid) =>
                handleChange("password", signUpForm.email.value, isValid)
              }
              required
            />
            <Input
              name="password"
              placeHolder={t("repeat_password")}
              onChange={(val) =>
                handleChange("repeat_password", val, signUpForm.email.isValid)
              }
              onValidationChange={(isValid) =>
                handleChange("repeat_password", signUpForm.email.value, isValid)
              }
              required
            />
            <Input
              name="invite_code"
              placeHolder={t("invite_code")}
              onChange={(val) =>
                handleChange("invite_code", val, signUpForm.email.isValid)
              }
              required
              onValidationChange={(isValid) =>
                handleChange("invite_code", signUpForm.email.value, isValid)
              }
            />
            <Button
              disabled={!isFormValid}
              variant="primary"
              text={"signup"}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
