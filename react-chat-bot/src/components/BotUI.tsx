import { useState, useEffect } from 'react';
import EventBus from '../helpers/event-bus';
import BoardHeader from './Board/Header';
import BoardContent from './Board/Content';
import BoardAction from './Board/Action';
import AppStyle from './AppStyle';
import '../assets/scss/_app.scss'
import { CSSTransition } from 'react-transition-group';

type Props = {
  options?: Record<string, unknown>;
  messages?: Array<any>;
  botTyping?: boolean;
  inputDisable?: boolean;
  isOpen?: boolean;
  clearButton?: boolean;
  ratingEnable?: boolean;
  onInit?: () => void;
  onOpen?: () => void;
  onDestroy?: () => void;
  onMsgSend?: (value: string) => void;
  onMsgClear?: () => void;
};

const BotUI: React.FC<Props> = ({
  options = {},
  messages = [],
  botTyping = false,
  inputDisable = false,
  isOpen = false,
  clearButton = false,
  ratingEnable = false,
  onInit = () => {},
  onOpen = () => {},
  onDestroy = () => {},
  onMsgSend = () => {},
  onMsgClear = () => {},
}) => {
  const [botActive, setBotActive] = useState<boolean>(false);
  const [notification, setNotification] = useState<boolean>(false);
  const [showFadeUp, setShowFadeUp] = useState(true);
  const [showScaleUp, setShowScaleUp] = useState(true);

  const defaultOptions = {
    botTitle: 'Chatbot',
    colorScheme: '#1b53d0',
    textColor: '#fff',
    bubbleBtnSize: 56,
    animation: true,
    boardContentBg: '#fff',
    botAvatarSize: 32,
    botAvatarImg: 'http://placehold.it/200x200',
    userAvatarSize: 32,
    userAvatarImg: null,
    msgBubbleBgBot: '#f0f0f0',
    msgBubbleColorBot: '#000',
    msgBubbleBgUser: '#4356e0',
    msgBubbleColorUser: '#fff',
    inputPlaceholder: 'Message',
    inputDisableBg: '#fff',
    inputDisablePlaceholder: null,
    iconSendSrc: '/icons/send.svg',
    iconBubbleSrc: '/icons/bubble.svg',
    iconCloseSrc: '/icons/close.svg',
    iconCloseHeaderSrc: '/icons/arrow-down-invert.svg',
  };

  const optionsMain = { ...defaultOptions, ...options };

  useEffect(() => {
    if (isOpen) {
      setBotActive(true);
    }
    onInit();
    return () => {
      onDestroy();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!botActive) {
      setNotification(true);
    }
  }, [messages]);

  useEffect(() => {
    if (botActive) {
      onOpen();
      setNotification(false);
    } else {
      onDestroy();
    }
  }, [botActive]);

  const botToggle = () => {
    setBotActive(!botActive);
  };

  const sendMessage = (value: string) => {
    onMsgSend(value);
  };

  const selectOption = (value: string) => {
    onMsgSend(value);
  };

  const clearChat = () => {
    onMsgClear();
  };

  const uiClasses = [];
  if (optionsMain.animation) {
    uiClasses.push('qkb-bot-ui--animate');
  }

  return (
    <div className={uiClasses.join(' ')}>
      {botActive && (
        <BoardHeader
          bot-title={optionsMain.botTitle}
          icon-close-erc={optionsMain.iconCloseHeaderSrc}
          on-close-bot={botToggle}
        >
          <template slot="header">
            <slot name="header" />
          </template>
        </BoardHeader>
      )}
      <CSSTransition in={showFadeUp} classNames="qkb-fadeUp" timeout={300}>
        <div className="qkb-board" v-if={botActive}>
          <BoardContent
            bot-typing={botTyping}
            mainData={messages}
            show-user-icon={optionsMain.userAvatarImg !== null}
            rating-enable={ratingEnable}
          />
          <BoardAction
            input-disable={inputDisable}
            input-placeholder={optionsMain.inputPlaceholder}
            input-disable-placeholder={optionsMain.inputDisablePlaceholder}
            icon-send-src={optionsMain.iconSendSrc}
            clear-button={clearButton}
            onMessageSend={sendMessage}
          />
        </div>
      </CSSTransition>
      <div className="qkb-bot-bubble">
        {notification && <span className="qkb-bubble-notification" />}
        <button className="qkb-bubble-btn" onClick={botToggle}>
          <slot name="bubbleButton" />
          <CSSTransition in={showScaleUp} classNames="qkb-scaleUp" timeout={300}>
            {!botActive && (
              <img
                className="qkb-bubble-btn-icon"
                src={optionsMain.iconBubbleSrc}
                key="1"
              />
            )}
            {botActive && (
              <img
                className="qkb-bubble-btn-icon qkb-bubble-btn-icon--close"
                src={optionsMain.iconCloseSrc}
                key="2"
              />
            )}
          </CSSTransition>
        </button>
      </div>
      <AppStyle options={optionsMain} />
      <div className="qkb-preload-image">
        {optionsMain.botAvatarImg && (
          <div className="qkb-msg-avatar__img" />
        )}
      </div>
    </div>
  );
};

export default BotUI