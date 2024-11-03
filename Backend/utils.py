# backend/utils.py
import re
from typing import Dict, Any
import json

def sanitize_text(text: str) -> str:
    """Clean and sanitize text content."""
    if not text:
        return ""
    
    # Remove special characters and excessive whitespace
    text = re.sub(r'[^\w\s.,!?-]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def create_chat_context(channel_name: str, transcript: str) -> str:
    """Create initial context for the Gemini chat."""
    return f"""You are an AI assistant that has access to transcripts from the YouTube channel {channel_name}. 
    Use these transcripts to answer questions in the style and tone of the channel's content.
    
    Transcripts:
    {transcript}
    
    Instructions:
    1. Only answer questions based on information found in these transcripts
    2. If the information isn't in the transcripts, clearly state that
    3. Maintain the channel's speaking style and tone
    4. Keep responses concise and relevant
    """

def format_response(response_data: Dict[str, Any]) -> str:
    """Format API response data."""
    try:
        return json.dumps(response_data, ensure_ascii=False, indent=2)
    except Exception:
        return str(response_data)

def chunk_text(text: str, max_tokens: int = 8000) -> list:
    """Split text into chunks that fit within token limits."""
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    
    # Rough estimation: average word is 5 characters + space
    words_per_chunk = max_tokens // 6
    
    for word in words:
        current_chunk.append(word)
        current_length += 1
        
        if current_length >= words_per_chunk:
            chunks.append(' '.join(current_chunk))
            current_chunk = []
            current_length = 0
    
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks

class TranscriptCache:
    """Simple in-memory cache for transcripts."""
    def __init__(self):
        self.cache = {}
    
    def get(self, channel_name: str) -> str:
        """Get transcript from cache."""
        return self.cache.get(channel_name)
    
    def set(self, channel_name: str, transcript: str) -> None:
        """Store transcript in cache."""
        self.cache[channel_name] = transcript
    
    def clear(self, channel_name: str = None) -> None:
        """Clear cache for specific channel or all channels."""
        if channel_name:
            self.cache.pop(channel_name, None)
        else:
            self.cache.clear()