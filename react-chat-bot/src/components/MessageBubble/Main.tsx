import React, { useState } from 'react';
import SingleText from './SingleText';
import ButtonOptions from './ButtonOptions';
import UrlPreview from './UrlPreview';
import { MessageData } from '../../shared/types/react-chat-bot';

interface Props {
  message: MessageData;
  showUserIcon?: boolean;
  ratingEnable?: boolean;
  [key: string]: any;
}

const MsgBubble: React.FC<Props> = ({ message, showUserIcon = false, ratingEnable = false }) => {
  const [rating, setRating] = useState<null | boolean>(null);

  const bubbleClass = message.agent === 'bot' ? 'qkb-msg-bubble--bot' : 'qkb-msg-bubble--user';

  let componentType = null;

  switch (message.type) {
    case 'button':
      componentType = <ButtonOptions mainData={message} />;
      break;
    case 'url':
      componentType = <UrlPreview mainData={message} />;
      break;
    default:
      componentType = <SingleText mainData={message} />;
  }

  const rate = (like: boolean) => {
    if (rating === like) {
      setRating(null);
    } else {
      setRating(like);
    }
  };

  return (
    <div className={`qkb-msg-bubble ${bubbleClass}`}>
      {message.agent === 'bot' || showUserIcon ? (
        <div className="qkb-msg-avatar">
          <div className="qkb-msg-avatar__img">&nbsp;</div>
        </div>
      ) : null}
      <div className="qkb-msg-content">
        {componentType}
        {message.agent === 'bot' && ratingEnable ? (
          <div className="qkb-msg-feedback">
            <div className="qkb-msg-feedback__leave" onClick={() => {}}>
              Leave Feedback
            </div>
            <div className="qkb-msg-feedback__rate">
              <span>Rate this response</span>
              <button
                className="qkb-msg-feedback-btn--like button"
                style={{ display: rating !== false ? 'block' : 'none' }}
                onClick={() => rate(true)}
              >
                👍
              </button>
              <button
                className="qkb-msg-feedback-btn--unlike button"
                style={{ display: rating !== true ? 'block' : 'none' }}
                onClick={() => rate(false)}
              >
                👎
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {message.createdAt ? <div className="qkb-msg-bubble__time">{message.createdAt}</div> : null}
    </div>
  );
};

export default MsgBubble;
