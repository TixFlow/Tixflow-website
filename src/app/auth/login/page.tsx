"use client";

import AuthLayout from "@/components/auth/AuthLayout";
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

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { loginUser } from "@/redux/authSlice";
import toast from "react-hot-toast";
import TicketLoading from "@/components/loading/loading";
import coverImage from "@/assets/cover.png";

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "email", label: "Email", icon: <Mail />, type: "email" },
  { name: "password", label: "Mật khẩu", icon: <Lock />, type: "password" },
] as const;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const dispatch = useAppDispatch();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const togglePasswordVisibility = useCallback(() => {
    try {
      setShowPassword((prev) => !prev);
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái hiển thị mật khẩu:", error);
    }
  }, []);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setLoading(true);
      try {
        const resultAction = await dispatch(loginUser(values));

        if (loginUser.fulfilled.match(resultAction)) {
          const { accessToken, user } = resultAction.payload;

          if (accessToken && user) {
            toast.success("Đăng nhập thành công!");
            router.push("/");
            form.reset();
          } else {
            toast.error("Thiếu thông tin đăng nhập. Vui lòng thử lại.");
          }
        } else {
          toast.error("Email hoặc mật khẩu không đúng!");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi đăng nhập.");
      } finally {
        setLoading(false);
      }
    },
    [dispatch, form, router]
  );

  return (
    <AuthLayout>
      <Link
        href="/"
        className="absolute top-5 left-5 flex items-center text-white font-semibold hover:underline"
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
                {formFields.map(({ name, label, icon, type }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
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
                            className="w-full pl-10 pr-8 py-2 border rounded-md focus:ring-2 focus:ring-black"
                          />
                          {name === "password" && (
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                      className="w-4 h-4 border border-gray-400 rounded focus:ring-2 focus:ring-black"
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
                  className="w-full bg-gradient-to-r from-[#FDB777] to-[#FD9346] text-white py-2 rounded-md transition-all duration-300 hover:brightness-110"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Tiếp tục"
                  )}
                </Button>

                <Button
                  type="button"
                  className="w-full bg-white border border-black text-gray-700 flex items-center gap-2 hover:bg-gray-100"
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

        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-gray-100 rounded-r-2xl relative overflow-hidden">
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
              imageLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <TicketLoading />
          </div>

          <Image
            src={coverImage}
            alt="Login Illustration"
            width={500}
            height={500}
            priority
            loading="eager"
            onLoad={() => setImageLoaded(true)}
            className={`object-cover rounded-r-2xl transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </AuthLayout>
  );
}
