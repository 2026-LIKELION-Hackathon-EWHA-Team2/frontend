import { forwardRef, useState } from 'react';

/* [라벨 + 입력창 + 도움말/에러 텍스트] 의 구조
 * type="password"일 때 비밀번호 숨김/보임 토글 가능하게 */

const Input = forwardRef((
  { label, id, error, helperText, className = '', type = 'text', ...inputProps },
  ref
) => {
  const inputId = id ?? inputProps.name;
  const isPassword = type === 'password';
  const [visible, setVisible] = useState(false);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-black mb-2 font-wantedsans text-base font-medium leading-5 tracking-[0.03rem]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={isPassword ? (visible ? 'text' : 'password') : type}
          className={`h-11.5 w-full rounded-[0.625rem] border bg-[#F5F5F5] px-3.5 text-[#686868] font-wantedsans text-sm font-medium border-transparent leading-normal outline-none transition-colors placeholder:text-[#8C8C8C] placeholder:font-normal ${
            isPassword ? 'pr-11' : ''
          }`}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center"
            >
            <img
            src={visible ? '/icons/pw-eyes-close.svg' : '/icons/pw-eyes-close.svg'}
            className="w-[1.34688rem] h-[1.18438rem]"
            />
            </button>
        )}
        </div>
      {error ? (
        <p className="text-[#F80A0A] px-0.5 font-wantedsans text-[0.8125rem] font-normal leading-[1.875rem]">{error}</p>
      ) : helperText ? (
        <p className="text-[#F80A0A] px-0.5 font-wantedsans text-[0.8125rem] font-normal leading-[1.875rem]">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;