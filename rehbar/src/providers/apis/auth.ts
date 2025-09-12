import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../axios_client";
import { SignInUser, User } from "@/types/auth";
import { EndPoint } from "../endpoints";
import { getSession, signIn } from "next-auth/react";

const useSignup = () => {
    return useMutation({
        mutationKey: [EndPoint.auth.key],
        mutationFn: async (user: User) => {
            return apiClient.post(`${EndPoint.auth.url}/signup`, user);
        },
    });
};

export const useLogin = () => {
    return useMutation({
      mutationKey: [EndPoint.auth.key],
      mutationFn: async (user: SignInUser) => {
        const result = await signIn("credentials", {
          email: user.email,
          password: user.password,
          redirect: false,
        });
  
        if (result?.error) {
          throw new Error(result.error);
        }
  
        const session = await getSession();
  
        return { result, session };
      },
    });
  };

export default useSignup;