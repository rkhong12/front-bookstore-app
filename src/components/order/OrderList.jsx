import React from "react";
// import "./OrderList.scss";
import { getAbsoluteImageUrl } from "../../utils/imageUtils";

export default function OrderList({ orders = [], compact = false }) {
  if (!orders.length) {
    return (
      <div className="order-list empty">
        <p>주문 내역이 없습니다.</p>
      </div>
    );
  }

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );

  return (
    <div className={`order-list ${compact ? "compact" : ""}`}>
      {sortedOrders.map((order) => (
        <div className="order-card" key={order.orderId}>
          <div className="order-card__header">
            <div className="order-card__info">
              <span className="order-card__label">주문번호</span>
              <strong>{order.orderId}</strong>
            </div>
            <div className="order-card__meta">
              <span>{order.orderDate?.replace("T", " ").slice(0, 19)}</span>
              <strong className="order-card__price">
                총 {order.totalPrice?.toLocaleString()} P
              </strong>
            </div>
          </div>

          <ul className="order-items">
            {order.items?.map((book, i) => {
              const title = book.title || book.bookTitle || "제목 없음";
              const author =
                book.authorName || book.bookAuthorName || "작가 정보 없음";
              const price =
                book.price ||
                book.bookPriceSnapshot ||
                book.book_price_snapshot ||
                0;
              const rawImgPath =
                book.imgPath || book.bookImgPath || book.book_img_path || "";

              const imgSrc = rawImgPath
                ? getAbsoluteImageUrl(rawImgPath)
                : null;

              return (
                <li key={i} className="order-item">
                  {imgSrc && (
                    <div className="order-item__thumb-wrap">
                      <img
                        src={imgSrc}
                        alt={title}
                        className="order-item__thumb"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="order-item__details">
                    <h5 className="order-item__title">{title}</h5>
                    {author && <p className="order-item__author">{author}</p>}
                    <div className="order-item__meta">
                      <span>수량 {book.quantity ?? 1}권</span>
                      <span className="divider">·</span>
                      <span>{price.toLocaleString()} P</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
