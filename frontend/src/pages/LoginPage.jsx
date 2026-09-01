import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

const API_URL = "http://localhost:4000";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // 사용자가 입력한 아이디와 비밀번호를 저장합니다.
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    // 로그인 요청 중인지, 오류가 있는지 화면에 표시하기 위한 상태입니다.
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        // form 기본 동작인 페이지 새로고침을 막습니다.
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            // 로그인 API에 아이디와 비밀번호를 보냅니다.
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    password,
                }),
            });

            const data = await response.json();

            // 서버가 200이 아닌 응답을 보내면 오류를 표시합니다.
            if (!response.ok) {
                throw new Error(data.msg || "로그인에 실패했습니다.");
            }

            // 이후 API 요청에서 사용할 JWT 토큰을 브라우저에 저장합니다.
            localStorage.setItem("boardToken", data.token);

            // 헤더에 사용자 아이디를 표시하기 위한 정보입니다.
            localStorage.setItem("boardUser", JSON.stringify(data.user));

            // 로그인 성공 후 게시글 목록으로 이동합니다.
            navigate("/");
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="auth-page">
            <div className="auth-card">
                <p className="eyebrow">COMMUNITY BOARD</p>
                <h1>로그인</h1>
                <p className="auth-description">
                    로그인 후 게시글을 조회하고 작성할 수 있습니다.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* 기존 아이디·비밀번호 입력칸과 로그인 버튼 */}
                    <label htmlFor="userId">아이디</label>
                    <input
                        id="userId"
                        value={userId}
                        onChange={(event) => setUserId(event.target.value)}
                        placeholder="아이디를 입력하세요"
                        autoComplete="username"
                    />

                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        autoComplete="current-password"
                    />

                    {error && <p className="form-error">{error}</p>}

                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? "로그인 중..." : "로그인"}
                    </button>
                </form>
                {location.state?.message && (
                    <p className="form-success">{location.state.message}</p>
                )}

                <p className="auth-footer">
                    아직 계정이 없나요? <Link to="/register">회원가입</Link>
                </p>
            </div>
        </section>
    );
}

export default LoginPage;