import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router";

import "./index.css";
import App from "./App.jsx";

// App 전체를 BrowserRouter로 감싸면,
// 내부 컴포넌트에서 URL 이동 기능을 사용할 수 있음
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
