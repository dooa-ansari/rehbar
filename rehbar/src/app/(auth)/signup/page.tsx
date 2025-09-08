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
//in case of bigger forms use react hook form

interface FormState {
  [key: string]: { value: string; isValid: boolean };
}

const SignUp = () => {
  const { t } = useTranslation("signup");
  const { t: tValidations } = useTranslation("validations");
  const [signUpForm, setSignupForm] = useState<FormState>({
    email: { value: "", isValid: false },
    username: { value: "", isValid: false },
    password: { value: "", isValid: false },
    repeat_password: { value: "", isValid: false },
    invite_code: { value: "", isValid: false },
  });

  const isPasswordMatch = () => {
    if (
      signUpForm.password.value.length > 0 &&
      signUpForm.repeat_password.value.length > 0
    ) {
      return signUpForm.password.value === signUpForm.repeat_password.value;
    }
  };

  const isFormValid =
    isPasswordMatch() &&
    Object.values(signUpForm).every((field) => field.isValid);

  const handleValueChange = (name: string, value: string) => {
    setSignupForm((prev) => ({
      ...prev,
      [name]: { ...prev[name], value },
    }));
  };

  const handleValidationChange = (name: string, isValid: boolean) => {
    setSignupForm((prev) => ({
      ...prev,
      [name]: { ...prev[name], isValid },
    }));
  };

  const onClickSubmit = () => {};

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
              name="username"
              placeHolder={t("username")}
              onChange={(val) => handleValueChange("username", val)}
              onValidationChange={(isValid) =>
                handleValidationChange("username", isValid)
              }
              required
            />
            <Input
              name="email"
              placeHolder={t("email")}
              onChange={(val) => handleValueChange("email", val)}
              onValidationChange={(isValid) =>
                handleValidationChange("email", isValid)
              }
              required
              type="email"
            />
            <Input
              type="password"
              name="password"
              placeHolder={t("password")}
              onChange={(val) => handleValueChange("password", val)}
              onValidationChange={(isValid) =>
                handleValidationChange("password", isValid)
              }
              required
            />
            <Input
              type="password"
              name="repeat_password"
              placeHolder={t("repeat_password")}
              onChange={(val) => handleValueChange("repeat_password", val)}
              onValidationChange={(isValid) =>
                handleValidationChange("repeat_password", isValid)
              }
              required
            />
            <Input
              name="invite_code"
              placeHolder={t("invite_code")}
              onChange={(val) => handleValueChange("invite_code", val)}
              required
              onValidationChange={(isValid) =>
                handleValidationChange("invite_code", isValid)
              }
            />
            {!isPasswordMatch() && (
              <p className="validation-error">
                {tValidations("passwords_match_error")}
              </p>
            )}
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
