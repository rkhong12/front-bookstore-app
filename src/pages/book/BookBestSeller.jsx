import React, { useEffect, useState } from "react";
import styles from "./BookBestSeller.module.scss"; // ✅ 모듈 import
import { bookAPI } from "../../service/bookAPI";
import { getAbsoluteImageUrl } from "../../utils/imageUtils";
import { useNavigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

export default function BookBestSeller() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestBooks = async () => {
      try {
        const res = await bookAPI.best();
        const list = Array.isArray(res) ? res : res?.response ?? [];
        setBooks(list.slice(0, 20));
      } catch (err) {
        console.error("베스트 도서 조회 실패:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBestBooks();
  }, []);

  if (loading) return <p className={styles.loading}>베스트 도서 로딩중...</p>;

  if (!books.length)
    return (
      <div className={styles.empty}>최근 30일 판매 데이터가 없습니다.</div>
    );

  return (
    <section className={styles.bookBestSeller}>
      <div className={styles.inner}>
        <Swiper
          modules={[Autoplay, EffectCoverflow]}
          effect="coverflow"
          centeredSlides={true}
          slidesPerView="auto"
          grabCursor={true}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 180,
            modifier: 1.5,
            slideShadows: false,
          }}
          className={styles.swiper}
        >
          {books.map((book, idx) => {
            const isActive = idx === activeIndex;
            return (
              <SwiperSlide
                key={book.bookId}
                className={styles.slide}
                style={{ width: "240px" }}
              >
                <div
                  className={`${styles.card} ${isActive ? styles.active : ""}`}
                  onClick={() => isActive && navigate(`/book/${book.bookId}`)}
                >
                  <div className={styles.thumb}>
                    <img
                      src={
                        book.imgPath
                          ? getAbsoluteImageUrl(book.imgPath)
                          : "/static/imgs/noimage.jpg"
                      }
                      alt={book.title}
                    />
                    <span className={styles.rank}>{idx + 1}</span>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.title}>{book.title}</p>
                    <p className={styles.author}>{book.authorName}</p>
                    <p className={styles.price}>
                      {book.price?.toLocaleString()} P
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
