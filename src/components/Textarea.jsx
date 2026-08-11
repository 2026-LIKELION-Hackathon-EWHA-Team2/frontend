import { forwardRef } from "react";

/* maxlength 와 label은 지정 안 하면 안 뜨도록 구성해 재사용성을 높이고자 함!! 
state 만들 때 value랑 onChange 넘겨주시면 됩니당! */

const Textarea = forwardRef(
  ({ label, id, maxLength, value = "", className = "", ...props }, ref) => {
    const areaId = id ?? props.name;

    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && (
          <label
            htmlFor={areaId}
            className="text-[#181818] font-wantedsans text-xs font-bold leading-normal"
          >
            {label}
          </label>
        )}
        <div className="flex flex-col rounded-[0.625rem] border border-[#EDEDF1] bg-surface">
          <textarea
            ref={ref}
            id={areaId}
            value={value}
            maxLength={maxLength}
            className="min-h-[4.4375rem] w-full resize-none border-0 bg-transparent p-[0.625rem] text-[#181818] font-wantedsans text-xs font-medium leading-[0.875rem] outline-none placeholder:text-[#999999]"
            {...props}
          />
          {maxLength && (
            <p className="self-end px-[0.625rem] pb-[0.625rem] text-[#9F9F9F] font-wantedsans text-xs font-normal leading-[1.125rem]">
              {String(value).length} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  },
);

export default Textarea;

  