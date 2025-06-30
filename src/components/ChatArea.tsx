import React, { useRef, useEffect } from 'react';
import './ChatArea.css';
import { Dialog, Message, RequestData } from '../App';
import MessageInput from './MessageInput';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface ChatAreaProps {
  dialog: Dialog | undefined;
  isLoading: boolean;
  onSendMessage: (message: Message) => void;
  onCreateDialog: () => Dialog;
  onLoading: (loading: boolean) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  dialog,
  isLoading,
  onSendMessage,
  onCreateDialog,
  onLoading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [dialog?.messages]);

  const handleSendMessage = async (requestData: RequestData): Promise<void> => {
    if (!dialog) {
      const newDialog = onCreateDialog();
      return await handleSendMessage(requestData);
    }

    onLoading(true);

    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: uuidv4(),
      text: requestData.user_prompt,
      isUser: true,
      timestamp: new Date()
    };

    onSendMessage(userMessage);

    try {
      const payload = {
        need_rag: requestData.need_rag,
        need_tools: requestData.need_tools,
        first_message: requestData.first_message,
        dialog_id: requestData.first_message ? null : dialog.id,
        user_id: dialog.userId,
        user_prompt: requestData.user_prompt
      };

      const response = await axios.post('/agent/answer', payload);
      
      // Добавляем ответ бота
      const botMessage: Message = {
        id: uuidv4(),
        text: response.data.response,
        isUser: false,
        timestamp: new Date()
      };

      onSendMessage(botMessage);
    } catch (error: any) {
      // Добавляем сообщение об ошибке
      const errorMessage: Message = {
        id: uuidv4(),
        text: `Ошибка: ${error.response?.data?.detail || 'Произошла ошибка при отправке запроса'}`,
        isUser: false,
        timestamp: new Date()
      };

      onSendMessage(errorMessage);
    } finally {
      onLoading(false);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  if (!dialog) {
    return (
      <div className="chat-area">
        <div className="chat-empty">
          <div className="empty-content">
            <div className="empty-icon">💬</div>
            <h2>Добро пожаловать в AI Copilot</h2>
            <p>Выберите диалог из списка слева или создайте новый для начала работы</p>
            <button className="create-dialog-btn" onClick={onCreateDialog}>
              Создать новый диалог
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        <h2>{dialog.title}</h2>
      </div>

      <div className="messages-container">
        {dialog.messages.length === 0 ? (
          <div className="no-messages">
            <p>Диалог пуст. Отправьте первое сообщение для начала работы.</p>
          </div>
        ) : (
          dialog.messages.map(message => (
            <div
              key={message.id}
              className={`message ${message.isUser ? 'user' : 'bot'}`}
            >
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="message bot loading">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={handleSendMessage}
        disabled={isLoading}
        dialog={dialog}
      />
    </div>
  );
};

export default ChatArea; 