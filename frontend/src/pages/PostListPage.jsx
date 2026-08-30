// 화면이 처음 열릴 때 API를 호출하고,
// 받아온 데이터를 화면에 저장하기 위해 React 기능을 가져옵니다.
import { useEffect, useState } from "react";
import { Link } from "react-router";

// Express 백엔드 서버 주소입니다.
// React(5173번 포트)에서 Express(4000번 포트)로 요청을 보낼 때 사용합니다.
const API_URL = "http://localhost:4000";

// MongoDB의 날짜 문자열을 한국식 날짜로 보기 좋게 바꾸는 함수입니다.
// 예: "2026-08-30T..." → "2026. 8. 30."
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("ko-KR");
}


function PostListPage() {
  // posts: 서버에서 받아온 게시글 목록을 저장합니다.
  // setPosts: posts 값을 바꾸는 함수입니다.
  const [posts, setPosts] = useState([]);

  // 데이터를 불러오는 동안 true입니다.
  // 처음 화면이 열릴 때는 아직 데이터를 받지 못했으므로 true로 시작합니다.
  const [isLoading, setIsLoading] = useState(true);

  // 서버 요청이 실패했을 때 화면에 보여줄 오류 문구입니다.
  const [error, setError] = useState("");

  // useEffect 안의 코드는 화면이 처음 열릴 때 한 번 실행됩니다.
  useEffect(() => {
    // 서버에서 게시글 목록을 받아오는 비동기 함수입니다.
    async function loadPosts() {
      try {
        // Express 서버의 GET /api/posts API를 호출합니다.
        const response = await fetch(`${API_URL}/api/posts`);

        // 200번대 성공 응답이 아니면 오류로 처리합니다.
        if (!response.ok) {
          throw new Error("게시글을 불러오지 못했습니다.");
        }

        // 서버가 보낸 JSON 데이터를 JavaScript 배열로 변환합니다.
        const data = await response.json();

        // 받아온 배열을 posts 상태에 저장합니다.
        // 상태가 바뀌면 React가 화면을 다시 그립니다.
        setPosts(data);
      } catch (error) {
        // 오류가 발생하면 오류 문구를 error 상태에 저장합니다.
        setError(error.message);
      } finally {
        // 성공하거나 실패해도 로딩 상태는 끝납니다.
        setIsLoading(false);
      }
    }

    // 위에서 만든 함수를 실제로 실행합니다.
    loadPosts();
  }, []);

  return (
      // 게시판 전체를 감싸는 영역입니다.
      <main className="app">
        {/* 페이지 제목 영역입니다. */}
        <header className="page-header">
          <p className="eyebrow">COMMUNITY BOARD</p>
          <h1>My Board</h1>
          <p className="subtitle">
            로그인한 사용자가 글을 작성하고 관리할 수 있는 게시판입니다.
          </p>
        </header>

        {/* 게시글 목록 표를 담는 카드 영역입니다. */}
        <section className="board">
          <div className="board-heading">
            <div>
              <h2>게시글 목록</h2>

              {/* posts 배열의 개수로 게시글 수를 표시합니다. */}
              <p>총 {posts.length}개의 게시글</p>
            </div>

            {/* 현재는 모양만 있는 버튼입니다.
              다음 단계에서 글쓰기 화면으로 이동하게 만들 예정입니다. */}
            <button type="button" className="write-button">
              글쓰기
            </button>
          </div>

          {/* 서버에서 데이터를 받는 동안 표시합니다. */}
          {isLoading && (
              <p className="status-message">게시글을 불러오는 중입니다.</p>
          )}

          {/* 서버 요청이 실패했을 때 표시합니다. */}
          {!isLoading && error && (
              <p className="status-message error-message">{error}</p>
          )}

          {/* 요청은 성공했지만 게시글이 하나도 없을 때 표시합니다. */}
          {!isLoading && !error && posts.length === 0 && (
              <p className="status-message">아직 작성된 게시글이 없습니다.</p>
          )}

          {/* 게시글이 하나 이상 있을 때만 표를 표시합니다. */}
          {!isLoading && !error && posts.length > 0 && (
              <div className="table-wrapper">
                <table>
                  {/* 표의 제목 행입니다. */}
                  <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회수</th>
                    <th>작성일</th>
                  </tr>
                  </thead>

                  <tbody>
                  {/* posts 배열을 반복하며 게시글 한 개당 표의 한 줄을 만듭니다. */}
                  {posts.map((post, index) => (
                      // React가 각 줄을 구분하도록 MongoDB의 고유 _id를 key로 사용합니다.
                      <tr key={post._id}>
                        {/* 최신 글이 가장 큰 번호가 되도록 표시합니다. */}
                        <td>{posts.length - index}</td>

                        {/* 다음 단계에서 제목 클릭 시 상세 페이지로 이동하게 합니다. */}
                        <td>
                            <Link
                                to={`/posts/${post.id}`}
                                className="psot-title-link"
                            >
                                {post.title}
                            </Link>
                        </td>

                        {/* 기존 테스트 데이터에 작성자가 없을 경우를 대비한 처리입니다. */}
                        <td>{post.author || "알 수 없음"}</td>
                        <td>{post.views}</td>
                        {/* MongoDB 날짜를 formatDate 함수로 보기 좋게 바꿉니다. */}
                        <td>{formatDate(post.createdAt)}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </section>
      </main>
  );
}

export default PostListPage;