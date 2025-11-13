import axios from "axios";

// Tạo axios instance duy nhất
export const API = axios.create({
  baseURL: "https://690daa59a6d92d83e8528374.mockapi.io",
});

// Đăng ký
export const signup = async (data) => {
  const res = await API.post("/users", data);
  return res.data;
};

// Đăng nhập (email hoặc phone)
export const login = async (identifier, password) => {
  // Xác định là email hay phone
  const isPhone = /^\d{10,15}$/.test(identifier);
  const query = isPhone ? `phone=${identifier}` : `email=${identifier}`;

  const res = await API.get(`/users?${query}`);
  const user = res.data[0];

  if (!user || user.password !== password) {
    throw new Error("Invalid email/phone or password");
  }

  // Tạo token giả lập
  const fakeToken = Math.random().toString(36).substring(2);
  await API.put(`/users/${user.id}`, { token: fakeToken });

  return { ...user, token: fakeToken };
};
