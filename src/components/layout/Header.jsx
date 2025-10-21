import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { authStore } from "../../store/authStore";
import logo from "../../assets/images/booklogo.png";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const { isAuthenticated, clearAuth, getUserRole } = authStore();
  const userName = authStore((state) => state.userName);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("auth-info");
    navigate("/login");
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/book/search?keyword=${keyword}`);
    setKeyword("");
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleMyPageClick = () => {
    setIsDropdownOpen(false);
    navigate("/mypage");
  };

  const role = getUserRole();
  const path = location.pathname;
  const isActive = (target) => path.startsWith(target);

  return (
    <header className="header">
      <div className="header__inner">
        {/* 로고 */}
        <h1 className="header__logo">
          <Link to="/book">
            <img src={logo} alt="온라인서점" />
          </Link>
        </h1>

        {/* 검색창 */}
        <form className="header__search" onSubmit={handleSearch}>
          <FiSearch className="ico-search" />
          <input
            type="text"
            placeholder="찾고 싶은 도서를 검색하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>

        {/* 햄버거 버튼 */}
        <button
          className="header__menu-btn"
          onClick={() => setIsMenuOpen(true)}
          aria-label="메뉴 열기"
        >
          <FiMenu />
        </button>

        {/* 데스크탑 네비 */}
        <nav className="header__nav">
          {isAuthenticated() ? (
            <>
              {role === "ROLE_ADMIN" && (
                <Link
                  to="/users"
                  className={`admin-link ${isActive("/users") ? "active" : ""}`}
                >
                  회원관리
                </Link>
              )}

              {role !== "ROLE_ADMIN" && (
                <Link
                  to="/cart"
                  className={`nav-icon ${isActive("/cart") ? "active" : ""}`}
                >
                  <FiShoppingCart />
                  <span>장바구니</span>
                </Link>
              )}

              <div className="user-menu">
                <FiUser
                  className={`user-icon ${isDropdownOpen ? "active" : ""}`}
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                />
                {isDropdownOpen && (
                  <div className="dropdown">
                    <span className="user-name">{userName}</span>
                    <button onClick={handleMyPageClick}>마이페이지</button>
                    <button onClick={handleLogout}>로그아웃</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className={`header__login ${isActive("/login") ? "active" : ""}`}
            >
              로그인
            </Link>
          )}
        </nav>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu__header">
          <h2>{userName}</h2>
          <button
            className="mobile-menu__close"
            onClick={() => setIsMenuOpen(false)}
            aria-label="닫기"
          >
            <FiX />
          </button>
        </div>

        <div className="mobile-menu__content">
          {isAuthenticated() ? (
            <>
              {role === "ROLE_ADMIN" && (
                <Link
                  to="/users"
                  onClick={() => setIsMenuOpen(false)}
                  className={isActive("/users") ? "active" : ""}
                >
                  회원관리
                </Link>
              )}

              {role !== "ROLE_ADMIN" && (
                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className={isActive("/cart") ? "active" : ""}
                >
                  장바구니
                </Link>
              )}

              <Link
                to="/mypage"
                onClick={() => setIsMenuOpen(false)}
                className={isActive("/mypage") ? "active" : ""}
              >
                마이페이지
              </Link>
              <button onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className={isActive("/login") ? "active" : ""}
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
