import React, { useState, useEffect } from 'react';
import EventBus from '../../helpers/event-bus';
import { MessageData, MessageDataOptionBasic } from '../../shared/types/react-chat-bot';

type Props = {
  mainData: MessageData;
}

const ButtonOptions: React.FC<Props> = ({ mainData }) => {
  const [selectedItem, setSelectedItem] = useState<MessageDataOptionBasic | null>(null);
  const [selectedItemMultiple, setSelectedItemMultiple] = useState<
    Set<MessageDataOptionBasic>
  >(new Set());

  const disabled =
    selectedItem !== null && !mainData.reselectable;

  const selectOption = (value: MessageDataOptionBasic) => {
    setSelectedItem(value);

    if (mainData.options_multiple_choice) {
      const selectedValue = Array.from(selectedItemMultiple).map(
        (item) => item.value
      );
      const updatedValue = { ...value, text: selectedValue.join(', '), value: selectedValue };
      EventBus.emit('select-button-option', updatedValue);
    } else {
      EventBus.emit('select-button-option', value);
    }
  };

  const selectOptionMultiple = (value: MessageDataOptionBasic) => {
    if (!selectedItemMultiple.has(value)) {
      setSelectedItemMultiple((prev) => {
        const updated = new Set(prev);
        updated.add(value);
        return updated;
      });
    } else {
      setSelectedItemMultiple((prev) => {
        const updated = new Set(prev);
        updated.delete(value);
        return updated;
      });
    }
  };

  return (
    <div className="qkb-msg-bubble-component qkb-msg-bubble-component--button-options">
      <div className="qkb-msg-bubble-component__text">
        {mainData.type === 'text' ? (
          mainData.text
        ) : ['html', 'button'].includes(mainData.type) ? (
          <div dangerouslySetInnerHTML={{ __html: mainData.text ?? '' }}></div>
        ) : null}
      </div>
      {mainData.options_multiple_choice && (
        <div className="qkb-msg-bubble-component__options-wrapper qkb-msg-bubble-component__options__multiple-choice">
          {mainData.options_multiple_choice.map((item, index) => (
            <div className="qkb-mb-button-options__item" key={index}>
              <button
                className={`qkb-mb-button-options__btn${selectedItemMultiple.has(item) ? ' active' : ''}`}
                disabled={disabled}
                onClick={() => selectOptionMultiple(item)}
              >
                <span>{item.text}</span>
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="qkb-msg-bubble-component__options-wrapper">
        {mainData.options?.map((item, index) => (
          <div className="qkb-mb-button-options__item" key={index}>
            {item.action === 'postback' ? (
              <button
                className={`qkb-mb-button-options__btn${selectedItem === item ? ' active' : ''}`}
                disabled={disabled || (mainData.options_multiple_choice && selectedItemMultiple.size === 0)}
                onClick={() => selectOption(item)}
              >
                <span>{item.text}</span>
              </button>
            ) : disabled || (mainData.options_multiple_choice && selectedItemMultiple.size === 0) || !item.value ? (
              <a
                className={`qkb-mb-button-options__btn qkb-mb-button-options__url disabled`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{item.text}</span>
              </a>
            ) : (
              <a
                className={`qkb-mb-button-options__btn qkb-mb-button-options__url`}
                href={item.value}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{item.text}</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonOptions;