const express = require('express');
const mongoose = require("mongoose");
const Post = require("./models/Post");

const app = express();

const PORT = 4000;

app.use(express.json());

// 아직 DB가 없으므로, 서버 메모리에 임시 게시글을 둔다
// const posts = [
//     {
//         id: 1,
//         title: "첫 번째 게시글",
//         content: "Express 서버에서 보낸 게시글입니다.",
//         author: "정채은",
//         views: 0,
//         createdAt: "2026-08-29",
//     },
//     {
//         id: 2,
//         title: "두 번째 게시글",
//         content: "다음 단계에서 이 배열에 글을 추가합니다.",
//         author: "관리자",
//         views: 3,
//         createdAt: "2026-08-29",
//     },
// ];

// 서버가 정상 실행 중인지 확인하는 API
app.get("/api/health", (req, res)=> {
    res.status(200).json({
        status: "ok",
        msg : "Board API server is running",
    });
});

// 게시글 목록을 반환하는 API
// app.get("/api/posts", (req, res)=>{
//     res.status(200).json(posts);
// });

// 게시글 목록을 MongoDB에서 조회하는 API
app.get('/api/posts', async(req, res)=>{
    try{
        const posts = await Post.find().sort({createdAt: -1});
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({
            msg: "게시글 목록을 불러오지 못했습니다.",
        });
    }
});

// 새 게시글을 배열에 추가하는 API
// let nextPostId = 3;

// 새 게시글을 MongoDB에 저장하는 API
app.post("/api/posts", async (req, res)=>{
    try {
        const { title, content} = req.body;

        // 제목과 내용이 없으면 작성할 수 없습니다.
        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({
                message: "제목과 내용을 모두 입력해주세요.",
            });
        }

        const newPost = await Post.create({
            title,
            content,
        });

        return res.status(201).json(newPost);
    } catch (error) {
        return res.status(500).json({
            msg: "게시글을 저장하지 못했습니다."
        });
    }
});

// 게시글 번호로 게시글 하나를 조회하는 API
app.get("/api/posts/:id", (req, res)=>{
    const postId = Number(req.params.id);

    const post = posts.find((post)=> post.id === postId);

    // 해당 번호의 게시글이 없을 때
    if(!post) {
        return res.status(404).json({
            msg: "게시글을 찾을 수 없습니다.",
        });
    }

    // 상세 페이지를 조회할 때마다 조회수를 1 증가합니다.
    post.views += 1;

    return res.status(200).json(post);
});

// 게시글 번호로 게시글 하나를 삭제하는 API
app.delete("/api/posts/:id", (req, res)=>{
    const postId = Number(req.params.id);

    const postIndex = posts.findIndex((post)=> post.id === postId);

    // 해당 번호의 게시글이 없을 때
    if(postIndex === -1) {
        return res.status(404).json({
            msg: "게시글을 찾을 수 없습니다.",
        });
    }

    // 배열에서 해당 게시글을 삭제하고, 삭제된 데이터를 받습니다.
    const deletedPost = posts.splice(postIndex, 1)[0];

    return res.status(200).json({
        msg: "게시글이 삭제되었습니다.",
        deletedPost,
    });
});



// app.listen(PORT, ()=>{
//     console.log(`Server is running at http://localhost:${PORT}`);
// });

async function startServer(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/my_board_db");

        console.log("MongoDB 연결 성공");

        app.listen(4000, ()=>{
            console.log("Server is running on port 4000");
        });
    } catch (error) {
        console.error("MongoDB 연결 실패:", error.message);
        process.exit(1);
    }
}

startServer();