import React, { useState } from 'react';
import './MessageInput.css';
import { Dialog, RequestData } from '../App';

interface MessageInputProps {
  onSend: (requestData: RequestData) => void;
  disabled: boolean;
  dialog: Dialog;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled, dialog }) => {
  const [message, setMessage] = useState<string>('');

  const handleSend = (): void => {
    if (!message.trim()) return;

    const requestData: RequestData = {
      need_rag: true, // Всегда true
      need_tools: true, // Всегда true
      first_message: dialog.messages.length === 0,
      user_prompt: message.trim(),
    };

    onSend(requestData);
    setMessage(''); // Очищаем поле после отправки
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input">
      <div className="input-container">
        <div className="input-area">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите ваше сообщение..."
            className="message-textarea"
            disabled={disabled}
            rows={1}
          />

          <button
            className="send-btn"
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            title="Отправить сообщение"
          >
            {disabled ? (
              <div className="loading-spinner">
                <span></span>
              </div>
            ) : (
              '🚀'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput; 