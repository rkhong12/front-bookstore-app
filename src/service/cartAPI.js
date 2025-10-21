import api from "../api/axiosApi";

/**  공통 응답 언래핑 함수 */
const unwrap = (res) => {
  const payload = res?.data ?? res;
  return payload?.response ?? payload;
};

export const cartAPI = {
  /**  장바구니 담기 */
  addToCart: async (bookId, quantity) => {
    const response = await api.post("/api/v1/cart", { bookId, quantity });
    return unwrap(response);
  },

  /**  장바구니 조회 */
  getCart: async () => {
    const response = await api.get("/api/v1/cart");
    return unwrap(response);
  },

  /**  장바구니 항목 삭제 */
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/api/v1/cart/${itemId}`);
    return unwrap(response);
  },

  /** 🔁 장바구니 수량 변경 */
  updateQuantity: async (itemId, quantity) => {
    const response = await api.patch(`/api/v1/cart/${itemId}`, { quantity });
    return unwrap(response);
  },

  /** 💳 결제 요청 (포인트 차감 결제) */
  checkout: async (itemIds) => {
    // itemIds: 선택된 장바구니 itemId 배열
    const response = await api.post("/api/v1/order", { itemIds });
    return unwrap(response); // { orderId, totalPrice, remainPoint, items }
  },
};
