"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/config/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  status: string;
  reputation: string;
  createdAt: string;
  avatar: string;
};

// Thêm component trang trí
const TicketDecoration = () => (
  <div className="absolute right-4 top-4 opacity-20">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-8 h-8 text-white"
    >
      <path d="M2 9V5c0-1.1.9-2 2-2h3L12 7l5-4h3c1.1 0 2 .9 2 2v4M2 9l10 7 10-7M2 9v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9" />
    </svg>
  </div>
);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        setUser(storedUser);
        setEditedUser(storedUser);
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Lỗi khi tải thông tin người dùng");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: keyof User, value: string) => {
    setEditedUser((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleEditProfile = async () => {
    if (!user?.id || !editedUser) return;

    try {
      setLoading(true);
      if (isEditing && JSON.stringify(user) !== JSON.stringify(editedUser)) {
        setUser(editedUser);
        localStorage.setItem("user", JSON.stringify(editedUser));
        toast.success("Cập nhật thông tin thành công");
      }
      setIsEditing(!isEditing);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Cập nhật thông tin thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      await api.delete(`/api/users/${user.id}`);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Xóa tài khoản thành công");
      router.push("/login");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Xóa tài khoản thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-lg py-0 mb-8 overflow-hidden">
        <div className="relative h-40 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <TicketDecoration />
          <div className="absolute -bottom-16 left-8">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={user?.avatar} alt="avatar" />
              <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardHeader className="pt-20 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {user?.firstName} {user?.lastName}
            </CardTitle>
            <p className="text-gray-500 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              {user?.email}
            </p>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6 w-full justify-start border-b bg-white p-1 rounded-lg shadow-sm">
          <TabsTrigger
            value="info"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-md transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-md transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            Lịch sử giao dịch
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="backdrop-blur-sm bg-white/80">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Thông tin cơ bản
                    </h3>
                  </div>
                  <EditableInfoItem
                    label="Họ"
                    value={editedUser?.lastName}
                    isEditing={isEditing}
                    onChange={(val) => handleInputChange("lastName", val)}
                  />
                  <EditableInfoItem
                    label="Tên"
                    value={editedUser?.firstName}
                    isEditing={isEditing}
                    onChange={(val) => handleInputChange("firstName", val)}
                  />
                  <EditableInfoItem
                    label="Email"
                    value={editedUser?.email}
                    isEditing={false}
                  />
                  <EditableInfoItem
                    label="Giới tính"
                    value={editedUser?.gender}
                    isEditing={isEditing}
                    onChange={(val) => handleInputChange("gender", val)}
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-pink-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Thông tin liên hệ
                    </h3>
                  </div>
                  <EditableInfoItem
                    label="Số điện thoại"
                    value={editedUser?.phone}
                    isEditing={isEditing}
                    onChange={(val) => handleInputChange("phone", val)}
                  />
                  <EditableInfoItem
                    label="Địa chỉ"
                    value={editedUser?.address}
                    isEditing={isEditing}
                    onChange={(val) => handleInputChange("address", val)}
                  />
                  <EditableInfoItem
                    label="Trạng thái"
                    value={editedUser?.status}
                    isEditing={false}
                  />
                  <EditableInfoItem
                    label="Reputation"
                    value={editedUser?.reputation}
                    isEditing={false}
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Tham gia từ:{" "}
                  {new Date(editedUser?.createdAt || "").toLocaleDateString()}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleEditProfile}
                    disabled={loading}
                    className={`px-6 py-2 rounded-full transition-all duration-200 ${
                      isEditing
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : "bg-gradient-to-r from-purple-500 to-pink-500"
                    } text-white hover:shadow-lg disabled:opacity-50`}
                  >
                    {isEditing ? "Lưu thay đổi" : "Chỉnh sửa"}
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="px-6 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg transition-all duration-200">
                        Xóa tài khoản
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white p-6 rounded-lg shadow-xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-red-500">
                          Xác nhận xóa tài khoản
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 mt-2">
                          Bạn chắc chắn muốn xóa tài khoản? Hành động này không
                          thể hoàn tác và tất cả dữ liệu của bạn sẽ bị xóa vĩnh
                          viễn.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="px-4 py-2 rounded-full border hover:bg-gray-100">
                          Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                        >
                          Xác nhận xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Chưa có giao dịch
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Bạn chưa có giao dịch nào được thực hiện. Hãy bắt đầu mua vé
                  hoặc đăng bán vé ngay!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Cập nhật EditableInfoItem với style mới
function EditableInfoItem({
  label,
  value,
  isEditing,
  onChange,
}: {
  label: string;
  value?: string;
  isEditing: boolean;
  onChange?: (val: string) => void;
}) {
  const displayValue = value ?? "";

  if (label === "Giới tính") {
    const genderMap: Record<string, string> = {
      male: "Nam",
      female: "Nữ",
    };

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">{label}</label>
        {isEditing && onChange ? (
          <div className="flex gap-6">
            {Object.entries(genderMap).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={key}
                  checked={value === key}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-900 bg-gray-50/80 backdrop-blur-sm rounded-md px-3 py-2 border border-gray-100">
            {genderMap[value || ""] || "---"}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {isEditing && onChange ? (
        <input
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50/80 backdrop-blur-sm rounded-md px-3 py-2 border border-gray-100">
          {displayValue || "---"}
        </p>
      )}
    </div>
  );
}
