interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  avatar: string;
  reputation: number;
  role: "admin" | "staff" | "customer";
  gender: "male" | "female" | "other";
  status: "verified" | "unverified";
  createdAt: string;
  updatedAt: string;
}
