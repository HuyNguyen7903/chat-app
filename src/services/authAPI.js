import axios from "axios";

const API = axios.create({
  baseURL: "https://690daa59a6d92d83e8528374.mockapi.io",
});

// Đăng ký
export const signup = async (data) => {
  const res = await API.post("/users", data);
  return res.data;
};

// Đăng nhập
export const login = async (email, password) => {
  const res = await API.get(`/users?email=${email}`);
  const user = res.data[0];

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  // Giả lập token
  const fakeToken = Math.random().toString(36).substring(2);

  // Lưu token vào mockapi
  await API.put(`/users/${user.id}`, { token: fakeToken });

  return { ...user, token: fakeToken };
};
