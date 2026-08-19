import { useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  MOCK_CONSULT_PATIENTS,
  MOCK_HANDOVER_DOCUMENT,
  MOCK_HOSPITAL_HOME, // ★ 다른 곳에서 안 쓰면 나중에 지워도 됨
  MOCK_CONSULT_REQUEST_DETAIL,
  MOCK_QUICK_CONSULT,
  MOCK_AGREEMENT,
} from '../mock/mockdata';

import {
  loginApi,
  signupPatientApi,
  signupHospitalApi,
  getPatientProfileApi,
  getHospitalProfileApi,
  getHospitalListApi, // 요거 이제 추가!
} from '../apis/userApi'

import {
  createCaseTransferApi,
  reviewCaseTransferApi,
  sendCaseTransferApi,
  getUnsentCaseTransfersApi,
  getCaseTransferDetailApi,
  getProcedureHistoryListApi,
  getProcedureHistoryDetailApi,
} from '../apis/caseApi'
import { getCountryName } from '../utils/country'
import { formatDateOnly } from '../utils/format'
import { createSymptomCaseApi, getSymptomCaseListApi } from '../apis/symptomCaseApi';
import {
  createMatchRequestApi,
  getMatchRequestDetailApi,
  getMatchRecommendationsApi,
  getNetworkHospitalsApi,
  getNetworkHospitalDetailApi,
  selectMatchRecommendationApi,
  selectNetworkHospitalApi,
  consentMatchRequestApi,
} from '../apis/matchingApi';
import {
  buildSymptomCaseFormData,
  normalizeSymptomCaseForHome,
  normalizeSymptomCaseForSelect,
} from '../utils/symptomCaseMapper';

const wait = (data, ms = 400) => new Promise((resolve) => setTimeout(() => resolve(data), ms));

//accounts/api

// 로그인
export const useLoginMutation = () =>
  useMutation({
    mutationFn: ({ userId, password }) => loginApi(userId, password),
  });

// 환자 회원가입
export const useSignupPatientMutation = () =>
  useMutation({
    mutationFn: (data) => signupPatientApi(data),
  });

// 병원 회원가입
export const useSignupHospitalMutation = () =>
  useMutation({
    mutationFn: (data) => signupHospitalApi(data),
  });

// 환자 프로필
export const usePatientProfileQuery = () =>
  useQuery({
    queryKey: ['patientProfile'],
    queryFn: () => getPatientProfileApi(),
  });

// 병원 프로필
export const useHospitalProfileQuery = () =>
  useQuery({
    queryKey: ['hospitalProfile'],
    queryFn: () => getHospitalProfileApi(),
  });

// 진단서 입력 화면 - Step4Certificate에서 '시술 받은 병원' 검색할 때 사용
// search 파라미터로 병원명 검색 가능 (안 넣으면 전체 조회)
export const useHospitalAccountsListQuery = (search = '') =>
  useQuery({
    queryKey: ['hospitalAccountsList', search], // search도 큐키에 포함 - 검색어 바뀔 때마다 재조회됨
    queryFn: () => getHospitalListApi(search),
  });

//cases api

// Case 전송 건 생성 - 성공 시 REVIEW_REQUIRED 상태의 CaseTransfer 반환 (병원에 바로 전송되는 건 아님)
// AI 매칭(useHospitalMatchStore의 selectedCaseId/selectedRecommendationId)이 이제 실제 값이라 호출 가능해짐
// 아직 CaseSyncPage 진입 시점에 이 mutation을 트리거하는 지점을 안 만들어서 페이지 연결은 남아있음
export const useCreateCaseTransferMutation = () =>
  useMutation({
    mutationFn: (body) => createCaseTransferApi(body),
  });

// Case 전송 검토 및 필수 동의 - CaseSyncPage '전송하기' 클릭 시 send와 순서대로 호출됨
// 성공하면 캐시된 상세(useCaseTransferDetailQuery)도 최신 상태로 갱신
export const useReviewCaseTransferMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transferId, agreements }) => reviewCaseTransferApi(transferId, agreements),
    onSuccess: (data) => {
      queryClient.setQueryData(['caseTransferDetail', data.id], data);
    },
  });
};

// Case 최종 전송 - review로 READY_TO_TRANSFER 확인된 뒤에만 호출해야 함 (CaseSyncPage 참고)
export const useSendCaseTransferMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transferId) => sendCaseTransferApi(transferId),
    onSuccess: (data) => {
      queryClient.setQueryData(['caseTransferDetail', data.id], data);
    },
  });
};

// 미전송 Case 목록 (아직 연결된 화면 없음 - 화면 나오면 훅 이름/쿼리키 조정 예정)
export const useUnsentCaseTransfersQuery = () =>
  useQuery({
    queryKey: ['unsentCaseTransfers'],
    queryFn: () => getUnsentCaseTransfersApi(),
  });

