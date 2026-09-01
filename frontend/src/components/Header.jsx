import { Link, useLocation, useNavigate } from "react-router";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    // 로그인 성공 시 localStorage에 저장한 사용자 정보를 읽습니다.
    // location을 사용하므로 로그인 후 페이지가 바뀌면 화면도 다시 반영됩니다.
    const savedUser = localStorage.getItem("boardUser");
    const user = savedUser ? JSON.parse(savedUser) : null;

    function handleLogout() {
        // 브라우저에 저장했던 로그인 정보를 모두 제거합니다.
        localStorage.removeItem("boardToken");
        localStorage.removeItem("boardUser");

        // 로그아웃 후 로그인 페이지로 이동합니다.
        navigate("/login");
    }

    return (
        <header className="site-header">
            <Link to="/" className="site-logo">
                COMMUNITY BOARD
            </Link>

            {/* 로그인 화면에서는 오른쪽 메뉴를 표시하지 않습니다. */}
            {location.pathname !== "/login" && (
                <nav className="site-nav">
                    {user ? (
                        <>
                            <span className="login-user">{user.userId}님</span>

                            <button type="button" className="logout-button" onClick={handleLogout}>
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-login-link">
                            로그인
                        </Link>
                    )}
                </nav>
            )}
        </header>
    );
}

export default Header;