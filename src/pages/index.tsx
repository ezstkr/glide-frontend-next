import { useState, useEffect } from 'react';
import Image from 'next/image';
import ChatBot from '@/components/chatbot';
import { CreateCurriculumForm } from '@/shared/types/user';
import { MessageData } from "react-chat-bot/src/shared/types/react-chat-bot";
import { signOut } from 'next-auth/react'

import { useDispatch, useSelector } from "react-redux";
import { createCurriculum } from "@/store/slices/userSlice";
// import { selectUserCurriculum } from "@/store/slices/userSlice";
import { clearMessageData } from "@/store/slices/botSlice";

import { CSSTransition } from 'react-transition-group';
import styles from './index.module.scss';
import useToast from '@/hooks/useToast';


export default function Index() {
  const dispatch = useDispatch();
  // const userCurriculum = useSelector(selectUserCurriculum);
  const { showToast } = useToast()

  const [createCurriculumForm, setCreateCurriculumForm] = useState<CreateCurriculumForm>({});
  const [transition, setTransition] = useState({
    after_1000: false,
    after_2000: false,
    after_3500: false,
  });
  const [scenario, setScenario] = useState<MessageData[][]>([
    [
      {
        agent: 'bot',
        type: 'text',
        text: '안녕하세요! 당신의 토플 교육을 도와줄 글라이디입니다 :)',
        disableInput: true,
      },
      {
        agent: 'bot',
        type: 'text',
        text: '오늘은 Reading 부분부터 수업을 진행할 예정입니다. 맞춤형 커리큘럼을 제작하기 위해 몇 가지 질문을 드리겠습니다!',
        disableInput: true,
      },
      {
        agent: 'bot',
        type: 'button',
        text: '처음 토플 공부인가요?',
        disableInput: true,
        options: [
          {
            text: 'Yes',
            value: true,
            action: 'postback',
            emit: 'update:newbie',
          },
          {
            text: 'No',
            value: false,
            action: 'postback',
            emit: 'update:newbie',
          },
        ],
      },
    ],
    [
      {
        agent: 'bot',
        type: 'button',
        text: '당신의 영어 실력은 어느 수준인가요?',
        disableInput: true,
        options: [
          {
            text: '초급',
            value: 1,
            action: 'postback',
            emit: 'update:difficulty',
          },
          {
            text: '중급',
            value: 2,
            action: 'postback',
            emit: 'update:difficulty',
          },
          {
            text: '고급',
            value: 3,
            action: 'postback',
            emit: 'update:difficulty',
          },
        ],
      },
    ],
    [
      {
        agent: 'bot',
        type: 'button',
        text: '어떤 분야의 글을 읽는 것이 가장 어렵나요?',
        disableInput: true,
        options: [
          {
            text: '제출하기',
            value: null,
            action: 'postback',
            emit: 'update:topics',
          },
        ],
        options_multiple_choice: [
          {
            text: 'science',
            value: 'science',
          },
          {
            text: 'history',
            value: 'history',
          },
          {
            text: 'economics',
            value: 'economics',
          },
          {
            text: 'literature',
            value: 'literature',
          },
        ]
      },
    ],
    [
      {
        agent: 'bot',
        type: 'text',
        text: '맞춤형 커리큘럼을 생성하고 있습니다. 잠시만 기다려주세요 😊',
        disableInput: true,
        botTyping: true,
      },
    ]
  ]);
  const [scenario2] = useState<MessageData[][]>([
    [
      {
        agent: 'bot',
        type: 'button',
        text: '자 준비가 되셨으면 시작해볼까요? 🚀',
        disableInput: true,
        options: [
          {
            text: 'Let’s Start!',
            value: null,
            action: 'url',
          },
        ],
      },
    ],
  ]);

  useEffect(() => {
    setAnimationTimeout();
  }, []);

  function moveTitle() {
    const title = document.querySelector('#title');
    const chatBox = document.querySelector('.qkb-board-content__bubbles');
    if (title === null || chatBox === null || chatBox.parentNode === null) return;
    chatBox.before(title);
    document.documentElement.style.setProperty('--bottop', '0px');
    document.documentElement.style.setProperty('--title-margin-bottom', '40px');
  }

  function setAnimationTimeout() {
    setTimeout(() => {
      setTransition((prev) => ({ ...prev, after_1000: true }));
    }, 1000);
    setTimeout(() => {
      setTransition((prev) => ({ ...prev, after_2000: true }));
    }, 2000);
    setTimeout(() => {
      setTransition((prev) => ({ ...prev, after_3500: true }));
      moveTitle();
    }, 3500);
  }

  async function updateForm({ key, value }: { key: string; value: any }) {
    setCreateCurriculumForm((prev) => ({ ...prev, [key]: value }));

    if (key === 'topics') {
      const result: any = await dispatch(createCurriculum({
        ...createCurriculumForm,
        [key]: value,
      }));
      
      if (!result.error) {
        const _userCurriculum = result.payload;
        dispatch(clearMessageData());
        if (scenario2[0][0].options) {
          scenario2[0][0].options[0].value = `/question/id/${
            _userCurriculum.length !== 0 ? _userCurriculum[0].questionId : 0
          }`;
        }
        setScenario(scenario2);
      } else {
        await signOut()
        showToast({ message: '서버 오류!' })
      }
    }
  }

  function handleChatBotEvent(emit: string, data: any) {
    if ([
        'update:newbie', 
        'update:difficulty', 
        'update:topics'
      ].includes(emit)) {
      updateForm({ key: data.key, value: data.value });
    }
  }

  return (
    <div className={`${styles.page} has-background-light2`}>
      <CSSTransition in={transition.after_1000} classNames="slide-y-down" timeout={300} mountOnEnter>
        <div id="title" className={`${styles.title} ${transition.after_2000 ? styles.titleMoved : ''}`}>
          <h1>
            Welcome to <Image src="/icons/title/glide-30.svg" alt="Glide" width={72} height={23} priority />!
          </h1>
          <h2 className="mt-2">Your personalized AI Tutor for TOEFL</h2>
        </div>
      </CSSTransition>

      <ChatBot
        style={{ display: transition.after_3500 ? 'block' : 'none' }}
        isOpen={true}
        isDropMenu={false}
        startMessageDelay={3500}
        scenario={scenario}
        onChange={handleChatBotEvent}
      />
    </div>
  );
};
