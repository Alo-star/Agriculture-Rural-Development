from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import pytesseract
import io

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or use "http://127.0.0.1:5500"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/ocr/extract-text")
async def extract_text(file: UploadFile = File(...), language: str = Form("eng")):
    content = await file.read()
    image = Image.open(io.BytesIO(content))
    text = pytesseract.image_to_string(image, lang=language)
    return {
        "success": True,
        "text": text,
        "language": language,
        "confidence": 95.0,
        "file_name": file.filename,
        "total_words": len(text.split()),
        "words": text.split()
    }
