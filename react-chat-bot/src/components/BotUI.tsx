import { useState, useRef, useEffect } from 'react';
import EventBus from '../helpers/event-bus';
import BoardHeader from './Board/Header';
import BoardContent from './Board/Content';
import BoardAction from './Board/Action';
import AppStyle from './AppStyle';
import { MessageDataOption } from '../shared/types/react-chat-bot';

// import '../assets/scss/_app.scss'
import { CSSTransition } from 'react-transition-group';

type Props = {
  options?: Record<string, unknown>;
  messages?: Array<any>;
  botTyping?: boolean;
  inputDisable?: boolean;
  isOpen?: boolean;
  clearButton?: boolean;
  ratingEnable?: boolean;
  header?: React.ReactNode;
  bubbleButton?: React.ReactNode;
  onInit?: () => void;
  onOpen?: () => void;
  onDestroy?: () => void;
  onMsgSend?: (value: MessageDataOption) => void;
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
  header = null,
  bubbleButton = null,
  onInit = () => {},
  onOpen = () => {},
  onDestroy = () => {},
  onMsgSend = () => {},
  onMsgClear = () => {},
}) => {
  const [botActive, setBotActive] = useState(false);
  const [notification, setNotification] = useState(false);
  const nodeRef = useRef(null);
  const nodeRefClose = useRef(null);
  const nodeRefOpen = useRef(null);

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
    inputDisablePlaceholder: undefined,
    iconSendSrc: '/icons/send.svg',
    iconBubbleSrc: '/icons/bubble.svg',
    iconCloseSrc: '/icons/close.svg',
    iconCloseHeaderSrc: '/icons/arrow-down-invert.svg',
  };

  const optionsMain = { ...defaultOptions, ...options };

  useEffect(() => {
    EventBus.on('select-button-option', selectOption);

    return () => {
      EventBus.off('select-button-option', selectOption);
    }
  });

  useEffect(() => {
    if (isOpen) {
      setBotActive(true);
    }
    onInit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!botActive) {
      setNotification(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (botActive) {
      onOpen();
      setNotification(false);
    } else {
      onDestroy();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botActive]);

  const botToggle = () => {
    setBotActive(!botActive);
  };

  const sendMessage = (value: MessageDataOption) => {
    onMsgSend(value);
  };

  const selectOption = (value: MessageDataOption) => {
    onMsgSend(value);
  };

  const clearChat = () => {
    onMsgClear();
  };

  const uiClasses = [];
  uiClasses.push('qkb-bot-ui');

  if (optionsMain.animation) {
    uiClasses.push('qkb-bot-ui--animate');
  }

  return (
    <div className={uiClasses.join(' ')}>
      <CSSTransition in={botActive} nodeRef={nodeRef} classNames="qkb-fadeUp" unmountOnExit timeout={300}>
          <div ref={nodeRef} className="qkb-board">
            <BoardHeader
              botTitle={optionsMain.botTitle}
              iconCloseSrc={optionsMain.iconCloseHeaderSrc}
              onCloseBot={botToggle}
            >
              {header ?? (
                header
              )}
            </BoardHeader>
            <BoardContent
              botTyping={botTyping}
              mainData={messages}
              showUserIcon={optionsMain.userAvatarImg !== null}
              ratingEnable={ratingEnable}
            />
            <BoardAction
              inputDisable={inputDisable}
              inputPlaceholder={optionsMain.inputPlaceholder}
              inputDisablePlaceholder={optionsMain.inputDisablePlaceholder}
              iconSendSrc={optionsMain.iconSendSrc}
              clearButton={clearButton}
              onMessageSend={sendMessage}
            />
          </div>
      </CSSTransition>
      <div className="qkb-bot-bubble">
        {notification && <span className="qkb-bubble-notification" />}
        <button className="qkb-bubble-btn" onClick={botToggle}>
          {bubbleButton ? (
            bubbleButton
          ) : (
          <>
            <CSSTransition in={!botActive} nodeRef={nodeRefOpen} classNames="qkb-scaleUp" unmountOnExit timeout={300}>
              <img
                ref={nodeRefOpen}
                className="qkb-bubble-btn-icon"
                src={optionsMain.iconBubbleSrc}
                key="1"
                alt="icon-bubble"
              />
            </CSSTransition>
            <CSSTransition in={botActive} nodeRef={nodeRefClose} classNames="qkb-scaleUp" unmountOnExit timeout={300}>
              <img
                ref={nodeRefClose}
                className="qkb-bubble-btn-icon qkb-bubble-btn-icon--close"
                src={optionsMain.iconCloseSrc}
                key="2"
                alt="icon-close"
              />
            </CSSTransition>
          </>
          )}
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