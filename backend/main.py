from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import io
import openai
import os

# openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your react dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/tts")
async def tts(data: dict):
    text = data.get("text", "")
    if not text:
        return {"error": "No text provided"}
    
    print(text)

    # response = openai.audio.speech.create(
    #     model="gpt-4o-mini-tts",
    #     voice="alloy",
    #     input=text
    # )
    # audio_bytes = io.BytesIO(response.read())
    # return StreamingResponse(audio_bytes, media_type="audio/mpeg")
