import { Params } from '../types/Params';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Link } from '@mui/material';
import Resizer from 'react-image-file-resizer';

type DistrictFlowProps = {
  form: { district: string; image?: string };
  setForm: React.Dispatch<React.SetStateAction<{ district: string; image?: string }>>;
};

const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy';

export const handleUpload = async (params: Params, { form, setForm }: DistrictFlowProps) => {
  const uploadFile = params.file;

  if (uploadFile) {
    const formData = new FormData();
    formData.append('image_file', uploadFile);
    formData.append('district_name', form.district);

    // 디버깅을 위한 FormData 내용 출력 (Array.from 사용)
    Array.from(formData.entries()).forEach(([key, value]) => {
      if (typeof value === 'string') {
      } else if (value instanceof File) {
      }
    });

    try {
      const response = await axios
        .post('http://3.35.192.132:8000/chatbot/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            district_name: form.district,
          },
        })
        .then(response => {
          setForm({ district: params.userInput, image: params.file });
          form.district = '';
          return response;
        });
      return response;
    } catch (error) {
      console.error('파일 업로드 중 에러 발생:', error);
    }
  } else {
    console.error('업로드할 파일이 없습니다.');
  }
};

export const uploadFileFlow = ({ form, setForm }: DistrictFlowProps) => ({
  uploadFile_district: {
    message: '대형 페기물 수거 정보를 알고싶은 구를 선택해 주세요. \n(현재 관악구, 동작구, 용산구만 선택가능)',
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
      chatDisabled: true,
    },
    function: async (params: Params) => {
      setForm({ ...form, district: params.userInput });
    },
    path: 'uploadFile_start',
  },

  uploadFile_start: {
    message: '사진을 업로드 해주세요!',
    chatDisabled: true,
    file: async (params: Params) => {
      try {
        const file = params?.files?.[0] as File;
        const image: string = await new Promise((resolve, reject) => {
          Resizer.imageFileResizer(
            file, // 원본 파일
            640, // 최대 가로 너비
            640, // 최대 세로 높이
            'JPEG', // 변환할 이미지 포맷
            100, // 품질
            0, // 회전
            image => {
              resolve(image as string);
            },
            'base64', // 출력 타입
          );
        });
        setForm(form => ({ ...form, file: image }));
        return image;
      } catch (error) {
        console.error('Error resizing the image:', error);
      }
    },
    path: 'uploadFile_end',
  },

  re_upload: {
    message: '다른 사진을 업로드 해주세요!',
    chatDisabled: true,
    file: async (params: Params) => {
      try {
        const file = params?.files?.[0] as File;
        const image: string = await new Promise((resolve, reject) => {
          Resizer.imageFileResizer(
            file, // 원본 파일
            640, // 최대 가로 너비
            640, // 최대 세로 높이
            'JPEG', // 변환할 이미지 포맷
            100, // 품질
            0, // 회전
            image => {
              resolve(image as string);
            },
            'base64', // 출력 타입
          );
        });
        setForm(form => ({ ...form, file: image }));
        return image;
      } catch (error) {
        console.error('Error resizing the image:', error);
      }
    },
    path: 'uploadFile_end',
  },

  uploadFile_end: {
    streamSpeed: 10,
    message: '보내주신 사진을 분석하여 정보를 찾고 있습니다. \n잠시만 기다려주세요.',
    function: (params: Params) => {
      setForm({ district: params.userInput });
    },
    component: async (params: Params) => {
      const response = await handleUpload({ ...params, ...form }, { form, setForm });
      return (
        <Box sx={{ p: 2, border: '1px solid grey', mt: 2, marginLeft: 8, width: 300, borderRadius: 2, borderColor: 163020 }}>
          <Box component="section">
            <p>{response?.data.message}</p>
          </Box>
          <Link href={response?.data.district_url} target="_blank" variant="body2" sx={{ mt: 1 }}>
            누리집(홈페이지) 바로가기
          </Link>
        </Box>
      );
    },
    options: ['다른사진 업로드 하기', '처음으로'],
    chatDisabled: false,
    path: (params: Params) => {
      switch (params.userInput) {
        case '다른사진 업로드 하기':
          return 're_upload';
        case '처음으로':
          return 'start';
        default:
          return 'communicate';
      }
    },
  },
});