// 환자 전송 Case 상세 - CaseSyncPage의 AI 검토/전송 동의/전송 완료 화면 재진입 시 사용 예정
// (transferId는 '전송 건 생성' API 응답에서 받아 store에 저장해야 하는데, 그 API 연동 전이라 아직 실제 값이 없음.
// useConsultPatientDetailQuery와 동일하게 id 없으면 요청 자체를 막아둠)
export const useCaseTransferDetailQuery = (transferId) =>
  useQuery({
    queryKey: ['caseTransferDetail', transferId],
    enabled: !!transferId,
    queryFn: () => getCaseTransferDetailApi(transferId),
  });

// 백엔드 응답 -> MedicalPassportPage/ProcedureHistoryCard/ProcedureDetailPage가 쓰는 필드 형태로 변환
// (단순 이름만 다른 게 아니라 location 조합, date 구분자, id 문자열화처럼 값 자체를 가공해야 해서 매핑 필요)
const mapProcedureHistory = (item) => ({
  id: String(item.medical_case_id),
  name: item.procedure_name,
  tag: item.procedure_area,
  hospital: item.procedure_hospital_name,
  location: [item.procedure_hospital_city, getCountryName(item.procedure_hospital_country)]
    .filter(Boolean)
    .join(', '),
  date: item.procedure_date.replaceAll('-', '.'),
  relatedCaseId: item.case_number,
  status: item.status,
  finalizedAt: item.finalized_at,
});

// 시술 이력 목록 (여권 페이지) - status COMPLETED만 반환됨
export const useProcedureHistoryQuery = () =>
  useQuery({
    queryKey: ['procedureHistory'],
    queryFn: () => getProcedureHistoryListApi().then((list) => list.map(mapProcedureHistory)),
  });

// 백엔드 응답 -> ProcedureDetailPage/ConsultCard/ConsultHistoryPage가 쓰는 필드 형태로 변환
// case_number는 'CASE-2026-000015'처럼 접두어가 붙어있어서, ConsultCard가 자체적으로
// 'Case #'를 붙이는 것과 겹치지 않도록 접두어를 떼어서 consult.caseId에 넣어둠
// (evidence_items의 content -> reasons[].label도 화면 컴포넌트가 기대하는 이름으로 변환)
const mapProcedureHistoryDetail = (data) => ({
  id: String(data.medical_case_id),
  name: data.procedure.name,
  tag: data.procedure.area,
  hospital: data.procedure.hospital_name,
  location: [data.procedure.hospital_city, getCountryName(data.procedure.hospital_country)]
    .filter(Boolean)
    .join(', '),
  date: data.procedure.date.replaceAll('-', '.'),
  relatedCaseId: data.case_number,
  consult: {
    caseId: data.case_number.replace(/^CASE-/, ''),
    hospitalName: data.collaboration.partner_hospital_name,
    date: formatDateOnly(data.collaboration.finalized_at),
  },
  agreement: {
    participants: data.final_agreement.reviews.map((r) => ({ name: r.hospital_name })),
    finalJudgement: data.final_agreement.judgment_draft,
    reasons: data.final_agreement.evidence_items.map((item) => ({ id: item.id, label: item.content })),
    opinion: data.final_agreement.additional_opinion ?? '',
  },
});

// 시술 이력 상세 + 최종 협진 합의안 (상세 화면, 인계서 화면 공통)
// COMPLETED + FINAL 조건을 만족하는 Case만 조회 가능, 그 외엔 404
export const useProcedureHistoryDetailQuery = (medicalCaseId) =>
  useQuery({
    queryKey: ['procedureHistoryDetail', medicalCaseId],
    enabled: !!medicalCaseId,
    queryFn: () => getProcedureHistoryDetailApi(medicalCaseId).then(mapProcedureHistoryDetail),
  });

// ------------------------------------------------------------
// selfsymptoms/ api

// 증상 케이스 생성 (useCaseFormStore 값을 그대로 넘기면 내부에서 FormData로 변환)
export const useCreateSymptomCaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formValues) => createSymptomCaseApi(buildSymptomCaseFormData(formValues)),
    onSuccess: () => {
      // 홈 최근 케이스 / 케이스 선택 목록에서 같이 쓰는 목록 캐시라 한번에 갱신
      queryClient.invalidateQueries({ queryKey: ['symptomCases'] });
    },
  });
};

// 증상 케이스 목록 (raw, 변환 전) - 아래 훅들에서 공통으로 사용
export const useSymptomCaseListQuery = () =>
  useQuery({ queryKey: ['symptomCases'], queryFn: getSymptomCaseListApi });

