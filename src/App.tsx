import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Dialog {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  userId: string;
}

// Общий интерфейс для данных запроса
export interface RequestData {
  need_rag: boolean;
  need_tools: boolean;
  first_message: boolean;
  user_prompt: string;
}

function App() {
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [activeDialogId, setActiveDialogId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createNewDialog = (): Dialog => {
    const newDialog: Dialog = {
      id: uuidv4(),
      title: 'Новый диалог',
      messages: [],
      createdAt: new Date(),
      userId: uuidv4()
    };
    
    setDialogs(prev => [newDialog, ...prev]);
    setActiveDialogId(newDialog.id);
    
    return newDialog;
  };

  const addMessageToDialog = (dialogId: string, message: Message): void => {
    setDialogs(prev => prev.map(dialog => 
      dialog.id === dialogId 
        ? { 
            ...dialog, 
            messages: [...dialog.messages, message],
            title: dialog.messages.length === 0 ? message.text.slice(0, 30) + '...' : dialog.title
          }
        : dialog
    ));
  };

  const deleteDialog = (dialogId: string): void => {
    setDialogs(prev => prev.filter(dialog => dialog.id !== dialogId));
    if (activeDialogId === dialogId) {
      setActiveDialogId(null);
    }
  };

  const activeDialog = dialogs.find(dialog => dialog.id === activeDialogId);

  return (
    <div className="app">
      <Sidebar
        dialogs={dialogs}
        activeDialogId={activeDialogId}
        onDialogSelect={setActiveDialogId}
        onNewDialog={createNewDialog}
        onDeleteDialog={deleteDialog}
      />
      
      <ChatArea
        dialog={activeDialog}
        isLoading={isLoading}
        onSendMessage={(message: Message) => {
          if (activeDialog) {
            addMessageToDialog(activeDialog.id, message);
          }
        }}
        onCreateDialog={createNewDialog}
        onLoading={setIsLoading}
      />
    </div>
  );
}

export default App; 