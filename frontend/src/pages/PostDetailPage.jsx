import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const API_URL = "http://localhost:4000";

function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // 개발 환경에서 같은 상세 요청이 중복 실행되어
    // 조회수가 두 번 오르는 것을 막기 위한 값입니다.
    const requestedIdRef = useRef(null);

    useEffect(() => {
        async function fetchPost() {
            const token = localStorage.getItem("boardToken");

            if (!token) {
                navigate("/login");
                return;
            }

            // 같은 게시글에 대한 중복 요청을 막습니다.
            if (requestedIdRef.current === id) {
                return;
            }

            requestedIdRef.current = id;

            try {
                const response = await fetch(`${API_URL}/api/posts/${id}`, {
                    headers: {
                        // 상세 조회 API에도 JWT 토큰을 보냅니다.
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.status === 401) {
                    localStorage.removeItem("boardToken");
                    localStorage.removeItem("boardUser");
                    navigate("/login");
                    return;
                }

                if (!response.ok) {
                    throw new Error(data.msg || "게시글을 불러오지 못했습니다.");
                }

                setPost(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [id, navigate]);

    async function handleDelete() {
        const token = localStorage.getItem("boardToken");

        const isConfirmed = window.confirm("이 게시글을 삭제할까요?");

        if (!isConfirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(`${API_URL}/api/posts/${id}`, {
                method: "DELETE",
                headers: {
                    // 삭제 요청에도 JWT 토큰을 보냅니다.
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "게시글을 삭제하지 못했습니다.");
            }

            // 삭제 성공 후 목록 페이지로 돌아갑니다.
            navigate("/");
        } catch (error) {
            setError(error.message);
            setIsDeleting(false);
        }
    }

    if (loading) {
        return <p className="page-message">게시글을 불러오는 중입니다.</p>;
    }

    if (error) {
        return (
            <section className="detail-page">
                <p className="page-message error-message">{error}</p>
                <Link to="/" className="secondary-link-button">
                    목록으로 돌아가기
                </Link>
            </section>
        );
    }

    // localStorage의 현재 로그인 사용자와 게시글 작성자를 비교합니다.
    const savedUser = localStorage.getItem("boardUser");
    const user = savedUser ? JSON.parse(savedUser) : null;

    const isAuthor =
        user && post.authorId && String(post.authorId) === String(user.id);

    return (
        <section className="detail-page">
            <div className="detail-card">
                <div className="detail-meta">
                    <span>{post.author}</span>
                    <span>조회 {post.views}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
                </div>

                <h1>{post.title}</h1>

                <div className="post-content">{post.content}</div>

                <div className="detail-actions">
                    <Link to="/" className="secondary-link-button">
                        목록으로
                    </Link>

                    {/* 본인 글일 때만 삭제 버튼을 보여줍니다. */}
                    {isAuthor && (
                        <Link to={`/posts/${id}/edit`} className="edit-button">
                            수정하기
                        </Link>
                    )}

                    {isAuthor && (
                        <button
                            type="button"
                            className="danger-button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "삭제 중..." : "삭제하기"}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

export default PostDetailPage;