// 환자 홈 피드 - 최근 케이스 목록
// data를 useMemo로 감싸서 query.data가 안 바뀌면 배열/객체 참조도 그대로 유지되게 함
// (매번 새 배열을 반환하면, 이 값을 useEffect 의존성으로 쓰는 화면에서 렌더링 무한루프가 남)
export const useRecentSymptomCasesQuery = () => {
  const query = useSymptomCaseListQuery();
  const data = useMemo(() => query.data?.map(normalizeSymptomCaseForHome), [query.data]);
  return { ...query, data };
};

// AI 추천 병원 매칭 진입 전 - 케이스 선택 화면 (HospitalSelectCase)
// status가 SUBMITTED(등록만 하고 병원 매칭은 아직 안 한 상태)인 케이스만 필터링해서 보여줌
export const useSubmittedSymptomCaseListQuery = () => {
  const query = useSymptomCaseListQuery();
  const data = useMemo(
    () => query.data?.filter((c) => c.status === 'SUBMITTED').map(normalizeSymptomCaseForSelect),
    [query.data]
  );
  return { ...query, data };
};

// 케이스 동기화 Step2Select에서 사용
// Case 전송 건 생성(POST /cases/transfers/) 전제조건이 '증상 Case가 HOSPITAL_SELECTED 상태'라서
// (apis/caseApi.js의 createCaseTransferApi 주석 참고) AI 매칭까지 끝낸 케이스만 필터링해서 보여줘야 함
// -> useSubmittedSymptomCaseListQuery(SUBMITTED)를 그대로 쓰면 매칭 끝난 케이스가 목록에 안 잡혀서
//    Step2Select가 항상 '선택된 케이스를 찾을 수 없습니다'로 빠지는 문제가 있었음
export const useHospitalSelectedSymptomCaseListQuery = () => {
  const query = useSymptomCaseListQuery();
  const data = useMemo(
    () => query.data?.filter((c) => c.status === 'HOSPITAL_SELECTED').map(normalizeSymptomCaseForSelect),
    [query.data]
  );
  return { ...query, data };
};

// ------------------------------------------------------------
// matching api

// 매칭 요청 생성 및 AI 병원 추천 - Step1Setting '전송하기' 클릭 시 호출
// 응답에 추천 병원 목록이 함께 오므로, 별도 목록 조회 API 없이 이 결과를 store에 그대로 저장해서 씀
export const useCreateMatchRequestMutation = () =>
  useMutation({
    mutationFn: (body) => createMatchRequestApi(body),
  });

// 매칭 요청 상세 조회 (재진입/새로고침 시 상태 복구용 - 아직 페이지에서 쓰지 않음)
// useHospitalMatchStore에 persist가 없어서 새로고침하면 matchRequestId 자체가 날아가므로
// 지금 구조에선 이 훅으로 복구할 상황 자체가 안 생김 (store에 persist 추가하면 그때 활용)
export const useMatchRequestDetailQuery = (matchRequestId) =>
  useQuery({
    queryKey: ['matchRequestDetail', matchRequestId],
    enabled: !!matchRequestId,
    queryFn: () => getMatchRequestDetailApi(matchRequestId),
  });

// 추천 병원 목록 조회 - sortOrder는 useHospitalMatchStore의 sortOrder 값('distance'|'experience'|'department')
// 그대로 넘기면 됨 (백엔드 sort 파라미터 변환은 getMatchRecommendationsApi 내부에서 처리)
// 응답이 이미 정렬되어 있으므로 이 훅이 반환하는 recommendations 배열 순서를 그대로 렌더링해야 함
export const useMatchRecommendationsQuery = (matchRequestId, sortOrder) =>
  useQuery({
    queryKey: ['matchRecommendations', matchRequestId, sortOrder],
    enabled: !!matchRequestId,
    queryFn: () => getMatchRecommendationsApi(matchRequestId, sortOrder),
  });

// 추천 병원 선택 - Step3Detail '이 병원으로 매칭 신청' 클릭 시 호출
export const useSelectMatchRecommendationMutation = () =>
  useMutation({
    mutationFn: (recommendationId) => selectMatchRecommendationApi(recommendationId),
  });

// 선택 병원 매칭 동의 - Step4Consent(매칭) '전송하기' 클릭 시 호출
export const useConsentMatchRequestMutation = () =>
  useMutation({
    mutationFn: ({ matchRequestId, agreements }) => consentMatchRequestApi(matchRequestId, agreements),
  });

// 네트워크 병원 목록 조회 (AI 매칭 없이 직접 둘러보는 화면) - sortOrder는 'distance'|'experience'만 사용
export const useNetworkHospitalsQuery = (sortOrder) =>
  useQuery({
    queryKey: ['networkHospitals', sortOrder],
    queryFn: () => getNetworkHospitalsApi(sortOrder),
  });

