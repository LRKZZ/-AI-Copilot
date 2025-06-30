import React from 'react';
import './Sidebar.css';
import { Dialog } from '../App';

interface SidebarProps {
  dialogs: Dialog[];
  activeDialogId: string | null;
  onDialogSelect: (dialogId: string) => void;
  onNewDialog: () => void;
  onDeleteDialog: (dialogId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  dialogs,
  activeDialogId,
  onDialogSelect,
  onNewDialog,
  onDeleteDialog
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-circle">
            <span>AI</span>
          </div>
          <h1>AI Copilot</h1>
        </div>
        
        <button className="new-dialog-btn" onClick={onNewDialog}>
          <span>+</span>
          Новый диалог
        </button>
      </div>

      <div className="dialogs-list">
        {dialogs.length === 0 ? (
          <div className="empty-dialogs">
            <p>Нет диалогов</p>
            <span>Создайте новый диалог для начала работы</span>
          </div>
        ) : (
          dialogs.map(dialog => (
            <div
              key={dialog.id}
              className={`dialog-item ${activeDialogId === dialog.id ? 'active' : ''}`}
              onClick={() => onDialogSelect(dialog.id)}
            >
              <div className="dialog-content">
                <h3 className="dialog-title">{dialog.title}</h3>
                <p className="dialog-preview">
                  {dialog.messages.length > 0 
                    ? dialog.messages[dialog.messages.length - 1].text
                    : 'Новый диалог'
                  }
                </p>
                <span className="dialog-time">{formatDate(dialog.createdAt)}</span>
              </div>
              
              <button
                className="delete-dialog-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDialog(dialog.id);
                }}
                title="Удалить диалог"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar; 