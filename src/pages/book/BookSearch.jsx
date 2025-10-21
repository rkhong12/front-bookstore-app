import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { bookAPI } from "../../service/bookAPI";
import BookGrid from "./BookGrid";
import styles from "./BookSearch.module.scss";

export default function BookSearch() {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("keyword")?.trim() || "";
    setKeyword(query);

    if (!query) {
      setBooks([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const res = await bookAPI.search(query);
        setBooks(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("검색 실패:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location.search]);

  return (
    <section className={styles.search}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          검색 결과{" "}
          {keyword && (
            <>
              : <span>{keyword}</span>
            </>
          )}
        </h2>

        {loading ? (
          <div className={styles.loading}>검색 중...</div>
        ) : books.length > 0 ? (
          <BookGrid list={books} type="normal" />
        ) : (
          <div className={styles.empty}>검색 결과가 없습니다.</div>
        )}
      </div>
    </section>
  );
}
