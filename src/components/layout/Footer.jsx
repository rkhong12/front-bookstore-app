import React from "react";
// import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <h2 className="footer__logo">온라인서점</h2>
          <p className="footer__copy">
            © {new Date().getFullYear()} 온라인서점. All rights reserved.
          </p>
        </div>

        {/* <ul className="footer__menu">
          <li>
            <a href="#">회사소개</a>
          </li>
          <li>
            <a href="#">이용약관</a>
          </li>
          <li>
            <a href="#">개인정보처리방침</a>
          </li>
          <li>
            <a href="#">고객센터</a>
          </li>
        </ul> */}
      </div>
    </footer>
  );
}
