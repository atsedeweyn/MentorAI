# backend/scraper.py
from youtube_transcript_api import YouTubeTranscriptApi
from googleapiclient.discovery import build
import os
from typing import List, Dict, Optional
from utils import sanitize_text

class YouTubeScraper:
    def __init__(self, api_key: str):
        self.youtube = build('youtube', 'v3', developerKey=api_key)
        self.transcripts_dir = 'transcripts'
        os.makedirs(self.transcripts_dir, exist_ok=True)

    def get_channel_id(self, channel_name: str) -> str:
        """Get channel ID from channel name."""
        try:
            request = self.youtube.search().list(
                part="snippet",
                type="channel",
                q=channel_name,
                maxResults=1
            )
            response = request.execute()
            
            if 'items' in response and response['items']:
                return response['items'][0]['snippet']['channelId']
            raise ValueError(f"Channel '{channel_name}' not found")
        except Exception as e:
            raise Exception(f"Error getting channel ID: {str(e)}")

    def get_channel_videos(self, channel_id: str, max_results: int = 5) -> List[Dict]:
        """Get latest videos from channel."""
        videos = []
        next_page_token = None
        
        try:
            while len(videos) < max_results:
                request = self.youtube.search().list(
                    part='id,snippet',
                    channelId=channel_id,
                    maxResults=min(50, max_results - len(videos)),
                    type='video',
                    order='date',
                    pageToken=next_page_token
                )
                response = request.execute()
                
                for item in response['items']:
                    video_data = {
                        'id': item['id']['videoId'],
                        'title': item['snippet']['title'],
                        'description': item['snippet']['description'],
                        'published_at': item['snippet']['publishedAt']
                    }
                    videos.append(video_data)
                    
                    if len(videos) == max_results:
                        break
                
                next_page_token = response.get('nextPageToken')
                if not next_page_token:
                    break
            
            return videos
        except Exception as e:
            raise Exception(f"Error getting channel videos: {str(e)}")

    def get_transcript(self, video_id: str) -> Optional[str]:
        """Get transcript for a video."""
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            transcript_text = ' '.join([entry['text'] for entry in transcript_list])
            return sanitize_text(transcript_text)
        except Exception as e:
            print(f"Error fetching transcript for video {video_id}: {str(e)}")
            return None

    def save_transcript(self, channel_name: str, videos: List[Dict]) -> str:
        """Save transcripts to file and return combined transcript text."""
        filename = os.path.join(self.transcripts_dir, f"{sanitize_text(channel_name)}_transcripts.txt")
        combined_transcript = ""
        
        with open(filename, 'w', encoding='utf-8') as f:
            for video in videos:
                transcript = self.get_transcript(video['id'])
                content = f"""
                Video: {video['title']}
                ID: {video['id']}
                Published: {video['published_at']}
                
                Transcript:
                {transcript if transcript else 'No transcript available.'}
                
                {'=' * 50}
                
                """
                f.write(content)
                if transcript:
                    combined_transcript += f"\nVideo: {video['title']}\n{transcript}\n"
        
        return combined_transcript

    def process_channel(self, channel_name: str, max_videos: int = 5) -> str:
        """Process entire channel and return combined transcript text."""
        try:
            channel_id = self.get_channel_id(channel_name)
            videos = self.get_channel_videos(channel_id, max_videos)
            return self.save_transcript(channel_name, videos)
        except Exception as e:
            raise Exception(f"Error processing channel: {str(e)}")