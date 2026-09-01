import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const API_URL = "http://localhost:4000";

function PostEditPage() {
    // URL의 /posts/:id/edit 에서 게시글 ID를 가져옵니다.
    const { id } = useParams();
    const navigate = useNavigate();

    // 기존 게시글 내용과 수정한 내용을 입력창에 표시하기 위한 상태입니다.
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchPostForEdit() {
            const token = localStorage.getItem("boardToken");

            // 토큰이 없으면 수정 화면을 볼 수 없습니다.
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                // 기존 글의 제목과 내용을 불러옵니다.
                const response = await fetch(`${API_URL}/api/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                // 토큰이 만료됐거나 올바르지 않으면 로그인 화면으로 보냅니다.
                if (response.status === 401) {
                    localStorage.removeItem("boardToken");
                    localStorage.removeItem("boardUser");
                    navigate("/login");
                    return;
                }

                if (!response.ok) {
                    throw new Error(data.msg || "게시글을 불러오지 못했습니다.");
                }

                // 불러온 기존 내용을 입력창의 기본값으로 넣습니다.
                setTitle(data.title);
                setContent(data.content);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPostForEdit();
    }, [id, navigate]);

    async function handleSubmit(event) {
        event.preventDefault();

        const token = localStorage.getItem("boardToken");

        if (!token) {
            navigate("/login");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            // PATCH 요청으로 제목과 내용을 수정합니다.
            const response = await fetch(`${API_URL}/api/posts/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
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
                throw new Error(data.msg || "게시글을 수정하지 못했습니다.");
            }

            // 수정 완료 후 해당 게시글 상세 화면으로 돌아갑니다.
            navigate(`/posts/${id}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return <p className="page-message">게시글을 불러오는 중입니다.</p>;
    }

    if (error) {
        return (
            <section className="write-page">
                <p className="page-message error-message">{error}</p>
                <Link to="/" className="secondary-link-button">
                    목록으로 돌아가기
                </Link>
            </section>
        );
    }

    return (
        <section className="write-page">
            <div className="write-card">
                <p className="eyebrow">EDIT POST</p>
                <h1>게시글 수정</h1>

                <form className="write-form" onSubmit={handleSubmit}>
                    <label htmlFor="title">제목</label>
                    <input
                        id="title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />

                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        rows="12"
                    />

                    {error && <p className="form-error">{error}</p>}

                    <div className="write-actions">
                        <Link to={`/posts/${id}`} className="secondary-link-button">
                            취소
                        </Link>

                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? "수정 중..." : "수정 완료"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default PostEditPage;