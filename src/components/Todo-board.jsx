import { useState, useEffect, useMemo } from "react";

const TODO_KEY = "flowdash-todos";

const TodoBoard = () => {
  // --- 1. 상태 관리 (State) ---
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // 입력 폼 상태
  const [newTodo, setNewTodo] = useState({
    title: "",
    content: "",
    status: "todo",
    priority: "mid",
  });

  // 정렬 상태
  const [ascending, setAscending] = useState(true);

  // --- 2. 초기 데이터 로드 ---
  useEffect(() => {
    const saved = localStorage.getItem(TODO_KEY);
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // 로컬스토리지 저장 (todos가 변할 때마다 실행)
  useEffect(() => {
    localStorage.setItem(TODO_KEY, JSON.stringify(todos));
  }, [todos]);

  // --- 3. 계산된 데이터 (Derived State) ---
  // 별도의 render 함수 없이, todos가 변하면 자동으로 계산됩니다.
  const counts = useMemo(() => {
    const todo = todos.filter((t) => t.status === "todo").length;
    const doing = todos.filter((t) => t.status === "doing").length;
    const done = todos.filter((t) => t.status === "done").length;
    const total = todos.length;
    const achievement = total > 0 ? Math.floor((done / total) * 100) : 0;

    return { todo, doing, done, total, achievement };
  }, [todos]);

  // 정렬 및 필터링된 리스트
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) =>
      ascending
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title),
    );
  }, [todos, ascending]);

  // --- 4. 주요 핸들러 함수 ---
  const handleAddTodo = () => {
    if (!newTodo.title.trim()) {
      alert("제목을 입력해주세요!");
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleString("ko-KR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const item = {
      ...newTodo,
      id: Date.now(),
      createdAt: formattedDate,
      updatedAt: null,
      completedAt: null,
    };

    setTodos([...todos, item]);
    setIsModalOpen(false);
    setNewTodo({ title: "", content: "", status: "todo", priority: "mid" }); // 초기화
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearAllData = () => {
    setTodos([]);
    setIsResetModalOpen(false);
    localStorage.removeItem(TODO_KEY);
  };

  // --- 5. UI 렌더링 ---
  return (
    <div className="flowdash-container">
      {/* 상단 카테고리/대시보드 영역 */}
      <section className="dashboard">
        <div>To Do: {counts.todo}</div>
        <div>In Progress: {counts.doing}</div>
        <div>Done: {counts.done}</div>
        <div>Total: {counts.total}</div>
        <div>달성률: {counts.achievement}%</div>
      </section>

      {/* 컨트롤 버튼 */}
      <div className="controls">
        <button onClick={() => setIsModalOpen(true)} className="add-btn">
          할 일 추가
        </button>
        <button onClick={() => setAscending(!ascending)}>
          {ascending ? "정렬 : ↑ 오름차순" : "정렬 : ↓ 내림차순"}
        </button>
        <button onClick={() => setIsResetModalOpen(true)}>전체 초기화</button>
      </div>

      {/* 보드 영역 */}
      <div className="boards" style={{ display: "flex", gap: "20px" }}>
        {["todo", "doing", "done"].map((status) => (
          <div key={status} className={`${status}-board`}>
            <h3>
              {status.toUpperCase()} (
              {todos.filter((t) => t.status === status).length})
            </h3>
            <ul className="todo-list-container">
              {sortedTodos
                .filter((t) => t.status === status)
                .map((todo) => (
                  <li
                    key={todo.id}
                    className={`todo-item ${todo.status === "done" ? "opacity" : ""}`}
                  >
                    <div className="todo-info">
                      <span className={`priority-${todo.priority}`}>
                        {todo.priority === "high"
                          ? "높음"
                          : todo.priority === "mid"
                            ? "중간"
                            : "낮음"}
                      </span>
                      <button onClick={() => deleteTodo(todo.id)}>X</button>
                      <h3>{todo.title}</h3>
                      <p>{todo.content}</p>
                      <small>생성: {todo.createdAt}</small>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 추가 모달 (조건부 렌더링) */}
      {isModalOpen && (
        <div id="todo-modal" className="modal">
          <input
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            placeholder="제목"
          />
          <textarea
            value={newTodo.content}
            onChange={(e) =>
              setNewTodo({ ...newTodo, content: e.target.value })
            }
            placeholder="내용"
          />
          <select
            value={newTodo.priority}
            onChange={(e) =>
              setNewTodo({ ...newTodo, priority: e.target.value })
            }
          >
            <option value="high">높음</option>
            <option value="mid">중간</option>
            <option value="low">낮음</option>
          </select>
          <button onClick={handleAddTodo}>추가</button>
          <button onClick={() => setIsModalOpen(false)}>닫기</button>
        </div>
      )}

      {/* 초기화 확인 모달 */}
      {isResetModalOpen && (
        <div id="reset-modal" className="modal">
          <p>전체 데이터를 삭제하시겠습니까?</p>
          <button onClick={clearAllData}>삭제</button>
          <button onClick={() => setIsResetModalOpen(false)}>취소</button>
        </div>
      )}
    </div>
  );
};

export default TodoBoard;
