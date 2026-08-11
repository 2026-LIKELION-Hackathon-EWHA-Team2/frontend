const Step1Info = ({ formData, setFormData, onNext }) => {
  // 입력값이 바뀔 때마다 부모의 상태를 업데이트해 주는 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-10 text-center text-xl font-bold">

    </div>

  );
};

export default Step1Info;