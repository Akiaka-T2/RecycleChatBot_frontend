import ChatBot from 'react-chatbotify';
import { Params } from './types/Params';
import React, { useRef } from 'react';
import { uploadFileFlow } from './flows/uploadFileFlow';
import Box from '@mui/material/Box';
import axios from 'axios';
import './styles/chatbotStyle.css';
import './styles/backgroundStyle.css';
import { districtFlow } from './flows/districtFlow';

function App() {
  const [form, setForm] = React.useState<{ district: string }>({
    district: '',
  });

  // const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy';

  // console.log('form', form);
  const settings = {
    isOpen: false,
    general: {
      fontFamily: 'Pretendard-Regular',
      primaryColor: '#304D30',
      actionDisabledIcon: 'none',
    },
    tooltip: {
      mode: 'CLOSE',
      text: 'Click Me!',
    },
    chatHistory: {
      disabled: true,
    },
    chatWindow: {
      showMessagePrompt: false,
    },
    header: {
      title: (
        <div className="header-container" style={{ display: 'flex' }}>
          <div className="header-title" style={{ color: '#163020', fontSize: '28px', fontWeight: '600' }}>
            Green Seoul Bot
          </div>
        </div>
      ),
      avatar: '',
      showAvatar: false,
      closeChatIcon: 'https://img.icons8.com/?size=100&id=1NVn5K29mOSz&format=png&color=000000',
    },
    botBubble: {
      showAvatar: true,
      avatar: 'https://img.icons8.com/?size=100&id=13446&format=png&color=000000',
      simStream: true,
      streamSpeed: 60,
    },
    notification: {
      disabled: true,
    },
    chatInput: {
      enabledPlaceholderText: '메세지를 입력해주세요.',
      botDelay: 1500,
    },
    fileAttachment: {
      showMediaDisplay: true,
      sendFileName: false,
      multiple: false,
      accept: '*',
    },
    footer: {
      text: (
        <div>
          <span>Team </span>
          <span style={{ fontWeight: 'bold' }}>4cycle</span>
        </div>
      ),
    },
    emoji: {
      disabled: true,
    },
  };

  const inputTextRef = useRef('');

  const helpOptions = ['사용방법', '재활용품 지원정책', '이미지로 대형폐기물 수수료 알아보기'];
  const howToReCycle = ['재활용품 지원 정책', '이미지로 대형폐기물 수수료 알아보기'];

  const flow = {
    start: {
      message: '안녕하세요! \n서울 Green Seoul Bot 입니다. \n재활용품과 관련하여 궁금한 것이 있으시다면 무엇이든지 물어보세요!',
      options: helpOptions,
      function: (params: Params) => {
        setForm({ district: params.userInput });
      },
      path: (params: Params) => {
        inputTextRef.current = params.userInput;
        switch (params.userInput) {
          case '사용방법':
            return 'middle';
          case '재활용품 지원정책':
            return 'district_start';
          case '이미지로 대형폐기물 수수료 알아보기':
            return 'uploadFile_district';
          default:
            return 'communicate';
        }
      },
    },

    middle: {
      message:
        '저는 재활용품과 관련된 여러분들의 궁금증을 해결해 드리는 Green Seoul Bot입니다. \n\n재활용품 지원 정책이나 버리고자 하는 대형폐기물의 사진을 올려주시면 제가 알려드릴게요! \n\n<Green Seoul Bot의 기능> \n1. 재활용품 지원정책 안내 \n정책정보를 확인 할 지역구를 선택하거나 메세지로 입력하시면 해당 지역구에서 시행하는 정책정보를 알려드려요. \n\n2. 물건 분리배출 방법 안내 \n버리고자 하는 대형폐기물의 사진을 첨부하시면 사진을 분석하여 해당 폐기물의 구별 수수료를 알려드려요.',
      function: (params: Params) => {
        setForm({ district: params.userInput });
      }, // 추가
      options: howToReCycle,
      path: 'how_to_recycle',
    },

    how_to_recycle: {
      transition: { duration: 0 },
      path: (params: Params) => {
        switch (params.userInput) {
          case '재활용품 지원 정책':
            return 'district_start';
          case '이미지로 대형폐기물 수수료 알아보기':
            return 'uploadFile_district';
          default:
            return 'communicate';
        }
      },
    },

    communicate: {
      function: (params: Params) => {
        setForm({ district: params.userInput });
      },
      message: async (params: Params) => {
        console.log(params);
        // 이미지로 대형폐기물 배출 안내
        // if (params.prevPath === 'uploadFile_end') return;
        const url = 'http://3.35.192.132:8000/chatbot/chat';
        const user_input = form.district;
        try {
          const response = await axios.post(url, { user_input: user_input }).then(response => {
            console.log(response);
            form.district = '';
            return response.data.message;
          });
          return response;
        } catch (error) {
          console.log(error);
        }
      },
      options: (form as any).file ? undefined : ['처음으로'],
      path: (params: Params) => {
        switch (params.userInput) {
          case '처음으로':
            return 'start';
          default:
            return 'communicate';
        }
      },
    },

    ...districtFlow({ form, setForm }),
    ...uploadFileFlow({ form, setForm }),
  };

  return (
    <>
      <Box>
        <ChatBot settings={settings} flow={flow} />
      </Box>
    </>
  );
}

export default App;
