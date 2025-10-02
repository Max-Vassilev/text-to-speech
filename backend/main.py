# main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from gtts import gTTS
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://text-to-speech-fe.s3-website-us-east-1.amazonaws.com/"], # Hardcoded FE URL
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/tts")
async def tts(request: Request):
    data = await request.json()
    text = data.get("text", "")
    if not text:
        return {"error": "No text provided"}

    tts = gTTS(text=text, lang="en")
    audio_bytes = io.BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)

    return StreamingResponse(
        audio_bytes,
        media_type="audio/mpeg",
        headers={"Content-Disposition": "attachment; filename=tts.mp3"}
    )
