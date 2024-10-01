import PropTypes from "prop-types";

const Filter = ({ selected, setSelected, list }) => {
  const filters = [...new Set(list.map((item) => item.type))];

  return (
    <div className="flex flex-wrap gap-[10px] font-bold text-[15px]">
      <button
        className={`place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main px-[12px] py-[4px] border-solid rounded-[15px] text-primary_main active:text-white no-underline ${
          selected === "Latest" ? "bg-primary_main text-white" : ""
        }`}
        onClick={() => setSelected("Latest")}
      >
        Latest
      </button>
      {filters.map((item, index) => (
        <button
          key={index}
          className={`place-content-center border-2 border-primary_main active:border-primary_main grid active:bg-primary_main px-[12px] py-[4px] border-solid rounded-[15px] text-primary_main active:text-white no-underline ${
            selected === item ? "bg-primary_main text-white" : ""
          }`}
          onClick={() => setSelected(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default Filter;

Filter.propTypes = {
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
};
