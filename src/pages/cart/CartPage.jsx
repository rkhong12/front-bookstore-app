import React, { useEffect, useState } from "react";
import styles from "./CartPage.module.scss";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { cartAPI } from "../../service/cartAPI";
import { authStore } from "../../store/authStore";
import { getAbsoluteImageUrl } from "../../utils/imageUtils";
import { userAPI } from "../../service/userAPI";
import { orderAPI } from "../../service/orderAPI";
import { useNavigate } from "react-router";
import CartSummary from "../../components/cart/CartSummary";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await cartAPI.getCart();
      const arr = Array.isArray(data) ? data : data?.response ?? [];
      setCart(arr);
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await userAPI.detail();
      const info = res?.response;
      setUser(info);
      setUserPoints(info?.point ?? 0);
    } catch {
      setUserPoints(0);
    }
  };

  useEffect(() => {
    const token = authStore.getState().token;
    if (!token) {
      setLoading(false);
      return;
    }
    fetchCart();
    fetchUser();
  }, []);

  const handleRemove = async (itemIds) => {
    const ids = Array.isArray(itemIds) ? itemIds : [itemIds];
    if (!window.confirm(`선택한 ${ids.length}개 상품을 삭제하시겠습니까?`))
      return;
    try {
      for (const id of ids) await cartAPI.removeFromCart(id);
      setCart((prev) => prev.filter((item) => !ids.includes(item.itemId)));
      setSelectedItems((prev) => prev.filter((id) => !ids.includes(id)));
    } catch {
      alert("삭제 중 오류 발생");
    }
  };

  const handleQuantityChange = async (itemId, amount) => {
    setCart((prev) =>
      prev.map((item) =>
        item.itemId === itemId
          ? { ...item, quantity: Math.max(1, (item.quantity ?? 1) + amount) }
          : item
      )
    );
    try {
      const target = cart.find((i) => i.itemId === itemId);
      if (target) {
        const newQty = Math.max(1, (target.quantity ?? 1) + amount);
        await cartAPI.updateQuantity(itemId, newQty);
      }
    } catch (err) {
      console.error("수량 변경 실패:", err);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.itemId));
    }
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedItems.reduce((sum, id) => {
    const item = cart.find((i) => i.itemId === id);
    if (!item) return sum;
    const price = item.price ?? item.book?.price ?? 0;
    return sum + price * (item.quantity ?? 1);
  }, 0);

  const handleCheckout = async (targetItems) => {
    if (!targetItems.length) {
      alert("결제할 상품을 선택해주세요.");
      return;
    }
    if (!window.confirm(`${targetItems.length}개의 상품을 결제하시겠습니까?`))
      return;

    try {
      const payload = { itemIds: targetItems, usedPoint: totalPrice };
      const data = await orderAPI.checkout(payload);
      if (!data?.orderId) {
        alert("주문 정보가 올바르지 않습니다.");
        return;
      }
      const newPoint = Math.max(userPoints - totalPrice, 0);
      await userAPI.updateUser({ ...user, point: newPoint });
      setUserPoints(newPoint);
      navigate("/order/result", { state: { order: data } });
      await fetchCart();
    } catch {
      alert("결제 중 오류 발생");
    }
  };

  if (loading) return <p className={styles.loading}>불러오는 중...</p>;

  if (!cart.length) {
    return (
      <div className={styles.empty}>
        <FaShoppingCart size={50} color="#ccc" />
        <p>장바구니가 비어 있습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.cart}>
      <div className={styles.header}>
        <h2>장바구니</h2>
        <button
          className={styles.deleteBtn}
          onClick={() => handleRemove(selectedItems)}
          disabled={!selectedItems.length}
        >
          선택 삭제
        </button>
      </div>

      <table className={styles.table}>
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "40%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedItems.length === cart.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th colSpan="2">상품 정보</th>
            <th>수량</th>
            <th>포인트</th>
            <th>삭제</th>
          </tr>
        </thead>

        <tbody>
          {cart.map((item) => {
            const id = item.itemId ?? item.cartItemId;
            const isSelected = selectedItems.includes(id);
            const title = item.title ?? item.book?.title ?? "제목 없음";
            const author =
              item.authorName ?? item.book?.author?.authorName ?? "작자미상";
            const price = item.price ?? item.book?.price ?? 0;
            const qty = item.quantity ?? 1;
            const imgPath = item.imgPath ?? item.book?.imgPath ?? null;

            return (
              <tr
                key={id}
                className={`${styles.row} ${
                  isSelected ? styles.selectedRow : ""
                }`}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(id)}
                  />
                </td>
                <td className={styles.thumb}>
                  <img src={getAbsoluteImageUrl(imgPath)} alt={title} />
                </td>
                <td className={styles.info}>
                  <div className={styles.title}>{title}</div>
                  <div className={styles.author}>{author}</div>
                </td>
                <td className={styles.qty}>
                  <button onClick={() => handleQuantityChange(id, -1)}>
                    -
                  </button>
                  <span>{qty}</span>
                  <button onClick={() => handleQuantityChange(id, 1)}>+</button>
                </td>
                <td className={styles.price}>
                  {(price * qty).toLocaleString()} P
                </td>
                <td className={styles.remove}>
                  <button onClick={() => handleRemove(id)}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <CartSummary
        totalPrice={totalPrice}
        userPoints={userPoints}
        remainPoint={Math.max(userPoints - totalPrice, 0)}
        selectedCount={selectedItems.length}
        onCheckout={() => handleCheckout(selectedItems)}
        disabled={!selectedItems.length}
      />
    </div>
  );
}
