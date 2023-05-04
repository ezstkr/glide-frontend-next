import React, { useRef, useEffect } from 'react';
import MessageBubble from '../MessageBubble/Main';
import MessageTyping from '../MessageBubble/Typing';
import { MessageData } from '../../shared/types/react-chat-bot';

type Props = {
  mainData: Array<MessageData>;
  botTyping?: boolean;
  botTypingChildren?: React.ReactNode;
  showUserIcon?: boolean;
  ratingEnable?: boolean;
};

const BoardContent: React.FC<Props> = ({
  mainData,
  botTyping = false,
  botTypingChildren = null,
  showUserIcon = false,
  ratingEnable = false,
}) => {
  const boardContentRef = useRef<HTMLDivElement>(null);
  const boardBubblesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentElm = boardContentRef.current;
    const offsetHeight = boardBubblesRef.current?.offsetHeight || 0;

    if (contentElm) {
      contentElm.scrollTop = offsetHeight;
    }
  }, [mainData]);

  return (
    <div className="qkb-board-content" ref={boardContentRef}>
      <div className="qkb-board-content__bubbles" ref={boardBubblesRef}>
        {mainData.map((item: MessageData, index: number) => (
          <MessageBubble
            key={index}
            message={item}
            showUserIcon={showUserIcon}
            ratingEnable={ratingEnable}
          />
        ))}
        {botTyping ? (
          (!botTypingChildren) ? (
            <MessageTyping />
            ) : (
            botTypingChildren
          )
        ) : <></>}
      </div>
    </div>
  );
};

export default BoardContent;
