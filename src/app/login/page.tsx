"use client";

import AuthLayout from "@/components/AuthLayout";
import GradientButton from "@/components/ui/ButtonComponent";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  function onSubmit(values: any) {
    console.log("Dữ liệu form:", values);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <AuthLayout>
      <Link
        href="/"
        className="absolute top-5 left-5 flex items-center space-x-2 text-white font-semibold hover:underline"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      <div className="flex w-full">
        <div className="w-full lg:w-1/2 flex justify-center items-center p-10">
          <div className="max-w-md w-full space-y-6">
            <h1 className="text-3xl font-bold text-center">Sign In</h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Nhập email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-8 py-2 border rounded-md"
                        />
                        {email && (
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setEmail("")}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          className="w-full pl-10 pr-8 py-2 border rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-black-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <GradientButton className="w-full text-white py-2 rounded-md hover:bg-blue-700 transition">
                  <span>{loading ? "Đang đăng nhập..." : "Login"}</span>
                </GradientButton>

                <Button
                  type="button"
                  className="w-full bg-white border border-black text-gray-700 flex items-center justify-center gap-2  hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200"
                >
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  <span>Sign in with Google</span>
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-black-600 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-end justify-center bg-gray-100 rounded-r-2xl">
          <Image
            src="/cover.png"
            alt="Login Illustration"
            width={500}
            height={500}
            priority
            className="object-cover max-w-full h-auto rounded-r-2xl"
          />
        </div>
      </div>
    </AuthLayout>
  );
}
