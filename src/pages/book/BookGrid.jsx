import React from "react";
import { Link } from "react-router";
import styles from "./BookGrid.module.scss"; // ✅ 모듈 import

/**
 * BookGrid
 * @param {Array} list - 도서 리스트
 * @param {String} type - "best" | "normal"
 * @param {Function} fmt - Intl.NumberFormat
 * @param {Boolean} isAdmin - 관리자 여부
 * @param {Function} onItemClick - 베스트셀러 클릭 시 동작
 */
const BookGrid = ({
  list = [],
  type = "normal",
  fmt,
  isAdmin = false,
  onItemClick,
}) => {
  if (!Array.isArray(list) || list.length === 0) {
    return (
      <div className={`${styles.grid} ${styles.empty}`}>
        {type === "best" ? "베스트셀러가 없습니다." : "등록된 도서가 없습니다."}
      </div>
    );
  }

  const getImgSrc = (path) => {
    if (!path) return "/static/imgs/default.jpg";
    if (path.startsWith("http")) return path;
    return `http://localhost:9090${path}`;
  };

  return (
    <div className={`${styles.grid} ${type === "best" ? styles.best : ""}`}>
      {list.map((b, idx) => {
        const isSoldOut = (b.stock ?? 0) <= 0;

        const handleClick = (e) => {
          if (!isAdmin && isSoldOut) {
            e.preventDefault();
          }
        };

        return (
          <div
            key={`${b.bookId || "book"}-${idx}`}
            className={`${styles.card} ${
              type === "best" ? styles.bestCard : ""
            } ${
              isSoldOut
                ? isAdmin
                  ? styles.soldoutAdmin
                  : styles.soldoutUser
                : ""
            }`}
            onClick={type === "best" ? () => onItemClick(b.bookId) : undefined}
          >
            {type === "normal" ? (
              <Link
                to={`/book/${b.bookId}`}
                onClick={handleClick}
                className={styles.link}
              >
                {isSoldOut && <div className={styles.overlay}>품절</div>}

                <div className={styles.thumb}>
                  <img src={getImgSrc(b.imgPath)} alt={b.title} />
                </div>

                <div className={styles.body}>
                  <div className={styles.title}>{b.title}</div>
                  <div className={styles.meta}>
                    {b.authorName || "작가 미상"}
                  </div>
                </div>
              </Link>
            ) : (
              <>
                <div className={styles.thumb}>
                  <img src={getImgSrc(b.imgPath)} alt={b.title} />
                  {isSoldOut && <div className={styles.overlay}>품절</div>}
                </div>

                <div className={styles.body}>
                  <div className={styles.title}>{b.title}</div>
                  <div className={styles.meta}>
                    {b.author?.name || "작가 미상"}
                  </div>
                  {b.totalQty && (
                    <div className={styles.badge}>
                      누적 {fmt.format(b.totalQty)}권
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookGrid;
