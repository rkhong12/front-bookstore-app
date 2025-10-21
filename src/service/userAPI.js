import api from "../api/axiosApi";

export const userAPI = {
  /** 회원 목록 조회 (관리자 전용) */
  list: async (page = 0, size = 10) => {
    const res = await api.get(`/api/v1/admin/users`, {
      params: { page, size },
    });
    return res.data.response;
  },

  /** 포인트 수정 (관리자) */
  updatePoint: async ({ userId, point }) => {
    const res = await api.put(`/api/v1/admin/users/${userId}/point`, { point });
    return res.data.response;
  },

  /** 회원 상태 변경 (관리자) */
  updateStatus: async ({ userId, useYn, delYn }) => {
    const res = await api.patch(`/api/v1/admin/users/${userId}`, null, {
      params: { useYn, delYn },
    });
    return res.data.response;
  },

  /** 마이페이지 - 로그인 유저 정보 조회 */
  detail: async () => {
    const res = await api.get("/api/v1/users/me");
    return res.data;
  },

  /** 마이페이지 - 내 정보 수정 */
  updateUser: async (data) => {
    const res = await api.put("/api/v1/users/me", data);
    return res.data.response;
  },
};
