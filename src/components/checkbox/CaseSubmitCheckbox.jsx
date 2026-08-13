import { useState } from 'react';
import CheckSquare from './CheckSquare';

/*
 * 케이스 전송 화면의 동의 항목 카드 컴포넌트!
 * title: 상단 제목 (동의 항목)
 * items: [{ label }] 배열
 * checkedList, onChangeList: 각 항목의 체크 상태 배열과 변경 콜백 (index로 갱신하는..~)
 */
const CaseSubmitCheckbox = ({ title, items, checkedList, onChangeList }) => {
    return (
      <div>
        {title && (
          <p className="mb-2 text-[#181818] font-wantedsans text-sm font-medium leading-4.5">
            {title}
          </p>
        )}
        <div className="rounded-[0.625rem] border border-[#EDEDF1] px-3 py-0.75">
          <ul>
            {items.map((item, idx) => {
              const isLast = idx === items.length - 1;
              return (
                <li key={idx}>
                  <label className="flex cursor-pointer items-center gap-2 py-1.5">
                    <CheckSquare
                      checked={checkedList[idx]}
                      onChange={(next) => {
                        const updated = [...checkedList];
                        updated[idx] = next;
                        onChangeList(updated);
                      }}
                    />
                    <span className="text-[#181818] font-wantedsans text-[0.6875rem] font-medium leading-4.5">
                      {item.label}
                    </span>
                  </label>
                  {!isLast && <div className="h-px bg-[#EDEDF1]" />}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  };

export default CaseSubmitCheckbox;