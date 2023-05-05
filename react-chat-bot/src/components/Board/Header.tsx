import React from "react";

const QkbBoardHeader = ({ 
  botTitle = "Chatbot", 
  iconCloseSrc = "/icons/arrow-down-invert.svg", 
  onCloseBot,
  children = null,
}: any) => {
  return (
    <div className="qkb-board-header">
      {children ? (
        children
      ) : (<>
        <div className="qkb-board-header__title">{botTitle}</div>
      </>)}
      <div className="qkb-board-header__close" onClick={onCloseBot}>
        <img src={iconCloseSrc} width="24" height="24" alt="icon-close" />
      </div>
    </div>
  );
};

export default QkbBoardHeader;
