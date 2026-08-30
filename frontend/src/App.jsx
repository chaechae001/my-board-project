// URL과 화면을 연결하는 기능
import {Route, Routes} from "react-router";

import "./App.css";
import PostListPage from "./pages/PostListPage";
import PostDetailPage from "./pages/PostDetailPage";

function App() {
  return (
      <Routes>
        {/*기본 주소에서는 게시글 목록 화면을 보여줌*/}
        <Route path="/" element={<PostListPage />} />
        {/*/posts/게시글_ID 주소에서는 상세 화면을 보여줌*/}
        <Route path="/posts/:id" element={<PostDetailPage />} />
      </Routes>
  );
}

export default App;