import React, { useState, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../hooks/useUser";
import { authStore } from "../../store/authStore";
import styles from "./UserList.module.scss";

export default function UserList() {
  const { userRole } = authStore.getState();
  const isAdmin = userRole === "ROLE_ADMIN";

  const [page, setPage] = useState(0);
  const { users, isLoading, updatePoint } = useUser(page, 10);
  const [editedPoints, setEditedPoints] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const queryClient = useQueryClient();

  const content = Array.isArray(users?.content?.content)
    ? users.content.content
    : [];

  const totalPages = users?.totalPages ?? 1;

  /** 행 선택 */
  const handleRowSelect = useCallback((userId) => {
    if (userId === "admin") return;
    setSelectedRows((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  /** 포인트 입력 */
  const handleChange = useCallback((id, value) => {
    setEditedPoints((prev) => ({ ...prev, [id]: value }));
  }, []);

  /** 선택 저장 */
  const handleSaveAll = async () => {
    if (selectedRows.length === 0) return alert("수정할 회원을 선택하세요.");

    const updates = selectedRows.map((id) => ({
      userId: id,
      point: Number(editedPoints[id] || 0),
    }));

    try {
      await Promise.all(updates.map((u) => updatePoint.mutateAsync(u)));
      await queryClient.invalidateQueries(["users"]);
      alert("선택한 회원의 포인트가 수정되었습니다.");
      setSelectedRows([]);
      setEditedPoints({});
    } catch (err) {
      console.error(err);
      alert("포인트 수정 중 오류가 발생했습니다.");
    }
  };

  /** 페이지 이동 */
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  /** 페이지 그룹 (5개씩) */
  const pageGroup = useMemo(() => {
    const groupSize = 5;
    const start = Math.floor(page / groupSize) * groupSize;
    const end = Math.min(start + groupSize, totalPages);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }, [page, totalPages]);

  return (
    <section className={styles.userList}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>회원 관리</h2>
          <p className={styles.desc}>회원 포인트 부여 및 정보 조회</p>
        </div>
        {isAdmin && (
          <button
            className={styles.saveBtn}
            onClick={handleSaveAll}
            disabled={selectedRows.length === 0}
          >
            선택 회원 저장
          </button>
        )}
      </header>

      {isLoading ? (
        <div className={styles.loading}>회원 목록 불러오는 중...</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <colgroup>
              <col width="12%" />
              <col width="12%" />
              <col width="20%" />
              <col width="16%" />
              <col width="10%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>
            <thead>
              <tr>
                <th>아이디</th>
                <th>이름</th>
                <th>이메일</th>
                <th>전화번호</th>
                <th>권한</th>
                <th>가입일</th>
                <th>포인트</th>
              </tr>
            </thead>
            <tbody>
              {content.length > 0 ? (
                content.map((user) => {
                  const isSelected = selectedRows.includes(user.userId);
                  const isAdminUser = user.userId === "admin";

                  return (
                    <tr
                      key={user.userId}
                      className={`${isSelected ? styles.selected : ""} ${
                        isAdminUser ? styles.disabledRow : ""
                      }`}
                      onClick={() => handleRowSelect(user.userId)}
                    >
                      <td>{user.userId}</td>
                      <td>{user.userName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.userRole?.replace("ROLE_", "")}</td>
                      <td>{user.createDate?.split("T")[0]}</td>
                      <td>
                        <input
                          type="number"
                          className={styles.pointInput}
                          value={editedPoints[user.userId] ?? user.point ?? 0}
                          onChange={(e) =>
                            handleChange(
                              user.userId,
                              Number(e.target.value || 0)
                            )
                          }
                          disabled={!isSelected || isAdminUser}
                          readOnly={isAdminUser}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    회원 정보가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 페이지네이션 */}
      <div className={styles.pagination}>
        <button onClick={() => handlePageChange(0)} disabled={page === 0}>
          {"<<"}
        </button>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          {"<"}
        </button>

        {pageGroup.map((num) => (
          <button
            key={num}
            className={`${styles.pageBtn} ${page === num ? styles.active : ""}`}
            onClick={() => handlePageChange(num)}
          >
            {num + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page + 1 >= totalPages}
        >
          {">"}
        </button>
        <button
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={page + 1 >= totalPages}
        >
          {">>"}
        </button>
      </div>
    </section>
  );
}
