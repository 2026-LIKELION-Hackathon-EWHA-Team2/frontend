import { useRef } from 'react';

/**
 * steps 는 총 몇 단계인지 설정하는 거고, value는 현재 단계 위치 입니다! 
 */

const LevelBar = ({ value, onChange, steps = 4, disabled = false }) => {
  const trackRef = useRef(null);

  const percent = ((value - 1) / (steps - 1)) * 100;

  const updateFromPointer = (clientX) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const step = Math.round(ratio * (steps - 1)) + 1;
    if (step !== value) onChange(step);
  };

  const handlePointerDown = (e) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (disabled || e.buttons !== 1) return;
    updateFromPointer(e.clientX);
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuemin={1}
      aria-valuemax={steps}
      aria-valuenow={value}
      aria-disabled={disabled}
      className={`relative h-[0.2rem] w-full rounded-full bg-[#EDEDF1] ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-[#6B5DD6]"
        style={{ width: `${percent}%` }}
      />
      {Array.from({ length: steps }, (_, i) => i + 1).map((step) => {
        if (step <= value) return null;
        const dotPercent = ((step - 1) / (steps - 1)) * 100;
        return (
          <div
            key={step}
            className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EDEDF1]"
            style={{ left: `${dotPercent}%` }}
          />
        );
      })}
      <div
        className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B5DD6]"
        style={{ left: `${percent}%` }}
      />
    </div>
  );
};

export default LevelBar;