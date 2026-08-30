// Link: 목록 화면으로 이동할 때 사용
// useParams: URL의 :id 값을 읽을 때 사용
import {Link, useParams} from "react-router";

function PostDetailPage(){
    // /posts/:id 중 실제 id 값을 가져옴
    const {id} = useParams();

    return (
        <main className="app">
            {/* Link를 사용하면 새로고침 없이 목록 화면으로 이동*/}
            <Link to="/" className="back-link">
                ← 목록으로
            </Link>

            <section className="detail-card">
                <p className="eyebrow">POST DETAIL</p>
                <h1>게시글 상세 화면</h1>

                {/*다음 단계에서 이 id로 백엔드에 상세 게시글을 요청*/}
                <p>선택한 게시글 ID: {id}</p>
            </section>
        </main>
    )
}

export default PostDetailPage;