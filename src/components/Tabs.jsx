/* Tabs 컴포넌트 - 숫자 count 여부 선택 가능
 * { key: 'all', label: '전체 수신', count: 8 } 식으로 tabs 배열 만들어 사용하면 됨
 * 배열에 count 안 넣으면 없는 버전 가능함!!
 */

const Tabs = ({ tabs, activeKey, onChange, className = '' }) => {
  return (
    <div className={`flex w-full border-b-2 border-transparent ${className}`}>
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={`relative -mb-0.5 flex flex-1 items-center justify-center gap-1.5 border-b-2 py-1.5 text-center font-wantedsans text-sm font-medium leading-4.5 transition-colors ${
              active
                ? 'border-[#6B5DD6] text-[#6B5DD6]'
                : 'border-[#E8E8E8] text-[#686868]'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`rounded-full w-4.5 h-4.5 text-[#686868] text-center font-wantedsans text-xs font-medium leading-normal ${
                  active ? 'bg-[#6B5DD6] text-white' : 'bg-[#E8E8E8] text-[#686868]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;