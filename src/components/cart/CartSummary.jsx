import React from "react";

export default function CartSummary({
  totalPrice = 0,
  userPoints = 0,
  remainPoint = 0,
  selectedCount = 0,
  showSelectedCount = true,
  onCheckout,
  disabled = false,
}) {
  return (
    <div className="cart__summary">
      {showSelectedCount && (
        <div className="cart__summary-left">
          <p>
            선택된 상품 <strong>{selectedCount}</strong>개
          </p>
        </div>
      )}

      <div className="cart__summary-right">
        <div className="cart__points">
          <div className="cart__points-row">
            <span>보유 포인트</span>
            <strong>{userPoints.toLocaleString()} P</strong>
          </div>
          <div className="cart__points-row">
            <span>총 결제 포인트</span>
            <strong>{totalPrice.toLocaleString()} P</strong>
          </div>
          <div className="cart__points-row total">
            <span>결제 후 남는 포인트</span>
            <strong>{remainPoint.toLocaleString()} P</strong>
          </div>
        </div>

        <div className="cart__btn-group">
          <button
            className="cart__btn"
            disabled={disabled}
            onClick={onCheckout}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
