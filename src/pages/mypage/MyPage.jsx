import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCoins, FaUserCircle } from "react-icons/fa";
import styles from "./MyPage.module.scss";
import { authStore } from "../../store/authStore";
import { userAPI } from "../../service/userAPI";
import { orderAPI } from "../../service/orderAPI";
import InputField from "../../components/common/InputField";
import OrderList from "../../components/order/OrderList";
import { useQueryClient } from "@tanstack/react-query"; // ✅ 추가

export default function MyPage() {
  const { userId, userRole } = authStore.getState();
  const isUser = userRole === "ROLE_USER";

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const queryClient = useQueryClient(); // ✅ 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await userAPI.detail();
        setUser(userRes.response);
        setFormData(userRes.response);

        if (isUser) {
          const orderRes = await orderAPI.getMyOrders();
          setOrders(orderRes || []);
        }
      } catch (err) {
        console.error("MyPage fetch error:", err);
        alert("정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, isUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const updated = await userAPI.updateUser(formData);
      setUser(updated);
      setFormData(updated);

      // ✅ 캐시 무효화 (UserList 최신화)
      await queryClient.invalidateQueries(["users"]);

      alert("회원 정보가 수정되었습니다.");
    } catch (err) {
      console.error("User update error:", err);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className={styles.loading}>회원 정보를 불러오는 중입니다...</div>
    );

  if (!user)
    return <div className={styles.error}>회원 정보를 찾을 수 없습니다.</div>;

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className={styles.profile}>
        <div className={styles.avatar}>
          <FaUserCircle />
        </div>
        <div className={styles.info}>
          <h2>{user.userName}</h2>
          <p>@{user.userId}</p>

          {isUser && (
            <div className={styles.point}>
              <FaCoins />
              <span>{user.point?.toLocaleString() ?? 0} P</span>
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.title}>내 정보</h3>
        <div className={styles.form}>
          <InputField
            label="이메일"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            editable
          />
          <InputField
            label="전화번호"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            editable
          />
          <InputField
            label="주소"
            name="addr"
            value={formData.addr || ""}
            onChange={handleChange}
            editable
          />
          <InputField
            label="상세주소"
            name="addrDetail"
            value={formData.addrDetail || ""}
            onChange={handleChange}
            editable
          />
        </div>
        <div className={styles.actions}>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "저장 중..." : "수정"}
          </button>
        </div>
      </section>

      {isUser && (
        <section className={styles.orders}>
          <div className={styles.ordersHeader}>
            <h3 className={styles.title}>최근 주문 내역</h3>
            {orders.length > 0 && (
              <p className={styles.count}>{orders.length}건</p>
            )}
          </div>
          {orders.length === 0 ? (
            <p className={styles.noOrders}>주문 내역이 없습니다.</p>
          ) : (
            <OrderList orders={orders} compact />
          )}
        </section>
      )}
    </motion.div>
  );
}
