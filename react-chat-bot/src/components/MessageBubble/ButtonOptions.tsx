import React, { useState } from 'react';
import EventBus from '../../helpers/event-bus';

export interface PropsButtonOptions {
  agent: string;
  type: string;
  text: string;
  createdAt?: string;
  disableInput: boolean;
  reselectable?: boolean;
  botTyping?: boolean;
  options: {
    text: string;
    value: any;
    action: string;
    emit?: string;
    type?: string;
    to?: string;
  }[];
  options_multiple_choice?: {
    text: string;
    action: string;
    value: string;
  }[]
}

type Props = {
  mainData: PropsButtonOptions;
}

const ButtonOptions: React.FC<Props> = ({ mainData }) => {
  const [selectedItem, setSelectedItem] = useState<{
    text: string;
    action: string;
    value: string;
  } | null>(null);
  const [selectedItemMultiple, setSelectedItemMultiple] = useState<
    Set<{
      text: string;
      action: string;
      value: string;
    }>
  >(new Set());
  const [loading, setLoading] = useState(false);

  const disabled =
    selectedItem !== null && !mainData.reselectable && !selectedItemMultiple.size;

  const selectOption = (value: {
    text: string;
    action: string;
    value: string;
  }) => {
    setSelectedItem(value);

    if (mainData.options_multiple_choice) {
      const selectedValue = Array.from(selectedItemMultiple).map(
        (item) => item.value
      );
      const updatedValue = { ...value, text: selectedValue.join(', ') };
      EventBus.emit('select-button-option', updatedValue);
    } else {
      EventBus.emit('select-button-option', value);
    }
  };

  const selectOptionMultiple = (value: {
    text: string;
    action: string;
    value: string;
  }) => {
    if (!selectedItemMultiple.has(value)) {
      setSelectedItemMultiple((prev) => prev.add(value));
    } else {
      setSelectedItemMultiple((prev) => {
        const updated = new Set(prev);
        updated.delete(value);
        return updated;
      });
    }
    setLoading(true);
    setLoading(false);
  };

  return (
    <div className="qkb-msg-bubble-component qkb-msg-bubble-component--button-options">
      <div className="qkb-msg-bubble-component__text">
        {mainData.type === 'text' ? (
          mainData.text
        ) : ['html', 'button'].includes(mainData.type) ? (
          <div dangerouslySetInnerHTML={{ __html: mainData.text }}></div>
        ) : null}
      </div>
      {mainData.options_multiple_choice && (
        <div className="qkb-msg-bubble-component__options-wrapper qkb-msg-bubble-component__options__multiple-choice">
          {mainData.options_multiple_choice.map((item, index) => (
            <div className="qkb-mb-button-options__item" key={index}>
              <button
                className={`qkb-mb-button-options__btn${!loading && selectedItemMultiple.has(item) ? ' active' : ''}`}
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
        {mainData.options.map((item, index) => (
          <div className="qkb-mb-button-options__item" key={index}>
            {item.action === 'postback' ? (
              <button
                className={`qkb-mb-button-options__btn${selectedItem === item ? ' active' : ''}`}
                disabled={disabled || (mainData.options_multiple_choice && selectedItemMultiple.size === 0)}
                onClick={() => selectOption(item)}
              >
                <span>{item.text}</span>
              </button>
            ) : (
              <a
                className={`qkb-mb-button-options__btn qkb-mb-button-options__url${disabled ? ' disabled' : ''}`}
                href={disabled || (mainData.options_multiple_choice && selectedItemMultiple.size === 0) ? item.value : '#'}
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