import { useState } from "react";
import { Link, useNavigate } from "react-router";

const API_URL = "http://localhost:4000";

function RegisterPage() {
    const navigate = useNavigate();

    // 사용자가 입력하는 회원가입 정보입니다.
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        // form 제출 시 브라우저가 새로고침되는 것을 막습니다.
        event.preventDefault();

        setError("");

        // 서버 요청 전에 비밀번호 확인값이 같은지 먼저 검사합니다.
        if (password !== passwordConfirm) {
            setError("비밀번호가 서로 일치하지 않습니다.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 백엔드 회원가입 API에 아이디와 비밀번호를 보냅니다.
            const response = await fetch(`${API_URL}/api/auth/register`, {
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

            if (!response.ok) {
                throw new Error(data.msg || "회원가입에 실패했습니다.");
            }

            // 가입 완료 후 로그인 화면으로 이동합니다.
            // state로 성공 메시지도 함께 전달합니다.
            navigate("/login", {
                state: {
                    message: "회원가입이 완료되었습니다. 로그인해주세요.",
                },
            });
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
                <h1>회원가입</h1>
                <p className="auth-description">
                    아이디와 비밀번호를 입력해 계정을 만드세요.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="userId">아이디</label>
                    <input
                        id="userId"
                        value={userId}
                        onChange={(event) => setUserId(event.target.value)}
                        placeholder="사용할 아이디를 입력하세요"
                        autoComplete="username"
                    />

                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="8자 이상 입력하세요"
                        autoComplete="new-password"
                    />

                    <label htmlFor="passwordConfirm">비밀번호 확인</label>
                    <input
                        id="passwordConfirm"
                        type="password"
                        value={passwordConfirm}
                        onChange={(event) => setPasswordConfirm(event.target.value)}
                        placeholder="비밀번호를 한 번 더 입력하세요"
                        autoComplete="new-password"
                    />

                    {error && <p className="form-error">{error}</p>}

                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? "가입 중..." : "회원가입"}
                    </button>
                </form>

                <p className="auth-footer">
                    이미 계정이 있나요? <Link to="/login">로그인</Link>
                </p>
            </div>
        </section>
    );
}

export default RegisterPage;