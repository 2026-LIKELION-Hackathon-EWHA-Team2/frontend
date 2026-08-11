/*
 * EmptyState는 에러 화면과 빈 화면 모두에 쓰임..~
 * isError, isEmpty 둘 다 대응 가능하도록!!
 */
const EmptyState = ({ icon = '❗', title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <span className="text-3xl" aria-hidden>{icon}</span>
      <p className="mt-1 text-sm font-medium font-wantedsans text-black">{title}</p>
      {description && <p className="text-xs font-wantedsans text-[#2c2c2c]">{description}</p>}
    </div>
  );
};

export default EmptyState;