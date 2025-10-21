import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLogin } from "../../hooks/useLogin";
import styles from "./Login.module.scss";

//  yup 스키마
const schema = yup.object().shape({
  username: yup.string().required("아이디를 입력하십시오"),
  password: yup.string().required("패스워드를 입력하십시오"),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const loginMutation = useLogin();
  const [loginError, setLoginError] = useState("");

  const goLogin = async (formData) => {
    setLoginError("");

    try {
      //  form에서 입력받은 username/password → 백엔드에서 userId/passwd로 받도록 변환
      const credentials = new URLSearchParams();
      credentials.append("userId", formData.username);
      credentials.append("passwd", formData.password);

      await loginMutation.mutateAsync(credentials);
      // 성공 시에는 useLogin의 onSuccess가 실행됨 → navigate("/notice")
    } catch (error) {
      //  에러 객체 구조 파싱
      const status = error?.response?.status || error?.status || 0;
      const data = error?.response?.data || error;
      const message =
        data?.error ||
        data?.message ||
        data?.resultMsg ||
        "처리 중 오류가 발생했습니다.";

      //  분기 처리
      if (
        status === 401 ||
        message.includes("아이디") ||
        message.includes("패스워드")
      ) {
        alert("아이디 또는 패스워드가 일치하지 않습니다.");
      } else if (status === 400) {
        alert("입력한 정보가 잘못되었습니다.");
      } else {
        alert("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }

      setLoginError(message);
    }
  };

  return (
    <section className={styles.login}>
      <div className={styles.wrap}>
        <h1 className={styles.title}>로그인</h1>

        <form className={styles.form} onSubmit={handleSubmit(goLogin)}>
          <div className={styles.field}>
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              {...register("username")}
              placeholder="아이디를 입력하세요"
              autoComplete="username"
            />
            {errors.username && (
              <p className={styles.error}>{errors.username.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">패스워드</label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="패스워드를 입력하세요"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          {loginError && <p className={styles.error}>{loginError}</p>}

          <button
            type="submit"
            className={styles.btn}
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </section>
  );
}
