import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// import ReactChatBot, { MessageData, MessageDataOption } from 'react-chat-bot';
import ReactChatBot, { MessageData, MessageDataOption } from 'react-chat-bot/src/react-chat-bot';

import { useDispatch, useSelector } from "react-redux";
import { setIsOpen, addMessageData, clearMessageData } from "../store/slices/botSlice";
import { selectBotisOpen, selectBotMessageData } from "../store/slices/botSlice";


type Props = {
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
  const router = useRouter();

  const initialScenario = scenario
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
    if (isMountedRef.current && scenario !== initialScenario) {
      startScenario();
    }
  }, [scenario]);

  const botStart = () => {
    startScenario();
  };

  const startScenario = () => {
    setScenarioIndex(0);
    if (scenario.length > 0) {
      setTimeout(() => {
        nextScenario();
      }, startMessageDelay);
    }
  };

  const nextScenario = () => {
    if (scenarioIndex > scenario.length - 1) {
      console.log('다음 시나리오가 없습니다.');
      return;
    }

    for (let i = 0; i < scenario[scenarioIndex].length; i++) {
      setBotTyping(true);
      setTimeout(() => {
        const message = scenario[scenarioIndex][i];

        if (storeMessage) {
          setMessageData((prevData) => [...prevData, message]);
        } else {
          setMessageData((prevData) => [...prevData, message]);
        }

        if (isOpen) {
          const messageSound = new Audio('/audios/bubble.mp3');
          messageSound.muted = true;
          messageSound.play();
          messageSound.muted = false;
        }
        setInputDisable(message.disableInput ?? false);

        if (i === scenario[scenarioIndex].length - 1) {
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

    if (storeMessage) {
      dispatch(addMessageData(message));
    } else {
      setMessageData((prevData) => [...prevData, message]);
    }

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
    axios.post('/chat', { questionId: questionId, text: text })
      .then(response => {
        let hintDenied = null;
        if (response.data.response?.includes('I can only provide 3 hints')) {
          hintDenied = true;
        } else {
          hintDenied = false;
        }

        if (scenario[0][0].options === undefined) return;
  
        let sourceButtonMini = scenario[0][0].options.slice(4, 5)[0];
        if (scenario[0][0].options[4].text === 'Give me the source for this passage') {
          sourceButtonMini.text = 'Source for this passage';
        }
  
        const replyMessage = {
          type: 'button',
          agent: 'bot',
          text: response.data.intend !== 'unrelated' ? 
            response.data.response.replaceAll(String.fromCharCode(10), "<br>") : MessageUnrelated,
          reselectable: true,
          options: response.data.intend !== 'hint' ? scenario[0][0].options.slice(0, 3) : 
            !hintDenied ? [
              { text: 'Want more hint?', value: 'Give me more hints', action: 'postback'},
              ...scenario[0][0].options.slice(1, 4),
            ] : [
              ...scenario[0][0].options.slice(1, 4), 
              sourceButtonMini,
            ]
        };
  
        if (storeMessage) {
          dispatch(addMessageData(replyMessage));
        } else {
          setMessageData([...messageData, replyMessage]);
        }
        messageSound?.play();
  
        // finish
        setBotTyping(false);
      });
  };

  const changeOpenState = (isOpen: boolean) => {
    dispatch(setIsOpen(isOpen));
  };

  return (
    <div
      id="chatbot" 
      className={`${!isDropMenu && "not-drop-menu"} ${isOpenRedux && "is-open"}`}
    >
      <ReactChatBot
        options={botOptions}
        messages={storeMessage ? messageDataRedux : messageData}
        botTyping={botTyping}
        inputDisable={inputDisable || botTyping}
        isOpen={isOpen}
        clearButton={clearButton}
        ratingEnable={ratingEnable}
        onInit={botStart}
        onMsgSend={msgSend}
        onMsgClear={msgClear}
        onOpen={() => changeOpenState(true)}
        onDestroy={() => changeOpenState(false)}
        header={
          <div slot="header" className="is-flex">
            <img
              src="/icons/pinata.png"
              width="32"
              height="32"
              alt="pinata"
            />
            <img
              className="ml-3"
              src="/icons/title/glide-28.svg"
              alt="title"
            />
          </div>
        }
      />
    </div>
  );
};

export default ChatBot;