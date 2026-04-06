const Filter = ({ filterValue, setFilterValue }) => {
  const labelMap = {
    today: "오늘",
    sevendays: "최근 7일",
    high: "높음",
    mid: "중간",
    low: "낮음",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterValue((prev) => ({
      ...prev,
      [name]: value === "all" ? null : value,
    }));
  };

  const removeFilter = (key) => {
    setFilterValue((prev) => ({ ...prev, [key]: null }));
  };

  return (
    <div className="filter-wrapper">
      <div className="filter-controls">
        <select
          name="date"
          onChange={handleChange}
          value={filterValue.date || "all"}
        >
          <option value="all">전체 기간</option>
          <option value="today">오늘</option>
          <option value="sevendays">최근 7일</option>
        </select>

        <select
          name="priority"
          onChange={handleChange}
          value={filterValue.priority || "all"}
        >
          <option value="all">우선순위 전체</option>
          <option value="high">높음</option>
          <option value="mid">중간</option>
          <option value="low">낮음</option>
        </select>

        <input
          name="keyword"
          type="text"
          placeholder="검색어를 입력하세요"
          value={filterValue.keyword}
          onChange={handleChange}
        />
      </div>

      <div className="sticker-list">
        {Object.keys(filterValue).map((key) => {
          const value = filterValue[key];
          if (!value || key === "sort" || value === "all") return null;

          return (
            <button
              key={key}
              className="filter-sticker display-flex"
              onClick={() => removeFilter(key)}
            >
              <span>{labelMap[value] || value}</span>
              <span style={{ marginLeft: "5px" }}>×</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Filter;
