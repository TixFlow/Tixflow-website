"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import React, { useState } from "react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "@/components/auth/AuthLayout";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";

import { toast } from "react-hot-toast";
import api from "@/config/axios";
import TicketLoading from "@/components/loading/loading";

const formSchema = z
  .object({
    firstName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    lastName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    confirmPassword: z.string(),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Vui lòng chọn giới tính",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "firstName", label: "Tên", icon: <User /> },
  { name: "lastName", label: "Họ", icon: <User /> },
  { name: "email", label: "Email", icon: <Mail />, type: "email" },
  { name: "password", label: "Mật khẩu", icon: <Lock />, type: "password" },
  {
    name: "confirmPassword",
    label: "Nhập lại mật khẩu",
    icon: <Lock />,
    type: "password",
  },
];

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "male",
    },
  });

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        gender: data.gender,
      };

      const res = await api.post("/auth/register", payload);

      if (res.data.status === 200 || res.data.status === 201) {
        toast.success(res.data.message || "Đăng ký thành công!");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        toast.error(res.data.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-center">Tạo tài khoản</h1>
            {loading ? (
              <TicketLoading />
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {formFields.map(({ name, label, icon, type = "text" }) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as keyof FormValues}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 scale-75">
                              {icon}
                            </span>
                            <Input
                              {...field}
                              type={
                                name === "password" ||
                                name === "confirmPassword"
                                  ? passwordVisibility[
                                      name as "password" | "confirmPassword"
                                    ]
                                    ? "text"
                                    : type
                                  : type
                              }
                              placeholder={`Nhập ${label.toLowerCase()} của bạn`}
                              className="w-full pl-10 pr-8 py-2 border border-black rounded-md"
                              disabled={loading}
                            />
                            {(name === "password" ||
                              name === "confirmPassword") && (
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                onClick={() =>
                                  togglePasswordVisibility(
                                    name as "password" | "confirmPassword"
                                  )
                                }
                                disabled={loading}
                              >
                                {passwordVisibility[
                                  name as "password" | "confirmPassword"
                                ] ? (
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

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giới tính</FormLabel>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center gap-2">
                            <RadioGroupItem value="male" id="male" />
                            <FormLabel
                              htmlFor="male"
                              className="text-sm font-normal"
                            >
                              Nam
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <RadioGroupItem value="female" id="female" />
                            <FormLabel
                              htmlFor="female"
                              className="text-sm font-normal"
                            >
                              Nữ
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <RadioGroupItem value="other" id="other" />
                            <FormLabel
                              htmlFor="other"
                              className="text-sm font-normal"
                            >
                              Khác
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
            )}

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
