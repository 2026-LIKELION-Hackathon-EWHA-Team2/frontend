// 환자명 / 케이스 번호 검색용 input 컴포넌트

const SearchBar = ({
  value,
  onChange,
  placeholder = '환자명 / 케이스 번호 검색',
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-1 rounded-lg border border-[#DADADA] bg-white px-2.5 py-1.5 ${className}`}
    >
      <img src="/icons/search-gray.svg" alt="" className="h-5 w-5 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex flex-1 border-0 bg-transparent text-[#686868] font-wantedsans text-xs font-medium leading-normal outline-none placeholder:text-[#9F9F9F]"
      />
    </div>
  );
};

export default SearchBar;