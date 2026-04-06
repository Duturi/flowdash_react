import Filter from "./components/filter";
import { useState, useEffect } from "react";
import TodoBoard from "./components/Todo-board";
import Modal from "./components/modal";
import NickName from "./components/nickName";
import { useDarkMode } from "./hooks/useDarkMode";
import { useStorage } from "./hooks/useStorage";

function App() {
  const [isDark, toggleTheme] = useDarkMode();

  const [todos, setTodos] = useStorage("TODO_KEY", []);
  const [filterValue, setFilterValue] = useStorage("flowdash-sticker", {
    date: "all",
    priority: "all",
    keyword: "",
    sort: "asc",
  });

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
  });
  const [currentTodo, setCurrentTodo] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");

  const openDeleteModal = (id) => {
    setCurrentTodo({ id });
    setModalState({ type: "delete", isOpen: true });
  };

  const handleSaveEdit = () => {
    const updatedTodos = todos.map((t) =>
      t.id === currentTodo.id ? currentTodo : t,
    );
    setTodos(updatedTodos);
    localStorage.setItem("TODO_KEY", JSON.stringify(updatedTodos));
    setModalState({ type: null, isOpen: false });
  };

  const handleDelete = () => {
    const updatedTodos = todos.filter((t) => t.id !== currentTodo.id);
    setTodos(updatedTodos);
    localStorage.setItem("TODO_KEY", JSON.stringify(updatedTodos));
    setModalState({ type: null, isOpen: false });
  };

  return (
    <section className="container">
      <section className="header">
        <section className="greet-box light">
          <div className="greet-text">
            <NickName />
            <div>
              <span>OOO님 좋은 하루예요</span>
            </div>
            <span className="today-date">{time.toLocaleDateString()}</span>
          </div>
          <button className="theme-btn light">💤</button>
        </section>

        <section className="timer-box">
          <div className="time-hour1 time-box light">{hours[0]}</div>
          <div className="time-hour2 time-box light">{hours[1]}</div>
          <div className="colon">:</div>
          <div className="time-min1 time-box light">{minutes[0]}</div>
          <div className="time-min2 time-box light">{minutes[1]}</div>
        </section>
      </section>

      <section className="category-box">
        <div className="total-tasks category light">
          <span>Total Tasks</span>
          <span className="category-count-total-tasks category-count">0</span>
        </div>
        <div className="to-do category light">
          <span>To Do</span>
          <span className="category-count-to-do category-count">0</span>
        </div>
        <div className="in-progress category light">
          <span>In Progress</span>
          <span className="category-count-in-progress category-count">0</span>
        </div>
        <div className="done category light">
          <span>Done</span>
          <span className="category-count-done category-count">0</span>
        </div>
        <div className="achievement category light">
          <span>Achievement</span>
          <span className="category-count-achievement category-count">0</span>
        </div>
      </section>

      <section className="main-wrap">
        <Filter filterValue={filterValue} setFilterValue={setFilterValue} />

        <section className="sticker-box">
          <section className="sticker-list"></section>
          <button id="resetBtn" className="reset light-reset">
            <span>데이터 초기화</span>
          </button>
        </section>

        <TodoBoard
          todos={todos}
          filterValue={filterValue}
          onEditClick={openDeleteModal}
          onDelteClick={openDeleteModal}
        />
      </section>

      <hr className="line" />
      <div className="footer">
        <p className="footer-comment">
          &copy; 2026 FlowDash. All rights reserved.
        </p>
      </div>

      <Modal
        type={modalState.type}
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        data={currentTodo}
        setData={setCurrentTodo}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
      />
    </section>
  );
}

export default App;
