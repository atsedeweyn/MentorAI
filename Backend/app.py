# backend/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from scraper import YouTubeScraper
from utils import create_chat_context
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Initialize model
model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config={
        "temperature": 0.9,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
    }
)

# Store chat sessions
chat_sessions = {}

# Initialize YouTube scraper
youtube_scraper = YouTubeScraper(api_key=os.getenv('YOUTUBE_API_KEY'))

# Add this class near the top of the file
class ChannelRequest(BaseModel):
    channel_name: str

class ChatMessage(BaseModel):
    message: str

# Update the process_channel endpoint
@app.post("/api/channel")
async def process_channel(request: ChannelRequest):
    try:
        channel_id = youtube_scraper.get_channel_id(request.channel_name)
        videos = youtube_scraper.get_channel_videos(channel_id)
        
        # Get transcripts and combine them
        all_transcripts = ""
        for video in videos:
            transcript = youtube_scraper.get_transcript(video['id'])
            if transcript:
                all_transcripts += f"\nVideo: {video['title']}\n{transcript}\n"
        
        # Initialize chat session with context
        chat = model.start_chat(history=[])
        initial_prompt = create_chat_context(request.channel_name, all_transcripts)
        
        response = chat.send_message(initial_prompt)
        
        # Store chat session
        session_id = request.channel_name.lower().replace(" ", "_")
        chat_sessions[session_id] = {
            "chat": chat,
            "transcripts": all_transcripts
        }
        
        return {"session_id": session_id, "message": "Channel processed successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat/{session_id}")
async def chat(session_id: str, message: ChatMessage):
    if session_id not in chat_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    try:
        chat = chat_sessions[session_id]["chat"]
        response = chat.send_message(message.message)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mount the static files directory
app.mount("/static", StaticFiles(directory="../frontend/static"), name="static")

@app.get("/")
async def read_root():
    return FileResponse("frontend/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
