import React from "react";

const QkbBoardHeader = ({ 
  botTitle = "Chatbot", 
  iconCloseSrc = "/icons/arrow-down-invert.svg", 
  onCloseBot 
}: any) => {
  return (
    <div className="qkb-board-header">
      <div className="qkb-board-header__title">{botTitle}</div>
      <div className="qkb-board-header__close" onClick={onCloseBot}>
        <img src={iconCloseSrc} width="24" height="24" />
      </div>
    </div>
  );
};

export default QkbBoardHeader;
