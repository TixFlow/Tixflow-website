"use client";

import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

type FormValues = z.infer<typeof formSchema>;

type FormField = {
  name: keyof FormValues;
  label: string;
  icon: React.ReactNode;
  type?: string;
};

const formFields: FormField[] = [
  { name: "email", label: "Email", icon: <Mail />, type: "email" },
  { name: "password", label: "Mật khẩu", icon: <Lock />, type: "password" },
];

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đăng nhập thất bại!");
      }

      const data = await response.json();
      Cookies.set("token", data.token, { expires: 7, secure: true });
      router.push("/");
      console.log("Đăng nhập thành công!", data);
      form.reset();
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Link
        href="/"
        className="absolute top-5 left-5 flex items-center space-x-2 text-white font-semibold hover:underline"
      >
        <ArrowLeft size={20} />
        <span>Về trang chủ</span>
      </Link>

      <div className="flex w-full">
        <div className="w-full lg:w-1/2 flex justify-center items-center p-10">
          <div className="max-w-md w-full space-y-6">
            <h1 className="text-3xl font-bold text-center">Đăng nhập</h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {formFields.map(({ name, label, icon, type = "text" }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center text-gray-500 w-4 h-4">
                            {icon}
                          </span>
                          <Input
                            {...field}
                            type={
                              name === "password"
                                ? showPassword
                                  ? "text"
                                  : "password"
                                : type
                            }
                            placeholder={`Nhập ${label.toLowerCase()}`}
                            className="w-full pl-10 pr-8 py-2 border border-black rounded-md"
                          />
                          {name === "password" && (
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 appearance-none border border-gray-400 rounded-full flex items-center justify-center checked:before:content-[''] checked:before:block checked:before:w-2 checked:before:h-2 checked:before:bg-black checked:before:rounded-full focus:ring-2 focus:ring-black-500"
                    />
                    <span>Nhớ mật khẩu</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-black-600 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <Button
                  className="w-full text-white py-2 rounded-md bg-gradient-to-r from-[#FDB777] to-[#FD9346] hover:from-[#FF7F50] hover:to-[#FF6200] transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Tiếp tục"
                  )}
                </Button>

                <Button
                  type="button"
                  className="w-full bg-white border border-black text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200"
                >
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  <span>Đăng nhập với Google</span>
                </Button>
              </form>
            </Form>
            <p className="text-center text-sm text-gray-600">
              Bạn chưa có tài khoản?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-black-600 hover:underline"
              >
                Tạo tài khoản ngay
              </Link>
            </p>
          </div>
        </div>
        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-gray-100 rounded-r-2xl">
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
