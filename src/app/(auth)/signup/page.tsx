"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useState } from "react";
import Card from "@/components/card";
import Lottie from "lottie-react";
import PeaceAnimation from '@/assets/animations/peace.json';

const SignUp = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center bg-primary">
      <div className="grid md:grid-cols-2 w-full">
        <div>
          <Lottie
            animationData={PeaceAnimation}
            loop={true}
            autoplay={true}
          />
        </div>
        <div className="items-center bg-secondary min-h-screen shadow-2xl container-padding">
          <h1 className="heading-margin">Sign Up</h1>
          <div className="items-center">
            <Input
              name="user-name"
              placeHolder="user-name"
              onChange={setUserName}
            />
            <Input name="email" placeHolder="email" onChange={setEmail} />
            <Input
              name="password"
              placeHolder="password"
              onChange={setPassword}
            />
            <Button variant="primary" text="Signup" onClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
