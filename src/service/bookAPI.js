import api from "../api/axiosApi";

const unwrap = (res) => {
  const payload = res?.data ?? res;
  return payload?.response ?? payload;
};

export const bookAPI = {
  /** 📚 전체 목록 */
  list: async (offset = 0, limit = 12) => {
    const response = await api.get(`/api/v1/book/list`, {
      params: { offset, limit },
    });
    return unwrap(response);
  },

  /** ⭐ 베스트 도서 */
  best: async () => {
    const response = await api.get(`/api/v1/book/best`);
    return unwrap(response);
  },

  /**  도서 검색 */
  search: async (keyword) => {
    if (!keyword || keyword.trim() === "") return [];
    const response = await api.get(`/api/v1/book/search`, {
      params: { keyword },
    });
    return unwrap(response);
  },

  /** 📖 상세 조회 */
  get: async (bookId) => {
    const response = await api.get(`/api/v1/book/${bookId}`);
    return unwrap(response);
  },

  /** 🆕 도서 등록 (이미지 포함) */
  create: async (formData) => {
    const response = await api.post(`/api/v1/book`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap(response);
  },

  /** ✏️ 도서 수정 (이미지 포함) */
  update: async (bookId, formData) => {
    const response = await api.put(`/api/v1/book/${bookId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap(response);
  },

  /**  도서 삭제 */
  delete: async (bookId) => {
    const response = await api.delete(`/api/v1/book/${bookId}`);
    return unwrap(response);
  },
};
