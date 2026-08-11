import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

/*
 * tanstack query 결과(isLoading/isError/data)를 화면 선에서 일관되게 처리하기 위한 래퍼 로직!!!
 * isEmpty로 빈 배열 등 "정상 응답이지만 표시할 데이터 없음"을 별도 처리하고자 함
 * EmptyState는 에러 화면과 빈 화면 모두에 쓰임..~
 */

const QueryState = ({ isLoading, isError, isEmpty, loadingProps, emptyProps, errorMessage, children }) => {
  if (isLoading) return <LoadingState {...loadingProps} />;
  if (isError) {
    return (
      <EmptyState icon="⚠️" title="정보를 불러오지 못했습니다" description={errorMessage ?? '잠시 후 다시 시도해주세요'} />
    );
  }
  if (isEmpty) {
    return <EmptyState {...(emptyProps ?? { title: '표시할 항목이 없습니다' })} />;
  }
  return children;
}

export default QueryState;