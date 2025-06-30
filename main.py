from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid

app = FastAPI(title="AI Copilot API", version="1.0.0")

# Добавляем CORS middleware для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DialogRequest(BaseModel):
    need_rag: bool
    need_tools: bool
    first_message: bool
    dialog_id: Optional[uuid.UUID] = None
    user_id: uuid.UUID
    user_prompt: str

@app.post("/agent/answer")
async def process_dialog(request: DialogRequest):
    """
    Обрабатывает запрос диалога с различными комбинациями параметров
    """
    
    # Проверяем недопустимую комбинацию: dialog_id не null и first_message true
    if request.dialog_id is not None and request.first_message:
        raise HTTPException(
            status_code=400, 
            detail="Нельзя указывать dialog_id для первого сообщения"
        )
    
    # Обрабатываем различные комбинации need_rag и need_tools
    if request.need_rag and request.need_tools:
        return {"response": f"[RAG + Инструменты] Обработан запрос: {request.user_prompt}"}
    elif request.need_rag and not request.need_tools:
        return {"response": f"[RAG] Обработан запрос: {request.user_prompt}"}
    elif not request.need_rag and request.need_tools:
        return {"response": f"[Инструменты] Обработан запрос: {request.user_prompt}"}
    else:
        return {"response": f"[Базовая обработка] Обработан запрос: {request.user_prompt}"}

@app.get("/")
async def root():
    return {"message": "AI Copilot API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 