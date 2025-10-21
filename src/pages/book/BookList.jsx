import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { authStore } from "../../store/authStore";
import { bookAPI } from "../../service/bookAPI";
import BookGrid from "./BookGrid";
import BookBestSeller from "./BookBestSeller";
import { FiPlus } from "react-icons/fi";
import styles from "./BookList.module.scss";

export default function BookList() {
  const navigate = useNavigate();
  const { userRole } = authStore();
  const isAdmin = userRole === "ROLE_ADMIN";

  const [list, setList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showEndMsg, setShowEndMsg] = useState(false);
  const limit = 8;

  const fmt = useMemo(
    () => new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }),
    []
  );

  useEffect(() => {
    loadBooks(0, true);
  }, []);

  const loadBooks = async (nextOffset = 0, initial = false) => {
    try {
      if (initial) setLoading(true);
      else setLoadingMore(true);

      const data = await bookAPI.list(nextOffset, limit);
      const safeData = Array.isArray(data) ? data : [];

      if (initial) setList(safeData);
      else setList((prev) => [...prev, ...safeData]);

      setOffset(nextOffset + safeData.length);
      setHasMore(safeData.length === limit);

      if (safeData.length < limit) {
        setShowEndMsg(true);
        setTimeout(() => setShowEndMsg(false), 3000);
      }
    } catch (err) {
      console.error("도서 목록 로딩 실패:", err);
    } finally {
      if (initial) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section className={styles.books}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>도서 목록</h2>
        {isAdmin && (
          <button
            className={`${styles.btn} ${styles.primary}`}
            onClick={() => navigate("/book/new")}
          >
            <FiPlus className={styles.iconPlus} /> 도서 등록
          </button>
        )}
      </div>

      {/* 베스트셀러 */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h3 className={styles.subtitle}>베스트셀러</h3>
          <span className={styles.period}>최근 30일 판매 기준</span>
        </div>
        <BookBestSeller />
      </div>

      {/* 전체 도서 */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h3 className={styles.subtitle}>전체 도서</h3>
        </div>

        {loading ? (
          <div className={styles.loading}>📚 도서 목록 로딩중...</div>
        ) : (
          <>
            <BookGrid list={list} type="normal" fmt={fmt} isAdmin={isAdmin} />

            {hasMore ? (
              <div className={styles.more}>
                <button
                  className={`${styles.btn} ${styles.moreBtn} ${
                    loadingMore ? styles.loadingState : ""
                  }`}
                  onClick={() => loadBooks(offset)}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <span className={styles.spinner}></span>
                      <span className={styles.text}>로딩중...</span>
                    </>
                  ) : (
                    "더보기"
                  )}
                </button>
              </div>
            ) : (
              showEndMsg && (
                <p className={`${styles.end} ${styles.show}`}>
                  📚 모든 도서를 불러왔습니다.
                </p>
              )
            )}
          </>
        )}
      </div>

      <button className={styles.top} onClick={scrollTop}>
        ↑
      </button>
    </section>
  );
}
