import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm/AuthForm";
import ChatRoom from "./components/ChatRoom//Index/Index";
import ProtectedRoute from "../src/routes/ProtectedRoute";
import ZaloCallback from "../src/pages/ZaloCallback.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/auth/zalo/callback" element={<ZaloCallback />} />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
