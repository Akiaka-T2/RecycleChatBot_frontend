import { Dispatch, SetStateAction } from 'react';
import { Params } from '../types/Params';
import Box from '@mui/material/Box';
import axios from 'axios';
import { Link } from '@mui/material';

type DistrictFlowProps = {
  form: { district: string };
  setForm: Dispatch<SetStateAction<{ district: string }>>;
};

// const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy';

export const districtFlow = ({ form, setForm }: DistrictFlowProps) => ({
  district_start: {
    message: '안녕하세요! Green Seoul Bot 입니다. \n서울특별시 구별 재활용품 지원정책에 대해 궁금한것이 있다면 무엇이든지 물어보세요.',
    checkboxes: {
      items: [
        '강남구',
        '강동구',
        '강북구',
        '강서구',
        '관악구',
        '광진구',
        '구로구',
        '금천구',
        '노원구',
        '도봉구',
        '동대문구',
        '동작구',
        '마포구',
        '서대문구',
        '서초구',
        '성동구',
        '성북구',
        '송파구',
        '양천구',
        '영등포구',
        '용산구',
        '은평구',
        '종로구',
        '중구',
        '중랑구',
      ],
      max: 1,
    },
    chatDisabled: true,
    // 리팩토링 가능한 코드
    function: async (params: Params) => {
      // setForm({ ...form, district: params.userInput });
      // const url = '54.180.199.92:8000/chatbot/policy';
      // const district_name = params.userInput;
      // try {
      //   const response = await axios.post(url, { district_name: district_name });
      // } catch (error) {
      //   console.log(error);
      // }
    },

    path: 'district_end',
  },

  district_end: {
    message: `서울특별시 ${form.district}의 결과는 다음과 같습니다.`,
    function: (params: Params) => {
      setForm({ district: params.userInput });
    },
    component: async (params: Params) => {
      const url = 'http://3.35.192.132:8000/chatbot/policy';
      const district_name = params.userInput;
      console.log('district_name', params.userInput);
      try {
        const response = await axios.post(url, { district_name: district_name }).then(response => {
          console.log(response);
          form.district = '';
          return response;
        });
        console.log(response);
        console.log('message', response.data.message);

        // form.district = '';

        // console.log(typeof response);
        // console.log(typeof district_name);

        return (
          <Box sx={{ p: 2, border: '1px solid grey', mt: 2, marginLeft: 8, width: 300, borderRadius: 2, borderColor: 163020 }}>
            <Box component="section">
              <p>{response.data.message}</p>
            </Box>
            <Link href={response.data.district_url} target="_blank" variant="body2" sx={{ mt: 1 }}>
              누리집(홈페이지) 바로가기
            </Link>
          </Box>
        );
      } catch (error) {
        console.log(error);
      }
    },
    options: ['처음으로'],
    path: (params: Params) => {
      switch (params.userInput) {
        case '처음으로':
          return 'start';
        default:
          return 'communicate';
      }
    },
  },
});
