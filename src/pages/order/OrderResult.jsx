import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import styles from "./OrderResult.module.scss";
import OrderList from "../../components/order/OrderList";

export default function OrderResult() {
  const { state } = useLocation();
  const order = state?.order;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (order) setOrders([order]);
  }, [order]);

  if (!order) {
    return (
      <div className={styles.empty}>
        <p>주문 정보가 없습니다.</p>
        <Link to="/book" className={styles.linkBtn}>
          도서 목록으로 이동
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.result}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.icon}>
        <CheckCircle size={72} strokeWidth={1.5} />
      </div>

      <h2 className={styles.title}>주문이 완료되었습니다!</h2>
      <p className={styles.desc}>
        주문하신 도서는 빠르게 준비하여 발송됩니다.
        <br />
        이용해 주셔서 감사합니다.
      </p>

      <OrderList orders={orders} />

      <div className={styles.buttons}>
        <Link to="/book" className={`${styles.btn} ${styles.mainBtn}`}>
          도서 목록
        </Link>
        <Link to="/mypage" className={`${styles.btn} ${styles.subBtn}`}>
          마이페이지
        </Link>
      </div>
    </motion.div>
  );
}
