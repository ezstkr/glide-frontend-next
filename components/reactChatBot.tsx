import React, { useState, useEffect, useRef } from 'react';
import BotIcon from '~/assets/icons/pinata.png';
import userIcon from '~/assets/icons/user.svg';
import VueChatBot from 'vue-chat-bot';
import axios from 'axios';

export interface MessageData {
  agent: string;
  type: string;
  text: string;
  createdAt?: string;
  disableInput: boolean;
  reselectable?: boolean;
  botTyping?: boolean;
  options?: {
    text: string;
    value: any;
    action: string;
    emit?: string;
    type?: string;
    to?: string;
  }[];
  options_multiple_choice?: {
    text: string;
    action: string;
    value: string;
  }[];
}

type Props = {
  isOpen?: boolean;
  isDropMenu?: boolean;
  startMessageDelay?: number;
  scenario?: Array<Array<MessageData>>;
  questionId?: string | null;
  clearButton?: boolean;
  storeMessage?: boolean;
  ratingEnable?: boolean;
};

const BotUI: React.FC<Props> = ({
  isOpen = false,
  isDropMenu = true,
  startMessageDelay = 0,
  scenario = [],
  questionId = null,
  clearButton = false,
  storeMessage = false,
  ratingEnable = false,
}) => {
  const [messageData, setMessageData] = useState<Array<MessageData>>([]);
  const [botTyping, setBotTyping] = useState(false);
  const [inputDisable, setInputDisable] = useState<boolean>(scenario.length === 0 ? false : true);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const MessageUnrelated = '저는 당신의 영어 실력을 향상시키기 위해 도와주는 글라이디입니다! 당신의 학습에 도움이 되는 질문이라면 모두 답변해 드릴 수 있으니, 문제와 관련된 질문을 작성해주세요 😊';


  useEffect(() => {
    const messageSound = new Audio('/audios/bubble.mp3');
    messageSound.volume = 0.7;
  }, []);

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
        setInputDisable(message.disableInput);

        if (i === scenario[scenarioIndex].length - 1) {
          if (!message.botTyping) {
            setBotTyping(false);
          }
          setScenarioIndex((prevIndex) => prevIndex + 1);
        }
      }, (i + 1) * 1500);
    }
  };

  const msgSend = (data) => {
    if (data.to !== undefined) {
      return history.push(data.to);
    } else if (data.emit !== undefined) {
      onChange(data);
    }

    const text = data.value !== 'Give me more hints' ? data.text : 'Give me more hints';

    // Push the user's message to board
    const message = {
      agent: 'user',
      type: 'text',
      text: text,
    };

    if (storeMessage) {
      setMessageData((prevData) => [...prevData, message]);
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
    if (props.storeMessage) {
      props.clearMessageData();
    } else {
      setMessageData([]);
    }
    startScenario();
  };

  const getResponse = (text) => {
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
  
        setMessageData([...messageData, replyMessage]);
        setMessageSound(new Audio('/audios/bubble.mp3'));
        setTimeout(() => {
          messageSound.current.play();
        }, 0);
  
        // finish
        setBotTyping(false);
      })
  };

  return (
    <div
      id="chatbot"
      className={`not-drop-menu ${!isDropMenu && "not-drop-menu"} ${
        isOpenState && "is-open"
      }`}
    >
      <VueChatBot
        options={BotOptions}
        messages={storeMessage ? messageDataStored : messageData}
        bot-typing={botTyping}
        input-disable={inputDisable || botTyping}
        is-open={isOpen}
        clear-button={clearButton}
        rating-enable={ratingEnable}
        onInit={botStart}
        onMsgSend={msgSend}
        onMsgClear={msgClear}
        onOpen={() => changeOpenState(true)}
        onDestroy={() => changeOpenState(false)}
      >
        <div slot="header" className="is-flex">
          <img
            src="~/assets/icons/pinata.png"
            width="32"
            height="32"
            alt="pinata"
          />
          <img
            className="ml-3"
            src="~/assets/icons/title/glide-28.svg"
            alt="title"
          />
        </div>
      </VueChatBot>
    </div>
  );
};

export default ChatBot;