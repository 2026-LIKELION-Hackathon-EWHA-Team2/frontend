// 네트워크 병원 둘러보기

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/layout/Header';
import PageContainer from '../../../../components/layout/PageContainer';
import QueryState from '../../../../components/state/QueryState';
import HospitalCard from '../../../../components/card/HospitalCard';
import SmallButton from '../../../../components/button/SmallButton';
import SortModal from '../../../../components/modal/SortModal';
import { useHospitalListQuery } from '../../../../hooks/useMockQueries';
import useHospitalMatchStore from '../../../../store/useHospitalMatchStore';

const SORT_OPTIONS = [
  { value: 'distance', label: '거리순으로 보기' },
  { value: 'experience', label: '협진 경험 순으로 보기' },
  { value: 'department', label: '전문 분야 일치순으로 보기' },
];

const SORT_LABELS = {
  distance: '거리순',
  experience: '협진 경험순',
  department: '전문 분야 일치순',
};

const sortHospitals = (hospitals, sortOrder) => {
  const sorted = [...hospitals];
  if (sortOrder === 'distance') {
    sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  } else if (sortOrder === 'experience') {
    sorted.sort((a, b) => Number(b.hasConsultExperience) - Number(a.hasConsultExperience));
  } else if (sortOrder === 'department') {
    sorted.sort((a, b) => a.department.localeCompare(b.department));
  }
  return sorted;
};

const NetworkListPage = () => {
  const navigate = useNavigate();
  const { data: hospitals, isLoading, isError } = useHospitalListQuery();
  const { sortOrder, setSortOrder } = useHospitalMatchStore();

  const [isModalOpen, setModalOpen] = useState(false);
  const [draftSortOrder, setDraftSortOrder] = useState(sortOrder);

  const sortedHospitals = hospitals ? sortHospitals(hospitals, sortOrder) : [];

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
          <QueryState isLoading={isLoading} isError={isError} isEmpty={!sortedHospitals.length}>
            {sortedHospitals.map((hospital) => (
              <HospitalCard
                key={hospital.id}
                image={hospital.image}
                name={hospital.name}
                department={hospital.department}
                distance={hospital.distance}
                onDetailClick={() => navigate(`/patient/hospital/network/${hospital.id}`)}
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
