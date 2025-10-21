import api from "../api/axiosApi";

/** 공통 응답 언래핑 함수 */
const unwrap = (res) => {
  const payload = res?.data ?? res;
  return payload?.response ?? payload;
};

/** 주문 관련 API */
export const orderAPI = {
  checkout: async ({
    itemIds = [],
    bookId = null,
    quantity = 0,
    usedPoint = 0,
  }) => {
    const response = await api.post("/api/v1/order", {
      itemIds,
      bookId,
      quantity,
      usedPoint,
    });
    return unwrap(response); // { orderId, totalPrice, remainPoint, items }
  },

  /** 내 주문 내역 조회 */
  getMyOrders: async () => {
    const response = await api.get("/api/v1/order/me");
    return unwrap(response); // [{ orderId, totalPrice, usedPoint, remainPoint, items: [...] }]
  },
};
