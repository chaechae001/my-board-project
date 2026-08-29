const express = require('express');
const app = express();

const PORT = 4000;

app.use(express.json());

// 아직 DB가 없으므로, 서버 메모리에 임시 게시글을 둔다
const posts = [
    {
        id: 1,
        title: "첫 번째 게시글",
        content: "Express 서버에서 보낸 게시글입니다.",
        author: "정채은",
        views: 0,
        createdAt: "2026-08-29",
    },
    {
        id: 2,
        title: "두 번째 게시글",
        content: "다음 단계에서 이 배열에 글을 추가합니다.",
        author: "관리자",
        views: 3,
        createdAt: "2026-08-29",
    },
];

// 서버가 정상 실행 중인지 확인하는 API
app.get("/api/health", (req, res)=> {
    res.status(200).json({
        status: "ok",
        msg : "Board API server is running",
    });
});

// 게시글 목록을 반환하는 API
app.get("/api/posts", (req, res)=>{
    res.status(200).json(posts);
});

// 새 게시글을 배열에 추가하는 API
let nextPostId = 3;

app.post("/api/posts", (req, res)=>{
    const { title, content} = req.body;

    // 제목과 내용이 없으면 작성할 수 없습니다.
    if(!title || !content) {
        return res.status(400).json({
            msg: "제목과 내용을 모두 입력해주세요",
        });
    }

    const newPost = {
        id: nextPostId,
        title,
        content,
        author: "정채은",
        views: 0,
        createdAt: new Date().toISOString().slice(0, 10),
    };

    posts.push(newPost);
    nextPostId +=1;

    return res.status(201).json(newPost);
});

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});