// [step 1] 증상 사진 입력 화면

import useCaseFormStore from '../../../../store/useCaseFormStore';

const GUIDE_ITEMS = [
  { icon: '/icons/guide-front.svg', label: '정면' },
  { icon: '/icons/guide-angle45.svg', label: '45도 각도' },
  { icon: '/icons/guide-side.svg', label: '측면' },
  { icon: '/icons/guide-closeup.svg', label: '클로즈업' },
  { icon: '/icons/guide-distance.svg', label: '거리 두기' },
];

const MAX_PHOTOS = 6;

const Step1Photo = () => {
  const { photos, addPhoto } = useCaseFormStore();
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const remainingSlots = MAX_PHOTOS - photos.length;
    if (remainingSlots <= 0) return;
    const selectedFiles = files.slice(0, remainingSlots);
    selectedFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      addPhoto(url);
    });
    e.target.value = '';
  };

  return (
    <>
    <div className='border border-[#EDEDF1] rounded-[0.625rem] px-4 py-4'>
      <p className="mb-3 text-[#6B5DD6] font-wantedsans text-[0.875rem] font-bold leading-normal">사진 입력</p>
      <p className="mb-6 text-[#626262] font-wantedsans text-[0.625rem] font-medium leading-normal">
        시술 부위를 여러 각도에서 선명하게 촬영해주세요.
      </p>
      <p className='mb-3 flex items-center text-[#181818] font-wantedsans text-[0.625rem] font-bold leading-normal'>사진 업로드&nbsp; 
        <span className="text-[#181818] font-wantedsans text-[0.625rem] font-normal leading-normal">(최소 1장, 최대 6장)</span>
      </p>

      <label className="mb-6 flex h-[8.3rem] w-full cursor-pointer flex-col items-center justify-center gap-4 
      rounded-[0.625rem] border border-dashed border-[#6B5DD6] bg-[#A78AF4]/10">
        <input
          type="file"
          multiple 
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={photos.length >= MAX_PHOTOS}
        />
        {photos.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {photos.map((p, idx) => (
              <img key={idx} src={p} alt={`업로드 사진 ${idx + 1}`} 
              className={`rounded-lg object-cover ${photos.length >= 4 ? 'h-12 w-12' : 'h-16 w-16'}`}/>
            ))}
          </div>
        ) : (
          <>
            <img src="/icons/camera.svg" alt="" className="h-6 w-6" />
            <span className="text-[#6B5DD6] font-wantedsans text-[0.625rem] font-medium leading-normal">
              사진을 촬영하거나 선택하세요
            </span>
          </>
        )}
      </label>

      <p className="mb-3 text-[#181818] font-wantedsans text-[0.625rem] font-bold leading-normal">촬영 가이드</p>
      <div className="flex justify-between gap-2">
        {GUIDE_ITEMS.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-[0.375rem]">
            <div className='w-12 h-12 flex items-center justify-center rounded-full border border-[#9F9F9F]'>
              <img src={item.icon} alt={item.label} className="h-8 w-8" />
              </div>
            <span className="whitespace-nowrap text-center text-[#686868] font-wantedsans text-[0.625rem] font-medium leading-normal">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Step1Photo;