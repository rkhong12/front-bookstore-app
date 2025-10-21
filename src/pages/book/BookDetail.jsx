import React, { useEffect, useState } from "react";
import styles from "./BookDetail.module.scss";
import { useParams, useNavigate } from "react-router";
import { authStore } from "../../store/authStore";
import { useBook } from "../../hooks/useBook";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { bookAPI } from "../../service/bookAPI";
import { cartAPI } from "../../service/cartAPI";
import { orderAPI } from "../../service/orderAPI";
import { userAPI } from "../../service/userAPI";
import InputField from "../../components/common/InputField";
import { getAbsoluteImageUrl } from "../../utils/imageUtils";
import CartSummary from "../../components/cart/CartSummary";

export default function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userRole } = authStore.getState();
  const isAdmin = userRole === "ROLE_ADMIN";

  const [book, setBook] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("/static/imgs/default.jpg");
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => bookAPI.get(bookId),
    staleTime: 0,
    cacheTime: 0,
  });

  const { updateBookMutation, deleteBookMutation } = useBook();

  useEffect(() => {
    if (data) {
      const b = data.response ?? data;
      setBook(b);
      if (b?.imgPath) setPreviewSrc(getAbsoluteImageUrl(b.imgPath));
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => refetch(), 3000);
    return () => clearInterval(interval);
  }, [bookId, refetch]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userAPI.detail();
        setUserPoints(res?.response?.point ?? 0);
      } catch (err) {
        console.error("포인트 조회 실패:", err);
      }
    };
    fetchUser();
  }, []);

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBook((prev) => ({ ...prev, newImageFile: file }));
    setPreviewSrc(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!isAdmin || !book) return;
    if (!window.confirm("해당 도서 정보를 수정하시겠습니까?")) return;
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", book.title ?? "");
      formData.append("authorName", book.authorName ?? "");
      formData.append("price", book.price ?? 0);
      formData.append("stock", book.stock ?? 0);
      if (book.authorId) formData.append("authorId", book.authorId);
      if (book.newImageFile) formData.append("files", book.newImageFile);

      const result = await updateBookMutation.mutateAsync({ bookId, formData });
      if (result) {
        alert("도서 수정이 완료되었습니다.");
        queryClient.invalidateQueries(["book", bookId]);
        refetch();
      } else alert("도서 수정에 실패했습니다.");
    } catch (err) {
      console.error("도서 수정 실패:", err);
      alert("도서 수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin || !book) return;
    if (!window.confirm("해당 도서를 삭제하시겠습니까?")) return;

    try {
      const res = await deleteBookMutation.mutateAsync(book.bookId);
      alert(res?.response || "도서가 삭제되었습니다.");
      queryClient.invalidateQueries(["book"]);
      navigate("/book", { replace: true });
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleAddToCart = async () => {
    if ((book.stock ?? 0) <= 0) {
      alert("품절된 도서는 장바구니에 담을 수 없습니다.");
      return;
    }

    try {
      await cartAPI.addToCart(book.bookId, quantity);
      alert(`"${book.title}" (${quantity}권)이 장바구니에 추가되었습니다.`);
      navigate("/cart");
    } catch {
      alert("장바구니 추가 중 오류 발생");
    }
  };

  const handleBuyNow = async () => {
    if (!book) return;
    if ((book.stock ?? 0) <= 0) {
      alert("재고가 없습니다.");
      return;
    }

    const totalPrice = (book.price ?? 0) * quantity;
    if (userPoints < totalPrice) {
      alert("포인트가 부족합니다.");
      return;
    }

    if (!window.confirm(`${book.title} ${quantity}권을 결제하시겠습니까?`))
      return;

    try {
      const payload = {
        bookId: book.bookId,
        quantity,
        usedPoint: totalPrice,
      };
      const result = await orderAPI.checkout(payload);
      if (result?.orderId) {
        alert("결제가 완료되었습니다.");
        navigate("/order/result", { state: { order: result } });
      } else alert("결제 처리 중 오류 발생");
    } catch {
      alert("서버 통신 중 오류 발생");
    }
  };

  if (isLoading || !book)
    return <div className={styles.loading}>로딩중...</div>;

  const isSoldOut = (book.stock ?? 0) <= 0;

  return (
    <div className={`${styles.detail} ${isSoldOut ? styles.soldOut : ""}`}>
      <div className={styles.hero}>
        <img src={previewSrc} alt={book?.title} />
        {isSoldOut && <div className={styles.soldoutMark}>품절</div>}
        <div className={styles.overlay}>
          <h2>{book?.title}</h2>
          <p>{book?.authorName}</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.thumb}>
            <img src={previewSrc} alt={book?.title} />
            {isAdmin && (
              <label className={styles.fileLabel}>
                이미지 변경
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          <div className={styles.bottom}>
            <div className={styles.left}>
              <div className={styles.fields}>
                <InputField
                  id="bookTitle"
                  label="도서명"
                  name="title"
                  value={book?.title ?? ""}
                  onChange={onFieldChange}
                  editable={isAdmin}
                />
                <InputField
                  id="bookAuthor"
                  label="저자"
                  name="authorName"
                  value={book?.authorName ?? ""}
                  onChange={onFieldChange}
                  editable={isAdmin}
                />
                <InputField
                  id="bookPrice"
                  label="포인트"
                  name="price"
                  value={book?.price ?? ""}
                  onChange={onFieldChange}
                  editable={isAdmin}
                />
                {isAdmin && (
                  <>
                    <InputField
                      id="bookStock"
                      label="재고"
                      name="stock"
                      value={book?.stock ?? ""}
                      onChange={onFieldChange}
                      editable
                    />
                    <InputField
                      id="bookDate"
                      label="등록일"
                      name="createDate"
                      value={book?.createDate?.substring(0, 10) ?? ""}
                      editable={false}
                    />
                  </>
                )}
              </div>

              {isAdmin ? (
                <div className={styles.actions}>
                  <button
                    className={styles.primaryBtn}
                    onClick={handleUpdate}
                    disabled={saving}
                  >
                    {saving ? "저장중..." : "수정"}
                  </button>
                  <button className={styles.dangerBtn} onClick={handleDelete}>
                    삭제
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.purchase}>
                    <div className={styles.quantity}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        disabled={isSoldOut}
                      >
                        -
                      </button>
                      <span className={styles.qtyValue}>{quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => setQuantity((prev) => prev + 1)}
                        disabled={isSoldOut}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={styles.cartBtn}
                      onClick={handleAddToCart}
                      disabled={isSoldOut}
                    >
                      {isSoldOut ? "품절" : "장바구니 담기"}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className={styles.cartSmy}>
              {!isAdmin && !isSoldOut && (
                <CartSummary
                  totalPrice={(book.price ?? 0) * quantity}
                  userPoints={userPoints}
                  remainPoint={Math.max(
                    userPoints - (book.price ?? 0) * quantity,
                    0
                  )}
                  showSelectedCount={false}
                  onCheckout={handleBuyNow}
                  disabled={quantity < 1}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
