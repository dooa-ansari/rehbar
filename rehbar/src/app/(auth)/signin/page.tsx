"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useState } from "react";
import Card from "@/components/card";
import Lottie from "lottie-react";
import PeaceAnimation from "@/assets/animations/peace.json";
import { useTranslation } from "react-i18next";
import { useLogin } from "@/providers/apis/auth";
import { useRouter } from "next/navigation";
import { SignInUser, User } from "@/types/auth";

//how to protect this page
//in case of bigger forms use react hook form

interface FormState {
  [key: string]: { value: string; isValid: boolean };
}


const SignIn = () => {
  const { t } = useTranslation("signin");
  const router = useRouter();
  const { mutate: signin } = useLogin();
  const { t: tValidations } = useTranslation("validations");
  const [signInForm, setSignInForm] = useState<FormState>({
    email: { value: "", isValid: false },
    password: { value: "", isValid: false },
  });

  const isFormValid =
    Object.values(signInForm).every((field) => field.isValid);

  const handleValueChange = (name: string, value: string) => {
    setSignInForm((prev) => ({
      ...prev,
      [name]: { ...prev[name], value },
    }));
  };

  const handleValidationChange = (name: string, isValid: boolean) => {
    setSignInForm((prev) => ({
      ...prev,
      [name]: { ...prev[name], isValid },
    }));
  };

  const onClickSubmit = () => {
    
    const user: SignInUser = {
      email: signInForm.email.value,
      password: signInForm.password.value,
    };
    signin(user, {
      onSuccess: (data) => {
        //console.log(data)
        router.push("/skills_graph/list");
      },
      onError: () => {
        //toast.error(t("signup_error"));
      },
    });
  };

  return (
    <div className="background">
      <div className="grid md:grid-cols-2 w-full">
        <div>
          <Lottie animationData={PeaceAnimation} loop={true} autoplay={true} />
        </div>
        <div className="bg-secondary min-h-screen shadow-2xl container-padding">
          <h1 className="heading-margin">{t("signin")}</h1>
          <div className="items-center grid grid-cols-1 gap-4 [&>*:last-child]:mt-4">
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
            <Button
              disabled={!isFormValid}
              variant="primary"
              text={"signin"}
              onClick={onClickSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
