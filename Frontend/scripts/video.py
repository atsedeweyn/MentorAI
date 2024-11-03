import yt_dlp  # or import yt_dlp as youtube_dl

def download_audio(url):
    # Define youtube-dl options to get the best audio format available
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',  # Change to 'wav' if you prefer WAV format
            'preferredquality': '192',  # Audio quality
        }],
        'outtmpl': 'downloaded_audio.%(ext)s',  # Output filename
    }

    # Download audio
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

# URL of the YouTube video
video_url = 'https://www.youtube.com/watch?v=gb6KdAiKT5Y&ab_channel=verkwandi'
download_audio(video_url)
