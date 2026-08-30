import { useEffect, useState } from 'react'
import './App.css'

// 백엔드 Express 서버 주소
const API_URL = "http://localhost:4000";

// MongoDB의 날짜 값을 "2026. 08. 30." 형태로 바꿉니다.
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("ko-KR");
}

function App() {

  // MongoDB에서 받아온 게시글 목록을 저장
  const [posts, setPosts] = useState([]);
  // 데이터를 불러오는 중인지 저장함
  const [isLoading, setIsLoading] = useState(true);
  // 요청이 실패했을 때 오류 메시지 저장
  const [error, setError] = useState("");

  useEffect(()=>{
    // 백엔드에서 게시글 목록을 받아오는 함수
    async function loadPosts() {
      try {
        const response = await fetch (`${API_URL}/api/posts`);

        // 서버가 200번대 성공 응답을 보내지 않으면 오류로 처리
        if (!response.ok) {
          throw new Error("게시글을 불러오지 못했습니다.");
        }
        // 서버가 보낸 JSON 데이터를 Javascript 배열로 바꿈
        const data = await response.json();
        // 받아온 게시글 목록을 posts 상태에 저장
        setPosts(data);
      } catch (error) {
        // 오류가 발생하면 화면에 표시할 메시지를 저장
        setError(error.message);
      } finally {
        // 성공, 실패와 관계없이 로딩 상태를 끝냄
        setIsLoading(false);
      }
    }

    // 화면이 처음 열릴 때 게시글 목록을 한 번 불러옴
    loadPosts();
  }, []);

  if (isLoading) {
    return <main>게시글을 불러오는 중입니다.</main>
  }

  if (error) {
    return <main>{error}</main>
  }

  return (
      <main className="app">
        <header className="page-header">
          <p className="eyebrow">COMMUNITY BOARD</p>
          <h1>My Board</h1>
          <p className="subtitle">
            로그인한 사용자가 글을 작성하고 관리할 수 있는 게시판입니다.
          </p>
        </header>

        <section className="board">
          <div className="board-heading">
            <div>
              <h2>게시글 목록</h2>
              <p>총 {posts.length}개의 게시글</p>
            </div>

            {/* 다음 단계에서 글쓰기 화면으로 연결할 버튼*/}
            <button type="button" className="write-button">
              글쓰기
            </button>
          </div>

          {isLoading && <p className="status-message">게시글을 불러오는 중입니다.</p> }
          {!isLoading && error && (
              <p className="status-message">아직 작성된 게시글이 없습니다.</p>
          )}

          {!isLoading && !error && posts.length > 0 && (
              <div className="table-wrapper">
                <table>
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
                    {posts.map((post, index) => (
                      <tr key={post._id}>
                        {/* 최신 글이 가장 큰 번호를 갖도록 표시 */}
                        <td>{posts.length - index}</td>
                        {/* 다음 단계에서 클릭 시 상세 페이지로 이동*/}
                        <td className="psot-title">{post.title}</td>

                        <td>{post.author || "알 수 없음"}</td>
                        <td>{post.views}</td>
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

export default App