// 네트워크 병원 상세 조회 - NetworkDetailPage 전용 (목록과 응답 형태가 같아서 매핑 로직 공유 가능)
export const useNetworkHospitalDetailQuery = (hospitalId) =>
  useQuery({
    queryKey: ['networkHospitalDetail', hospitalId],
    enabled: !!hospitalId,
    queryFn: () => getNetworkHospitalDetailApi(hospitalId),
  });

// 네트워크 병원 선택 - NetworkDetailPage '이 병원으로 매칭 신청' 클릭 시 호출
// 응답에 match_request_id/recommendation_id가 새로 생겨서, AI 매칭 선택 때와 동일하게 store에 저장하면 됨
export const useSelectNetworkHospitalMutation = () =>
  useMutation({
    mutationFn: ({ hospitalId, symptomCaseId }) => selectNetworkHospitalApi(hospitalId, symptomCaseId),
  });

// ------------------------------------------------------------
// 여기서부터는 아직 남은 hook들 - 아직 mock 유지
// ------------------------------------------------------------

// 2-2 협진요청함 / 2-3 환자조회에서 사용
export const useConsultPatientsQuery = () =>
  useQuery({ queryKey: ['consultPatients'], queryFn: () => wait(MOCK_CONSULT_PATIENTS) });

// 협진 인계서
export const useHandoverDocumentQuery = () =>
  useQuery({ queryKey: ['handoverDocument'], queryFn: () => wait(MOCK_HANDOVER_DOCUMENT) });

// 케이스 조회 리스트에서 환자 한 명을 선택했을 때 쓰는 상세 조회
// (협진 요청 상세 / 환자 정보 상세 보기 화면에서 공통으로 사용)
export const useConsultPatientDetailQuery = (id) =>
  useQuery({
    queryKey: ['consultPatientDetail', id],
    enabled: !!id, // id가 아직 없을 때(라우팅 진입 초기 등)는 요청 자체를 하지 않도록 막음
    queryFn: () => wait(MOCK_CONSULT_PATIENTS.find((p) => p.id === id) ?? null),
  });

// 협진 요청 상세
export const useConsultRequestDetailQuery = () =>
  useQuery({ queryKey: ['consultRequestDetail'], queryFn: () => wait(MOCK_CONSULT_REQUEST_DETAIL) });

// 병원 신속 협진 - 메시지 목록
export const useQuickConsultQuery = () =>
  useQuery({ queryKey: ['quickConsult'], queryFn: () => wait(MOCK_QUICK_CONSULT) });

// 병원 신속 협진 - 새 메시지 전송 (mock, 캐시에 바로 append)
export const useSendQuickConsultMessage = () => {
  const queryClient = useQueryClient();
  return (text) =>
    queryClient.setQueryData(['quickConsult'], (old) => {
      if (!old) return old;
      const myName = old.messages.find((m) => m.mine)?.from ?? old.messages[0]?.from;
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      return {
        ...old,
        messages: [...old.messages, { from: myName, text, textJa: text, time, mine: true }],
      };
    });
};

// 협진 합의 - AI 정리 초안 (useAgreementStore 초기화에 사용하는 형식)
export const useAgreementDraftQuery = () =>
  useQuery({ queryKey: ['agreementDraft'], queryFn: () => wait(MOCK_AGREEMENT) });

// 케이스 조회 상세 - '협진 시작하기' 클릭 시 케이스 상태를 '신규 요청' -> '검토중'으로 변경 (mock, 캐시에 바로 반영)
// 채팅 목록에는 이 상태가 되어야 카드가 나타남 (신규 요청 상태는 채팅방이 아직 없는 것으로 취급)
export const useStartConsultCase = () => {
  const queryClient = useQueryClient();
  return (id) => {
    queryClient.setQueryData(['consultPatients'], (old = []) =>
      old.map((p) => (p.id === id ? { ...p, status: 'reviewing' } : p))
    );
    queryClient.setQueryData(['consultPatientDetail', id], (old) =>
      old ? { ...old, status: 'reviewing' } : old
    );
  };
};

// 협진 합의 - 양측 병원이 모두 검토 완료했을 때 케이스 상태를 '완료'로 변경 (mock, 캐시에 바로 반영)
export const useCompleteConsultCase = () => {
  const queryClient = useQueryClient();
  return (id) => {
    queryClient.setQueryData(['consultPatients'], (old = []) =>
      old.map((p) => (p.id === id ? { ...p, status: 'done' } : p))
    );
    queryClient.setQueryData(['consultPatientDetail', id], (old) =>
      old ? { ...old, status: 'done' } : old
    );
  };
};
