const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// 로그인 토큰을 검사하는 미들웨어
function requireAuth(req, res, next) {
    // 요청 Header의 Authorization 값을 가져옵니다.
    const authorization = req.headers.authorization;

    // 토큰이 없거나 "Bearer 토큰값" 형식이 아니면 요청을 막습니다.
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            msg: "로그인이 필요합니다.",
        });
    }

    // "Bearer 토큰값"에서 실제 토큰값만 분리합니다.
    const token = authorization.split(" ")[1];

    try {
        // 토큰을 검증하고, 토큰 안의 사용자 정보를 req.user에 저장합니다.
        // 이후 게시글 작성·수정·삭제 API에서 req.user를 사용합니다.
        req.user = jwt.verify(token, JWT_SECRET);

        // 토큰 검사를 통과했으므로 다음 API 코드로 이동합니다.
        next();
    } catch (error) {
        return res.status(401).json({
            msg: "유효하지 않거나 만료된 토큰입니다.",
        });
    }
}

module.exports = requireAuth;