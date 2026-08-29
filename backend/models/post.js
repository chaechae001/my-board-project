const mongoose = require("mongoose");

// MongoDB에 저장할 게시글 데이터의 형식
const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            default: "정채은",
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true, // createdAt, updatedAt을 자동으로 생성
        versionKey: false, // __v 필드 숨김
    },
);

module.exports = mongoose.model("Post", postSchema);
