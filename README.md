# My Board

JWT 인증 기반의 커뮤니티 게시판 웹 애플리케이션입니다.  
사용자는 회원가입과 로그인을 통해 게시글을 조회·작성·수정·삭제할 수 있습니다.

## 주요 기능

- 회원가입 및 로그인
- JWT 기반 인증
- 로그인한 사용자만 게시글 목록·상세 조회 가능
- 게시글 작성
- 게시글 상세 조회 및 조회수 증가
- 작성자 본인만 게시글 수정·삭제 가능
- 다른 사용자의 게시글 수정·삭제 차단
- WebStorm HTTP Client를 이용한 API 테스트

## 기술 스택

| 구분 | 사용 기술 |
|---|---|
| Frontend | React, Vite, React Router, CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| API Test | WebStorm HTTP Client |
| Version Control | Git, GitHub |

## 프로젝트 구조

```text
my_board_project
├── backend
│   ├── config
│   ├── middlewares
│   │   └── requireAuth.js
│   ├── models
│   │   ├── Post.js
│   │   └── User.js
│   ├── .env.example
│   ├── board-api.http
│   ├── package.json
│   └── server.js
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── .gitignore
└── README.md
```

## 실행 방법

### 1. MongoDB 실행

MongoDB Community Server를 실행한 뒤, 로컬 MongoDB 주소를 사용합니다.

```text
mongodb://127.0.0.1:27017/my_board_db
```

### 2. 백엔드 실행

```bash
cd backend
npm install
```

`backend/.env` 파일을 만들고 JWT 비밀키를 설정합니다.

```env
JWT_SECRET=your-local-secret-key
```

서버를 실행합니다.

```bash
node server.js
```

백엔드 서버는 `http://localhost:4000`에서 실행됩니다.

### 3. 프론트엔드 실행

새 Terminal에서 실행합니다.

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.

## API 목록

| Method | URL | 인증 | 설명 |
|---|---|---:|---|
| POST | `/api/auth/register` | X | 회원가입 |
| POST | `/api/auth/login` | X | 로그인 및 JWT 발급 |
| GET | `/api/auth/me` | O | 현재 로그인 사용자 확인 |
| GET | `/api/posts` | O | 게시글 목록 조회 |
| POST | `/api/posts` | O | 게시글 작성 |
| GET | `/api/posts/:id` | O | 게시글 상세 조회 및 조회수 증가 |
| PATCH | `/api/posts/:id` | O, 작성자 | 게시글 수정 |
| DELETE | `/api/posts/:id` | O, 작성자 | 게시글 삭제 |

## 권한 처리

- 토큰 없이 인증 API에 요청하면 `401 Unauthorized`를 반환합니다.
- 다른 사용자의 게시글을 수정 또는 삭제하면 `403 Forbidden`을 반환합니다.
- 존재하지 않는 게시글을 요청하면 `404 Not Found`를 반환합니다.
- 잘못된 MongoDB ObjectId 형식이면 `400 Bad Request`를 반환합니다.

## 향후 개선 사항

- 게시글 이미지 업로드 및 미리보기
- 게시글 수정 화면에서 조회수가 증가하지 않도록 조회 API 분리
- 페이지네이션 및 검색 기능
- Access Token 보관 방식 보안 개선
- 배포 환경에 맞는 환경 변수 관리