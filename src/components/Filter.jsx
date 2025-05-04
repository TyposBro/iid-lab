import PropTypes from "prop-types";

const Filter = ({ selected, setSelected, list }) => {
  const filters = [...new Set(list)];

  return (
    <div className="flex flex-wrap gap-[10px] font-bold text-[15px]">
      {filters.map((item, index) => (
        <button
          key={index}
          className={`place-content-center border-2 border-text_black_primary active:border-text_black_primary grid active:bg-blpborder-text_black_primary px-[12px] py-[4px] border-solid rounded-[15px] text-blpborder-text_black_primary active:text-white no-underline ${
            selected === item ? "bg-text_black_primary border-text_black_primary text-white" : ""
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
