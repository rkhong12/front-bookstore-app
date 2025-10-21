import React, { useState } from "react";
import styles from "./BookCreate.module.scss"; // ✅ 모듈 import
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { authStore } from "../../store/authStore";
import { useBook } from "../../hooks/useBook";
import InputField from "../../components/common/InputField";

const schema = yup.object().shape({
  title: yup.string().required("도서명을 입력하세요."),
  authorName: yup.string().required("저자명을 입력하세요."),
  price: yup
    .number()
    .typeError("포인트는 숫자만 입력 가능합니다.")
    .required("포인트를 입력하세요."),
  stock: yup
    .number()
    .typeError("재고는 숫자만 입력 가능합니다.")
    .required("재고를 입력하세요."),
});

export default function BookCreate() {
  const navigate = useNavigate();
  const { userRole } = authStore.getState();
  const isAdmin = userRole === "ROLE_ADMIN";
  const { createBookMutation } = useBook();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const [previewSrc, setPreviewSrc] = useState(null);
  const [fileObj, setFileObj] = useState(null);

  if (!isAdmin) {
    return <div className={styles.denied}>접근 권한이 없습니다.</div>;
  }

  const onImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewSrc(URL.createObjectURL(file));
    setFileObj(file);
  };

  const handleCreate = async (data) => {
    if (!window.confirm("새로운 도서를 등록하시겠습니까?")) return;

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("authorName", data.authorName);
    if (fileObj) formData.append("files", fileObj);

    try {
      await createBookMutation.mutateAsync(formData);
      alert("도서가 등록되었습니다.");
      reset();
      navigate("/book");
    } catch (error) {
      console.error("등록 실패:", error);
      alert("도서 등록 중 오류 발생");
    }
  };

  return (
    <section className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>도서 등록</h2>
        <p className={styles.desc}>신규 도서를 등록하고 목록에 반영합니다.</p>
      </div>

      {/* 폼 */}
      <form className={styles.form} onSubmit={handleSubmit(handleCreate)}>
        <div className={styles.columns}>
          {/* 왼쪽: 미리보기 */}
          <div className={styles.preview}>
            {previewSrc ? (
              <img src={previewSrc} alt="도서 미리보기" />
            ) : (
              <div className={styles.placeholder}>이미지 미리보기 없음</div>
            )}
            <label className={styles.fileLabel}>
              이미지 선택
              <input type="file" accept="image/*" onChange={onImageSelect} />
            </label>
          </div>

          {/* 오른쪽: 입력 필드 */}
          <div className={styles.fields}>
            <InputField
              id="title"
              label="도서명"
              placeholder="도서명을 입력하세요"
              error={errors.title?.message}
              editable={true}
              {...register("title")}
            />
            <InputField
              id="authorName"
              label="저자명"
              placeholder="저자명을 입력하세요"
              error={errors.authorName?.message}
              editable={true}
              {...register("authorName")}
            />
            <InputField
              id="price"
              label="포인트"
              type="number"
              placeholder="포인트를 입력하세요"
              error={errors.price?.message}
              editable={true}
              {...register("price")}
            />
            <InputField
              id="stock"
              label="재고"
              type="number"
              placeholder="재고 수량을 입력하세요"
              error={errors.stock?.message}
              editable={true}
              {...register("stock")}
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className={styles.actions}>
          <button type="submit" className={styles.primaryBtn}>
            등록 완료
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </section>
  );
}
