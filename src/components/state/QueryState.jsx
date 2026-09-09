import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

/*
 * tanstack query 결과(isLoading/isError/data)를 화면 선에서 일관되게 처리하기 위한 래퍼 로직!!!
 * isEmpty로 빈 배열 등 "정상 응답이지만 표시할 데이터 없음"을 별도 처리하고자 함
 * EmptyState는 에러 화면과 빈 화면 모두에 쓰임..~
 * 
 * [어흥콘 리팩토링] 에러 상태 문구 분류 추가
 * -> 기존엔 무슨 에러든 '정보를 불러오지 못했습니다'가 기본값 상태 -> 리팩토링 진행
 * ->  axios 에러 객체(error.response.status)를 받아서 401/403/404/5xx별로 다른 안내 문구를 보여주기!
 * -> 백엔드가 내려주는 실제 에러 메시지(error.response.data.message 등)는 아직 화면에 노출 안 하고
 *   개발자 도구에서만 확인 가능한 상태라, 우선은 상태 코드 기준으로만 분류했어요 ~.~
 * -> errorMessage prop을 명시적으로 넘긴 화면(기존 커스텀 문구)은 그대로 최우선 적용되도록 하위 호환 유지하는 방식으로 일단 진행!! 
 */
const ERROR_CONTENT_BY_STATUS = {
  401: { title: '로그인이 필요합니다', description: '다시 로그인 후 이용해주세요' },
  403: { title: '접근 권한이 없습니다', description: '해당 정보에 접근할 수 있는 권한이 없어요' },
  404: { title: '요청한 정보를 찾을 수 없습니다', description: '삭제되었거나 잘못된 경로일 수 있어요' },
  500: { title: '서버에 문제가 발생했습니다', description: '잠시 후 다시 시도해주세요' },
};

const DEFAULT_ERROR_CONTENT = { title: '정보를 불러오지 못했습니다', description: '잠시 후 다시 시도해주세요' };

// error(react-query/axios 에러 객체)와 명시적 errorMessage를 받아 최종 에러 문구를 결정
const resolveErrorContent = (error, errorMessage) => {
  // 화면에서 직접 넘긴 문구가 있으면(기존 적용 방식) 그걸 최우선으로 사용 -> 충돌 방지? 용으로 ㅎㅎ
  if (errorMessage) {
    return { title: DEFAULT_ERROR_CONTENT.title, description: errorMessage };
  }

  const status = error?.response?.status;

  if (status) {
    if (ERROR_CONTENT_BY_STATUS[status]) return ERROR_CONTENT_BY_STATUS[status];
    if (status >= 500) return ERROR_CONTENT_BY_STATUS[500]; // 502/503 등 나머지 5xx도 서버 오류로 묶음
  }

  // status가 없는데 error 객체는 있는 경우 -> 응답 자체를 못 받은 네트워크 문제로 일단 판단
  if (error && !error.response) {
    return { title: '네트워크 연결을 확인해주세요', description: '인터넷 연결 상태를 확인한 뒤 다시 시도해주세요' };
  }

  return DEFAULT_ERROR_CONTENT;
};

const QueryState = ({ isLoading, isError, isEmpty, loadingProps, emptyProps, errorMessage, error, children }) => {
  if (isLoading) return <LoadingState {...loadingProps} />;
  if (isError) {
    const { title, description } = resolveErrorContent(error, errorMessage);
    return <EmptyState icon="⚠️" title={title} description={description} />;
  }
  if (isEmpty) {
    return <EmptyState {...(emptyProps ?? { title: '표시할 항목이 없습니다' })} />;
  }
  return children;
}

export default QueryState;
