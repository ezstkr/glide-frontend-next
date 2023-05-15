import React from 'react';

interface Props {
  mainData: {
    type: string;
    text?: string;
  };
}

const SingleText: React.FC<Props> = ({ mainData }) => {
  return (
    <div className="qkb-msg-bubble-component qkb-msg-bubble-component--single-text">
      {mainData.type === 'text' && (
        <div className="qkb-msg-bubble-component__text">{mainData.text}</div>
      )}
      {['html', 'button'].includes(mainData.type) && (
        <div
          className="qkb-msg-bubble-component__text"
          dangerouslySetInnerHTML={{ __html: mainData.text ?? '' }}
        ></div>
      )}
    </div>
  );
};

export default SingleText;
