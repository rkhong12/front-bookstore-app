import { authStore } from "../store/authStore";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import api from "../api/axiosApi";
import { useNavigate } from "react-router";

// hook은 use로 시작해야 함
export const useLogin = () => {
  const { setLogin } = authStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials) => {
      console.log("전송 데이터 확인:", credentials);
      try {
        const response = await api.post("/api/v1/login", credentials, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    onSuccess: (data) => {
      console.log("로그인 성공", data);
      queryClient.invalidateQueries({ queryKey: ["loginUser"] });
      setLogin(data.content); // 토큰, 유저정보 저장
      console.log(authStore.getState());
      navigate("/book");
    },
    onError: (error) => {
      console.error("Login 실패", error);
    },
  });
};
