import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderAPI } from "../service/orderAPI";
import { useNavigate } from "react-router-dom";

export const useOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  //  결제 요청
  const checkoutMutation = useMutation({
    mutationFn: (data) => orderAPI.checkout(data),
    onSuccess: (res) => {
      console.log(" 결제 성공:", res.data.response);

      //  캐시 초기화 (장바구니 최신화)
      queryClient.invalidateQueries(["cart"]);

      //  결제 완료 페이지로 이동 + 주문 데이터 전달
      navigate("/order/success", {
        state: { order: res.data.response },
      });
    },
    onError: (error) => {
      console.error(" 결제 실패:", error);
      alert(error.response?.data?.message || "결제에 실패했습니다.");
    },
  });

  return { checkoutMutation };
};
