import { forwardRef, useState } from 'react';

/* [라벨 + 입력창 + 도움말/에러 텍스트] 의 구조
 * type="password"일 때 비밀번호 숨김/보임 토글 가능하게
 *
 * variant
 *  - "auth"    (기본값) : 기존 로그인/회원가입 스타일 (연회색 배경, 테두리 없음)
 *  - "minimal" : 흰 배경 + 얇은 테두리 스타일 (시술 정보 입력 등)
 */

const VARIANT_STYLES = {
  auth: {
    label: 'text-black mb-2 font-wantedsans text-base font-medium leading-5 tracking-[0.03rem]',
    input:
      'h-11.5 w-full rounded-[0.625rem] border bg-[#F5F5F5] px-3.5 text-[#686868] font-wantedsans text-sm font-medium border-transparent leading-normal outline-none transition-colors placeholder:text-[#8C8C8C] placeholder:font-normal',
  },
  minimal: {
    label: 'text-black mb-2 font-wantedsans text-sm font-medium leading-[1.125rem]',
    input:
      'h-[2.75rem] px-[0.875rem] py-[0.75rem] w-full rounded-[0.625rem] border border-[#DADADA] bg-white text-[#333333] font-wantedsans text-sm font-normal leading-[1.125rem] outline-none transition-colors placeholder:text-[#9F9F9F]',
  },
};

const Input = forwardRef(
  (
    { label, id, error, helperText, variant = 'auth', className = '', type = 'text', ...inputProps },
    ref
  ) => {
    const inputId = id ?? inputProps.name;
    const isPassword = type === 'password';
    const [visible, setVisible] = useState(false);
    const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.auth;

    return (
      <div className={`flex flex-col ${className}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (visible ? 'text' : 'password') : type}
            className={`${styles.input} ${isPassword ? 'pr-11' : ''}`}
            {...inputProps}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center"
            >
              <img
                src={visible ? '/icons/pw-eyes-close.svg' : '/icons/pw-eyes-open.svg'}
                className={visible ? "w-[1.45rem] h-[1.6rem]" : "w-[1.5rem] h-[1.5rem]"}
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
  }
);

Input.displayName = 'Input';

export default Input;