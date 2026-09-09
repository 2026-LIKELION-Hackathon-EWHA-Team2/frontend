import { Component } from 'react';
import EmptyState from './state/EmptyState';

/*
 * [어흥콘 리팩토링] 렌더링 중 예외가 하나라도 터지면 화면 전체가 백지가 되는 문제를 막기 위한 최상단 ErrorBoundary
 * -> React의 에러 바운더리는 클래스 컴포넌트로만 만들 수 있어서,
 * (getDerivedStateFromError/componentDidCatch가 클래스 라이프사이클 메서드라 훅으로 대체 불가능해서 ㅠ)
 * 여기만 예외적으로 class 문법을 사용했어요 !! 
 * -> App.jsx에서 <Routes> 전체를 감싸서, 특정 페이지 렌더링 중 예외가 나도 앱 전체가 죽지 않고
 *   안내 화면 + 새로고침 버튼을 보여주도록 만들었습니당 ~.~
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 나중에 여기서 Sentry 등 모니터링 도구로 에러를 전송해도...좋을 둣
    // 일단은 패스!!
    console.error('[ErrorBoundary] 렌더링 중 예외 발생', error, errorInfo);
  }

  handleGoHome = () => {
    // 컴포넌트 state만 초기화하면 문제의 원인이 된 화면으로 다시 돌아갈 수 있어서,
    // 초기 화면으로 완전히 새로고침하며 이동시킴
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-white px-6">
          <div className="flex flex-col items-center gap-4">
            <EmptyState
              icon="🛠️"
              title="일시적인 문제가 발생했어요"
              description="불편을 드려 죄송해요. 다시 시도해주세요"
            />
            <button
              type="button"
              onClick={this.handleGoHome}
              className="rounded-lg bg-[#6B5DD6] px-5 py-2.5 font-wantedsans text-sm font-medium text-white"
            >
              처음으로 돌아가기
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;