import axios from "axios";
import { authStore } from "../store/authStore";

const api = axios.create();

//  요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = authStore.getState().token;

    //  파일 업로드면 form-data, 그 외엔 json으로
    const isFormData =
      config.data instanceof FormData ||
      (config.headers["Content-Type"] &&
        config.headers["Content-Type"].includes("multipart/form-data"));

    if (!isFormData) {
      // 기본값을 application/json으로 설정
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    //  토큰 자동 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
