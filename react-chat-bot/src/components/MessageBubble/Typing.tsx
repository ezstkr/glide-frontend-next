import React from 'react';

interface Props {
  // Props types here
}

const BotTypingBubble: React.FC<Props> = (props: Props) => {
  return (
    <div className="qkb-msg-bubble qkb-msg-bubble--bot">
      <div className="qkb-msg-avatar">
        <div className="qkb-msg-avatar__img">&nbsp;</div>
      </div>
      <div className="qkb-msg-bubble-component qkb-msg-bubble-component--typing">
        <div className="qkb-msg-bubble-component__text">
          <div className="qkb-msg-bubble__typing-indicator">
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotTypingBubble;
