import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { API } from "../services/authAPI";

// Spinner component đơn giản
function Spinner() {
  return (
    <div style={{ margin: "30px auto", width: "40px", height: "40px" }}>
      <div className="spinner" />
      <style>{`
        .spinner {
          border: 4px solid rgba(0,0,0,0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #09f;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function ZaloCallback() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code") || "test"; // fallback code

    // Fake user data
    const fakeUser = {
      name: "Zalo User",
      email: `zalo_${code}@test.com`,
      phone: `phone_${code}`,
      password: "zalo_default_password",
      avatar: "https://i.pravatar.cc/150?img=3",
      token: "fake_zalo_token_" + code,
    };

    // Lưu user vào MockAPI
    API.post("/users", fakeUser)
      .then((res) => {
        const savedUser = res.data;

        // Cập nhật Redux
        dispatch({
          type: "auth/loginUser/fulfilled",
          payload: savedUser,
        });

        // Lưu localStorage
        localStorage.setItem("token", savedUser.token);
        localStorage.setItem("user", JSON.stringify(savedUser));

        // Chuyển vào app
        window.location.href = "/chat";
      })
      .catch((err) => {
        console.error("Error saving Zalo user:", err);
        setError("Đăng nhập Zalo thất bại. Vui lòng thử lại.");
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {loading && <Spinner />}
      <h2>{loading ? "Logging in with Zalo..." : "Đăng nhập thất bại"}</h2>
      {!loading && error && <p style={{ color: "red" }}>{error}</p>}
      {loading && (
        <p>Nếu bạn không được chuyển tiếp tự động, vui lòng refresh trang.</p>
      )}
    </div>
  );
}
