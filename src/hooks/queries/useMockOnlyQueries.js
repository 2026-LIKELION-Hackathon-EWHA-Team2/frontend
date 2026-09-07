// 아직 백엔드 연동 전, mock 데이터로만 응답하는 쿼리 모음
// 아마 삭제할 듯?

import { useQuery } from '@tanstack/react-query';
import { MOCK_HANDOVER_DOCUMENT, MOCK_CONSULT_REQUEST_DETAIL } from '../../mock/mockdata';

const wait = (data, ms = 400) => new Promise((resolve) => setTimeout(() => resolve(data), ms));

// 협진 인계서
export const useHandoverDocumentQuery = () =>
  useQuery({ queryKey: ['handoverDocument'], queryFn: () => wait(MOCK_HANDOVER_DOCUMENT) });

// 협진 요청 상세
export const useConsultRequestDetailQuery = () =>
  useQuery({ queryKey: ['consultRequestDetail'], queryFn: () => wait(MOCK_CONSULT_REQUEST_DETAIL) });
