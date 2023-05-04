import React, { useRef, useEffect } from 'react';
import MessageBubble from '../MessageBubble/Main';
import MessageTyping from '../MessageBubble/Typing';
import { PropsButtonOptions } from '../MessageBubble/ButtonOptions';

type Props = {
  mainData: Array<PropsButtonOptions>;
  botTyping?: boolean;
  showUserIcon?: boolean;
  ratingEnable?: boolean;
};

const BoardContent: React.FC<Props> = ({
  mainData,
  botTyping = false,
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
        {mainData.map((item: PropsButtonOptions, index: number) => (
          <MessageBubble
            key={index}
            message={item}
            showUserIcon={showUserIcon}
            ratingEnable={ratingEnable}
          />
        ))}
        {botTyping && (
          <MessageTyping>
            <slot name="botTyping" />
          </MessageTyping>
        )}
      </div>
    </div>
  );
};

export default BoardContent;
