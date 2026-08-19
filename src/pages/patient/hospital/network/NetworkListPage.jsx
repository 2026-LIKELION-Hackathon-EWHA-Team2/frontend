// 네트워크 병원 둘러보기

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/layout/Header';
import PageContainer from '../../../../components/layout/PageContainer';
import QueryState from '../../../../components/state/QueryState';
import HospitalCard from '../../../../components/card/HospitalCard';
import SmallButton from '../../../../components/button/SmallButton';
import SortModal from '../../../../components/modal/SortModal';
import { useNetworkHospitalsQuery } from '../../../../hooks/useMockQueries';
import useHospitalMatchStore from '../../../../store/useHospitalMatchStore';

const SORT_OPTIONS = [
  { value: 'distance', label: '거리순으로 보기' },
  { value: 'experience', label: '협진 경험 순으로 보기' },
];

const SORT_LABELS = {
  distance: '거리순',
  experience: '협진 경험순',
};

const NetworkListPage = () => {
  const navigate = useNavigate();
  const { sortOrder, setSortOrder } = useHospitalMatchStore();
  // 정렬은 클라이언트에서 다시 하지 않고 서버 sort 파라미터로 처리 (백엔드가 이미 정렬된 배열을 줌)
  const { data: hospitals, isLoading, isError } = useNetworkHospitalsQuery(sortOrder);

  const [isModalOpen, setModalOpen] = useState(false);
  const [draftSortOrder, setDraftSortOrder] = useState(sortOrder);

  const handleOpenModal = () => {
    setDraftSortOrder(sortOrder);
    setModalOpen(true);
  };

  const handleApply = () => {
    setSortOrder(draftSortOrder);
    setModalOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="네트워크 병원 보기" showBack rightSlot={<></>} />

      <PageContainer className="flex flex-1 flex-col pt-3 pb-10">
        <div className="flex justify-end">
          <SmallButton variant="dropdown" label={SORT_LABELS[sortOrder]} onClick={handleOpenModal} />
        </div>

        <div className="mt-3 flex flex-col gap-2.5">
          <QueryState isLoading={isLoading} isError={isError} isEmpty={!hospitals?.length}>
            {hospitals?.map((hospital) => (
              <HospitalCard
                key={hospital.hospital_id}
                image={hospital.image_url}
                name={hospital.name}
                department={hospital.specialties.map((s) => s.specialty_name).join(', ')}
                distance={`${hospital.distance_km}km`}
                onDetailClick={() => navigate(`/patient/hospital/network/${hospital.hospital_id}`)}
              />
            ))}
          </QueryState>
        </div>
      </PageContainer>

      <SortModal
        open={isModalOpen}
        options={SORT_OPTIONS}
        value={draftSortOrder}
        onChange={setDraftSortOrder}
        onApply={handleApply}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default NetworkListPage;
