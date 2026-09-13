// 회원가입 - 국가 선택 드롭다운 (환자의 '거주 국가', 병원의 '국가' 둘 다 여기서 공용으로 사용!)
//
// [어흥콘 리팩토링] 원래 병원 회원가입은 도시를 선택해야 했는데, 국가 하나만 선택하게 바꾸면서
// 환자 회원가입과 똑같은 거 재사용하려고 컴포넌트로 만들었어여~~

import { useRef, useState } from 'react';
import Input from './Input';
import useClickOutside from '../hooks/useClickOutside';
import { RESIDENCE_COUNTRY_OPTIONS } from '../utils/country';

const CountrySelect = ({ label, value, onChange }) => {
  const [showList, setShowList] = useState(false);
  const boxRef = useRef(null);
  useClickOutside(boxRef, () => setShowList(false));

  return (
    <div className="relative flex flex-col" ref={boxRef}>
      <Input
        label={label}
        name="country"
        value={value}
        placeholder="대한민국"
        readOnly
        style={{ cursor: 'pointer' }}
        onClick={() => setShowList((prev) => !prev)}
        onFocus={() => setShowList(true)}
        icon="/icons/arrow-down-gray.svg"
        iconClassName={showList ? 'rotate-180' : ''}
        onIconClick={() => setShowList((prev) => !prev)}
      />

      {showList && (
        <ul className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-[0.625rem] border border-[#EDEDF1] bg-white shadow-md">
          {RESIDENCE_COUNTRY_OPTIONS.map((country) => (
            <li key={country}>
              <button
                type="button"
                onClick={() => {
                  onChange(country);
                  setShowList(false);
                }}
                className="w-full px-3.5 py-2.5 text-left font-wantedsans text-sm font-medium text-[#181818] hover:bg-[#FAFAFA]"
              >
                {country}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountrySelect;
