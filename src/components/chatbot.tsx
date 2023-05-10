import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
// import ReactChatBot, { MessageData, MessageDataOption } from 'react-chat-bot';
import ReactChatBot, { MessageData, MessageDataOption } from 'react-chat-bot/src/react-chat-bot';
import { useSession } from 'next-auth/react';
import { useAxios } from '@/lib/api'

import { useDispatch, useSelector } from "react-redux";
import { setIsOpen, setMessageData as setMessageDataRedux, addMessageData, clearMessageData } from "@/store/slices/botSlice";
import { selectBotisOpen, selectBotMessageData } from "@/store/slices/botSlice";
import styles from './chatbot.module.scss';


type Props = {
  style?: React.CSSProperties;
  isOpen?: boolean;
  isDropMenu?: boolean;
  startMessageDelay?: number;
  scenario?: MessageData[][];
  questionId?: string | null;
  clearButton?: boolean;
  storeMessage?: boolean;
  ratingEnable?: boolean;
  onChange?: (emit: string, value: any) => void;
};

const ChatBot: React.FC<Props> = ({
  style = {},
  isOpen = false,
  isDropMenu = true,
  startMessageDelay = 0,
  scenario = [],
  questionId = null,
  clearButton = false,
  storeMessage = false,
  ratingEnable = false,
  onChange = () => {},
}) => {
  const { data: session }: any = useSession()
  const axios = useAxios(session?.accessToken);
  const router = useRouter();

  const [messageData, setMessageData] = useState<Array<MessageData>>([]);
  const [botTyping, setBotTyping] = useState(false);
  const [inputDisable, setInputDisable] = useState<boolean>(scenario.length === 0 ? false : true);
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const dispatch = useDispatch();
  const isOpenRedux = useSelector(selectBotisOpen);
  const messageDataRedux = useSelector(selectBotMessageData);

  const MessageUnrelated = '저는 당신의 영어 실력을 향상시키기 위해 도와주는 글라이디입니다! 당신의 학습에 도움이 되는 질문이라면 모두 답변해 드릴 수 있으니, 문제와 관련된 질문을 작성해주세요 😊';
  let messageSound: HTMLAudioElement | null

  const botOptions = {
    botTitle: 'Glide',
    colorScheme: '#fff',
    textColor: '#000',
    bubbleBtnSize: 60,
    boardContentBg: isDropMenu ? '#F9FAFB' : '#F3F4F6',
    botAvatarSize: 40,
    botAvatarImg: '/icons/pinata.png',
    userAvatarSize: 40,
    userAvatarImg: '/icons/user.svg',
    msgBubbleBgBot: '#fff',
    msgBubbleBgUser: '#EFF6FF',
    msgBubbleColorUser: '#000',
    inputPlaceholder: 'Send Message',
    inputDisableBg: '#fff',
    inputDisablePlaceholder: 'Hit the buttons above to respond',
    iconSendSrc: '/icons/send-white.svg',
    iconBubbleSrc: '/icons/bubble.svg',
    iconCloseSrc: '/icons/close.svg',
    iconCloseHeaderSrc: '/icons/arrow-down-invert.svg',
  };

  useEffect(() => {
    messageSound = new Audio('/audios/bubble.mp3')
    messageSound.volume = 0.7
    
    return () => {
      if (messageSound) {
        messageSound.pause()
        messageSound = null
      }
    }
  }, [])

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  useEffect(() => {
    if (isMountedRef.current) {
      startScenario();
    }
  }, [scenario]);

  const startScenario = () => {
    if (scenario.length > 0) {
      setTimeout(() => {
        nextScenario(true);
      }, startMessageDelay);
    }
  };

  const nextScenario = (init: boolean = false) => {
    let _scenarioIndex = scenarioIndex;

    if (init) {
      setScenarioIndex(0);
      _scenarioIndex = 0;
    }

    if (_scenarioIndex > scenario.length - 1) {
      console.log('다음 시나리오가 없습니다.');
      return;
    }

    for (let i = 0; i < scenario[_scenarioIndex].length; i++) {
      setBotTyping(true);
      setTimeout(() => {
        const message = scenario[_scenarioIndex][i];
        updateMessageData(message);

        if (isOpen) {
          messageSound?.play();
        }
        setInputDisable(message.disableInput ?? false);

        if (i === scenario[_scenarioIndex].length - 1) {
          if (!message.botTyping) {
            setBotTyping(false);
          }
          setScenarioIndex((prevIndex) => prevIndex + 1);
        }
      }, (i + 1) * 1500);
    }
  };

  const msgSend = (data: MessageDataOption) => {
    if (data.to !== undefined) {
      return router.push(data.to);
    } else if (data.emit !== undefined) {
      onChange(data.emit, { key: data.emit.slice(data.emit.indexOf(':')+1), value: data.value})
    }

    const text = data.value !== 'Give me more hints' ? data.text : 'Give me more hints';

    // Push the user's message to board
    const message: MessageData = {
      agent: 'user',
      type: 'text',
      text: text,
    };

    updateMessageData(message);

    if (scenarioIndex <= scenario.length - 1) {
      nextScenario();
    } else {
      getResponse(text);
    }
  };

  const msgClear = () => {
    if (storeMessage) {
      dispatch(clearMessageData())
    } else {
      setMessageData([]);
    }
    startScenario();
  };

  const getResponse = (text: any) => {
    // Loading
    setBotTyping(true);
  
    // Post the message from user here
    // Then get the response as below
  
    // Create new message from fake data
    axios.post('/chat', { questionId: questionId, text: text }, {
      headers: {
        'Authorization': `Bearer ${session?.accessToken}`
      }
    })
      .then(({ data }) => {
        if (data.intend === 'similar-question') {
          setBotTyping(false);
          const similarQuestionId = data.response
          return handleSimilarQuestionResponse(similarQuestionId)
        }

        let hintDenied = null;
        const scenarioStart = scenario[0][0]
        if (data.response?.includes('I can only provide 3 hints')) {
          hintDenied = true;
        } else {
          hintDenied = false;
        }

        if (scenarioStart.options === undefined) return;
  
        let sourceButtonMini = scenarioStart.options.slice(4, 5)[0];
        if (scenarioStart.options[4].text === 'Give me the source for this passage') {
          sourceButtonMini.text = 'Source for this passage';
        }
  
        const replyMessage = {
          type: 'button',
          agent: 'bot',
          text: data.intend !== 'unrelated' ? 
            data.response.replaceAll(String.fromCharCode(10), "<br>") : MessageUnrelated,
          reselectable: true,
          options: data.intend !== 'hint' ? scenarioStart.options.slice(0, 3) : 
            !hintDenied ? [
              { text: 'Want more hint?', value: 'Give me more hints', action: 'postback'},
              ...scenarioStart.options.slice(1, 4),
            ] : [
              ...scenarioStart.options.slice(1, 4), 
              sourceButtonMini,
            ]
        };
  
        updateMessageData(replyMessage);
        messageSound?.play();
  
        // finish
        setBotTyping(false);
      });
  };

  const updateMessageData = (replyMessage: MessageData) => {
    if (storeMessage) {
      dispatch(addMessageData(replyMessage));
    } else {
      setMessageData((prevData) => [...prevData, replyMessage]);
    }
  };

  const handleSimilarQuestionResponse = (similarQuestionId: number) => {
    let lastData = JSON.parse(JSON.stringify(messageDataRedux.at(-1)));
    const idx = lastData.options.findIndex((option: MessageDataOption) => option.text === 'Try a similar example')

    lastData.options[idx] = {
      text: 'Try a similar example',
      action: 'url',
      value: `/question/id/${similarQuestionId}`,
    }

    if (storeMessage) {
      dispatch(setMessageDataRedux([...messageDataRedux.slice(0, messageDataRedux.length - 1), lastData]));
    } else {
      setMessageData((prevData) => [...prevData.slice(0, prevData.length-2), lastData]);
    }

    return window.open(`/question/id/${similarQuestionId}`, '_blank');
    }

  const changeOpenState = (isOpen: boolean) => {
    dispatch(setIsOpen(isOpen));
  };

  return (
    <div
      id="chatbot" 
      style={style}
      className={`${styles.chatbot} ${!isDropMenu && "not-drop-menu"} ${isOpenRedux && "is-open"}`}
    >
      <ReactChatBot
        options={botOptions}
        messages={storeMessage ? messageDataRedux : messageData}
        botTyping={botTyping}
        inputDisable={inputDisable || botTyping}
        isOpen={isOpen}
        clearButton={clearButton}
        ratingEnable={ratingEnable}
        onMsgSend={msgSend}
        onMsgClear={msgClear}
        onOpen={() => changeOpenState(true)}
        onDestroy={() => changeOpenState(false)}
        header={
          <div slot="header" className="is-flex">
            <Image
              src="/icons/pinata.png"
              width={32}
              height={32}
              alt="pinata"
              priority
            />
            <Image
              src="/icons/title/glide-28.svg"
              width={48}
              height={16}
              alt="glide"
              priority
              className="ml-3"
            />
          </div>
        }
      />
    </div>
  );
};

export default ChatBot;