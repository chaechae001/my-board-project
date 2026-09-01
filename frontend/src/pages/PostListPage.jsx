import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const API_URL = "http://localhost:4000";

function PostListPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      // 로그인 토큰이 없으면 API 요청 전 로그인 화면으로 이동합니다.
      const token = localStorage.getItem("boardToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/posts`, {
          headers: {
            // 목록 조회 API에도 JWT 토큰을 함께 보냅니다.
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        // 토큰 만료·잘못된 토큰 등으로 401이 나오면 로그아웃 처리합니다.
        if (response.status === 401) {
          localStorage.removeItem("boardToken");
          localStorage.removeItem("boardUser");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.msg || "게시글 목록을 불러오지 못했습니다.");
        }

        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [navigate]);

  if (loading) {
    return <p className="page-message">게시글 목록을 불러오는 중입니다.</p>;
  }

  if (error) {
    return <p className="page-message error-message">{error}</p>;
  }

  const savedUser = localStorage.getItem("boardUser");
  const user = savedUser ? JSON.parse(savedUser) : null;


  return (
      <section className="board-page">
        <div className="board-intro">
          <h1>My Board</h1>
          <p>로그인한 사용자가 글을 작성하고 관리할 수 있는 게시판입니다.</p>
        </div>

        <div className="board-card">
          <div className="board-card-header">
            <div>
              <h2>게시글 목록</h2>
              <p>총 {posts.length}개의 게시글</p>
            </div>

            <Link to="/write" className="primary-link-button">
              글쓰기
            </Link>
          </div>

          <div className="table-scroll">
            <table className="post-table">
              <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>작성일</th>
                <th>관리</th>
              </tr>
              </thead>

              <tbody>
              {posts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      아직 작성된 게시글이 없습니다.
                    </td>
                  </tr>
              ) : (
                  posts.map((post, index) => (
                      <tr key={post._id}>
                        <td>{posts.length - index}</td>

                        <td className="post-title-cell">
                          <Link to={`/posts/${post._id}`} className="post-title-link">
                            {post.title}
                          </Link>
                        </td>

                        <td>{post.author}</td>
                        <td>{post.views}</td>
                        <td>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</td>

                        <td>
                          {user && String(post.authorId) === String(user.id) ? (
                              <Link to={`/posts/${post._id}/edit`} className="table-edit-link">
                                수정
                              </Link>
                          ) : (
                              "-"
                          )}
                        </td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
  );
}

export default PostListPage;