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
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser, clearError } from "@/redux/features/authSlice";
import { toast } from "sonner";

const formSchema = z
  .object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

type FormField = {
  name: keyof FormValues;
  label: string;
  icon: React.ReactNode;
  type?: string;
};

const formFields: FormField[] = [
  { name: "name", label: "Name", icon: <User /> },
  { name: "email", label: "Email", icon: <Mail />, type: "email" },
  { name: "password", label: "Password", icon: <Lock />, type: "password" },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    icon: <Lock />,
    type: "password",
  },
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      await dispatch(
        registerUser({
          name: values.name,
          email: values.email,
          password: values.password,
        })
      ).unwrap();

      toast.success("Đăng ký thành công!");
      form.reset();
      router.push("/auth/login");
    } catch (error) {
      const errorMessage =
        (error as { message: string }).message || "Đăng ký thất bại";
      toast.error(errorMessage);
    }
  };

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
            <h1 className="text-3xl font-bold text-center">Tạo tài khoản</h1>

            <Button
              type="button"
              className="w-full bg-white border border-black flex items-center justify-center gap-2 hover:bg-gray-100"
              onClick={() => {
                toast.info("Tính năng đang phát triển");
              }}
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
                width={20}
                height={20}
              />
              <span className="text-black">Sign in with Google</span>
            </Button>

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
                        <div className="relative ">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 scale-75">
                            {icon}
                          </span>
                          <Input
                            {...field}
                            type={
                              name.includes("password")
                                ? showPassword
                                  ? "text"
                                  : "password"
                                : type
                            }
                            placeholder={`Enter your ${label.toLowerCase()}`}
                            className="w-full pl-10 pr-8 py-2 border border-black rounded-md"
                            disabled={loading}
                          />
                          {name.includes("password") && (
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              onClick={togglePasswordVisibility}
                              disabled={loading}
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

                <Button
                  type="submit"
                  className="w-full text-white py-2 rounded-md hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang đăng ký...</span>
                    </div>
                  ) : (
                    "Đăng ký"
                  )}
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-gray-600">
              Bạn đã có tài khoản?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-black-600 hover:underline"
              >
                Đăng nhập ngay
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
};

export default Register;
