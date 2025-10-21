// src/hooks/useBook.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookAPI } from "../service/bookAPI";

export const useBook = () => {
  const queryClient = useQueryClient();

  /** 도서 등록 */
  const createBookMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await bookAPI.create(formData);
      return res?.response ?? res;
    },
    onSuccess: (data) => {
      console.log("도서 등록 완료:", data);
      queryClient.invalidateQueries({ queryKey: ["book"] });
    },
    onError: (err) => {
      console.error("도서 등록 실패:", err);
    },
  });

  /** 도서 수정 */
  const updateBookMutation = useMutation({
    mutationFn: async ({ bookId, formData }) => {
      const res = await bookAPI.update(bookId, formData);
      return res?.response ?? res;
    },
    onSuccess: (data) => {
      console.log("도서 수정 완료:", data);
      queryClient.invalidateQueries({ queryKey: ["book"] });
    },
    onError: (err) => {
      console.error("도서 수정 실패:", err);
    },
  });

  /** 도서 삭제 (캐시 정리 포함) */
  const deleteBookMutation = useMutation({
    mutationFn: async (bookId) => {
      const res = await bookAPI.delete(bookId);
      return res?.response ?? res;
    },
    onSuccess: (data, bookId) => {
      console.log("도서 삭제 완료:", data);
      queryClient.removeQueries({ queryKey: ["book", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book"] });
    },
    onError: (err) => {
      console.error("도서 삭제 실패:", err);
    },
  });

  return { createBookMutation, updateBookMutation, deleteBookMutation };
};
