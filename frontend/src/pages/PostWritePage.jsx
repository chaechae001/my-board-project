import { useState } from "react";
import { Link, useNavigate } from "react-router";

const API_URL = "http://localhost:4000";

function PostWritePage() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        const token = localStorage.getItem("boardToken");

        // 토큰이 없다면 글쓰기 페이지에 접근해도 로그인 화면으로 보냅니다.
        if (!token) {
            navigate("/login");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                    // JWT 토큰을 Authorization 헤더로 서버에 전달합니다.
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    content,
                }),
            });

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("boardToken");
                localStorage.removeItem("boardUser");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || data.msg || "게시글을 작성하지 못했습니다.");
            }

            // 작성 성공 후 방금 만든 글의 상세 페이지로 이동합니다.
            navigate(`/posts/${data._id}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="write-page">
            <div className="write-card">
                <p className="eyebrow">NEW POST</p>
                <h1>게시글 작성</h1>

                <form className="write-form" onSubmit={handleSubmit}>
                    <label htmlFor="title">제목</label>
                    <input
                        id="title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="게시글 제목을 입력하세요"
                    />

                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="게시글 내용을 입력하세요"
                        rows="12"
                    />

                    {error && <p className="form-error">{error}</p>}

                    <div className="write-actions">
                        <Link to="/" className="secondary-link-button">
                            취소
                        </Link>

                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? "저장 중..." : "작성 완료"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default PostWritePage;