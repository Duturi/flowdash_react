const Modal = ({ type, isOpen, onClose, data, setData, onSave, onDelete }) => {
  if (!isOpen) return null;

  // 수정 모달 렌더링
  if (type === "edit") {
    return (
      <div className="modal-overlay" style={{ display: "flex" }}>
        <div className="modal-change-content light">
          <span className="todo-change">할 일 수정</span>
          <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
            <label className="title">제목*</label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />

            <label className="content">내용</label>
            <textarea
              value={data.content || ""}
              onChange={(e) => setData({ ...data, content: e.target.value })}
            />
          </form>

          <div className="importance-btn-box">
            {["high", "mid", "low"].map((p) => (
              <button
                key={p}
                className={`importance-btn ${data.priority === p ? "active" : ""}`}
                onClick={() => setData({ ...data, priority: p })}
              >
                {p === "high" ? "높음" : p === "mid" ? "중간" : "낮음"}
              </button>
            ))}

            <select
              className="status-modal light"
              value={data.status || "todo"}
              onChange={(e) => setData({ ...data, status: e.target.value })}
            >
              <option value="todo">할 일</option>
              <option value="doing">진행 중</option>
              <option value="done">완료</option>
            </select>
          </div>

          <div className="change-modal-btn-box">
            <button className="change-modal-cancle light" onClick={onClose}>
              취소
            </button>
            <button className="change-modal-save" onClick={onSave}>
              저장하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 삭제 모달 렌더링
  if (type === "delete") {
    return (
      <div className="modal-overlay" style={{ display: "flex" }}>
        <div className="modal-reset-content light">
          <div className="reset-modal-text">
            <h3>이 할 일을 정말로 삭제하시겠습니까?</h3>
            <p>삭제된 할 일은 복구할 수 없습니다.</p>
          </div>
          <div className="reset-modal-buttons">
            <button id="delete-btn-clear" onClick={onDelete}>
              삭제
            </button>
            <button id="delete-btn-close" onClick={onClose}>
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Modal;
