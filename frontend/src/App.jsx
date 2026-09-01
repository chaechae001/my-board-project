import { Navigate, Route, Routes } from "react-router";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import PostListPage from "./pages/PostListPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostWritePage from "./pages/PostWritePage";
import PostEditPage from "./pages/PostEditPage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";

function App() {
    return (
        <div className="app-shell">
            <Header />

            <main className="page-content">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<PostListPage />} />
                    <Route path="/posts/:id" element={<PostDetailPage />} />
                    <Route path="/posts/:id/edit" element={<PostEditPage />} />
                    <Route path="/write" element={<PostWritePage />} />
                    {/* 존재하지 않는 주소는 목록 화면으로 이동 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;