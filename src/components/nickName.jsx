import { useState, useEffect, useRef } from "react";

const NickName = () => {
  const [nickname, setNickname] = useState(
    localStorage.getItem("flowdash-nickname") || "FlowDash",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [dateText, setDateText] = useState("");

  const inputRef = useRef(null);

  // 초기 로드 시 인사말 및 날짜 설정
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    let msg = "안녕하세요";
    if (hour >= 5 && hour < 11) msg = "좋은 아침이에요";
    else if (hour >= 11 && hour < 17) msg = "좋은 오후에요";
    else if (hour >= 17 && hour < 22) msg = "좋은 저녁이에요";
    setGreeting(msg);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    setDateText(`${year}.${month}.${day}`);
  }, []);

  // 수정 모드 시 포커스 제어
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = (e) => {
    const newName = e.target.value.trim() || "FlowDash";
    setNickname(newName);
    localStorage.setItem("flowdash-nickname", newName);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave(e);
  };

  return (
    <div className="greet-box">
      <div className="greet-text">
        <span>{greeting}</span>

        {isEditing ? (
          <span className="nickname-edit-wrapper">
            ,{" "}
            <input
              ref={inputRef}
              type="text"
              className="nickname-input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              style={{ width: `${nickname.length + 1}ch` }} // 가변 너비만 인라인 유지
            />
            님
          </span>
        ) : (
          <span className="nickname-text" onClick={() => setIsEditing(true)}>
            , {nickname}님
          </span>
        )}
      </div>

      <div className="date-text">{dateText}</div>
    </div>
  );
};

export default NickName;
