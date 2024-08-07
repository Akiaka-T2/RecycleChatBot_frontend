import React from 'react';
import ChatBot from 'react-chatbotify';

interface Params {
  userInput: string; // 단일 선택값을 처리하기 위해 string 타입으로 정의합니다.
  injectMessage: (message: string) => Promise<void>; // injectMessage를 함수 타입으로 정의합니다.
}

function App() {
  const [form, setForm] = React.useState<{ district: string }>({
    district: '',
  });

  const options = {
    theme: {
      embedded: true,
      primaryColor: '#526931',
      secondaryColor: '#526931',
    },
    chatHistory: {
      storageKey: 'example_theming',
    },
    header: {
      title: <h1 className="font-semibold">Recycle ChatBot</h1>,
      showAvatar: false,
    },
    footer: {
      text: (
        <div>
          <span>Powered By </span>
          <span className="font-bold">
            <span>Recycle Team</span>
          </span>
        </div>
      ),
    },
  };

  const flow = {
    start: {
      message: '안녕하세요! Recycle ChatBot 입니다. 서울특별시 구별 재활용품 지원정책에 대해 궁금한것이 있다면 무엇이든지 물어보세요.',
      checkboxes: { items: ['서초구', '광진구', '도봉구', '관악구', '강남구'], max: 1 },
      chatDisabled: true,
      function: (params: Params) => setForm({ ...form, district: params.userInput }),
      // path: 'ask_work_days',
      path: 'end',
    },

    end: {
      message: `서울특별시 ${form.district}의 결과는 다음과 같습니다.`,
      render: (
        <div className="text-orange-400 max-w-80 mt-4 ml-5">
          <p>서울특별시 {form.district}의 결과는 다음과 같습니다.</p>
          <p>페트병 10개</p>
          <p>종량제 봉투 10L 1개</p>
        </div>
      ),
    },
  };

  return (
    <div className="App">
      <ChatBot options={options} flow={flow} />
    </div>
  );
}

export default App;
