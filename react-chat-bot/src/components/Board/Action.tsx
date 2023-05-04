import React, { useState, useRef, useEffect } from 'react';

interface Props {
  inputPlaceholder?: string;
  inputDisablePlaceholder?: string;
  inputDisable?: boolean;
  iconSendSrc?: string;
  clearButton?: boolean;
  onMessageSend: (value: any) => void;
}

const QKBBoardAction: React.FC<Props> = ({
  inputPlaceholder = '',
  inputDisablePlaceholder = '',
  inputDisable = false,
  iconSendSrc = '/icons/send.svg',
  clearButton = false,
  onMessageSend,
}) => {
  const [messageText, setMessageText] = useState<string | null>(null);
  const qkbMessageInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputDisable) {
      setTimeout(() => {
        qkbMessageInput.current?.focus();
      }, 100);
    }
  }, [inputDisable]);

  const handleSendMessage = () => {
    if (messageText) {
      onMessageSend({ text: messageText });
      setMessageText(null);
    }
  };

  const handleClearMessageText = () => {
    setMessageText(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const actionClass = () => {
    const actionClasses = ['qkb-board-action'];

    if (inputDisable) {
      actionClasses.push('qkb-board-action--disabled');
    }

    if (messageText) {
      actionClasses.push('qkb-board-aciton--typing');
    }

    // TODO: sending

    return actionClasses.join(' ');
  };

  return (
    <div className={actionClass()}>
      <div className="qkb-board-action__wrapper">
        <div className="qkb-board-action__msg-box">
          <input
            className="qkb-board-action__input"
            type="text"
            value={messageText || ''}
            ref={qkbMessageInput}
            disabled={inputDisable}
            placeholder={inputPlaceholder}
            onKeyPress={handleKeyPress}
            onChange={(e) => setMessageText(e.target.value)}
          />
          {inputDisablePlaceholder && inputDisable && (
            <div className="qkb-board-action__disable-text">
              <span>{inputDisablePlaceholder}</span>
            </div>
          )}
        </div>
        <div className="qkb-board-action__extra">
          {clearButton && (
            <button
              className="qkb-action-item qkb-action-item--clear"
              onClick={handleClearMessageText}
              disabled={!messageText}
            >
              Clear Chat
            </button>
          )}
          <button
            className="qkb-action-item qkb-action-item--send"
            onClick={handleSendMessage}
            disabled={!messageText || inputDisable}
          >
            <img className="qkb-action-icon qkb-action-icon--send" src={iconSendSrc} alt="icon-send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QKBBoardAction;