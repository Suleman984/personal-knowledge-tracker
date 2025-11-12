"use client";

import { useForm } from "react-hook-form";
import api from "@/lib/api";
import Input from "../ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/authSlice";

type AuthFormProps = {
  mode: "login" | "signup";
};

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>();
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

const onSubmit = async (data: AuthFormData) => {
  try {
    if (mode === "signup") {
      const res = await api.post("/users/signup", data);
      // show success message then redirect to login
      if (res.status >= 200 && res.status < 300) {
        setError("Registered successfully. Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(res.data?.error || "Registration failed");
      }
      return;
    } else {
      const res = await api.post("/users/login", data, { withCredentials: true });
      const user = res.data.user;

      // update user in store
      dispatch(loginSuccess(user));

//fetch token and send to extension
            const token = res.data.token; // assuming backend returns token in response
            if (token && (window as any).chrome?.runtime && process.env.NEXT_PUBLIC_EXTENSION_ID) {
              (window as any).chrome.runtime.sendMessage(
                process.env.NEXT_PUBLIC_EXTENSION_ID,
                { type: "SET_TOKEN", token },
                (response: any) => {
                  console.log("✅ Token sent to extension:", response);
                }
              );
            }

      //  Navigate to dashboard
      router.push("/dashboard");
    }
  } catch (err: any) {
    console.error("Auth error:", err);
    setError(err.response?.data?.error || "Something went wrong");
  }
};


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
    >
      <h1 className="text-2xl font-semibold mb-6 text-center capitalize">{mode}</h1>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {mode === "signup" && (
        <Input
          label="Name"
          {...register("name", { required: "Name is required" })}
          error={errors.name?.message}
        />
      )}

      <Input
        label="Email"
        type="email"
        {...register("email", { required: "Email is required" })}
        error={errors.email?.message}
      />

      <Input
        label="Password"
        type="password"
        {...register("password", { required: "Password is required", minLength: 6 })}
        error={errors.password?.message}
      />

      <button
        type="submit"
        className="bg-black text-white w-full p-2 rounded hover:bg-gray-800"
      >
        {mode === "signup" ? "Sign Up" : "Login"}
      </button>

      <p className="text-center text-sm mt-4">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </>
        )}
      </p>
    </form>
  );
}
