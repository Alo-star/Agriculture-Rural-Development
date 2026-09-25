# OCR Backend with FastAPI and pytesseract

A FastAPI-based backend service for Optical Character Recognition (OCR) using pytesseract. This service can extract text from images with support for multiple languages and advanced configuration options.

## Features

- **Image Upload**: Upload images for text extraction
- **Multi-language Support**: Support for 100+ languages
- **Confidence Scoring**: Get confidence scores for extracted text
- **Word-level Data**: Detailed information about each detected word
- **Advanced Configuration**: Custom Tesseract configuration options
- **CORS Support**: Ready for frontend integration
- **Health Checks**: API health monitoring endpoints

## Prerequisites

### 1. Install Tesseract OCR

#### Windows:
1. Download Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install it to `C:\Program Files\Tesseract-OCR\`
3. Add the installation directory to your PATH environment variable

#### macOS:
```bash
brew install tesseract
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install tesseract-ocr
sudo apt install tesseract-ocr-eng  # English language pack
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

## Installation

1. Clone or navigate to the project directory
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional) Create a `.env` file based on `.env.example`
4. Run the server:
   ```bash
   python main.py
   ```

## API Endpoints

### Health Check
- **GET** `/health` - Check if the API is running

### OCR Endpoints
- **POST** `/ocr/extract-text` - Basic text extraction
- **POST** `/ocr/extract-text-advanced` - Advanced text extraction with custom config
- **GET** `/ocr/languages` - Get available languages

### Basic Text Extraction

**Endpoint:** `POST /ocr/extract-text`

**Parameters:**
- `file`: Image file (multipart/form-data)
- `language`: Language code (optional, default: "eng")

**Example Request:**
```bash
curl -X POST "http://localhost:8000/ocr/extract-text" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@image.jpg" \
     -F "language=eng"
```

**Response:**
```json
{
  "success": true,
  "text": "Extracted text from image",
  "confidence": 85.5,
  "words": [
    {
      "text": "Extracted",
      "confidence": 90.0,
      "bbox": {"x": 10, "y": 20, "width": 100, "height": 30}
    }
  ],
  "language": "eng",
  "file_name": "image.jpg",
  "file_size": 1024
}
```

### Advanced Text Extraction

**Endpoint:** `POST /ocr/extract-text-advanced`

**Parameters:**
- `file`: Image file (multipart/form-data)
- `language`: Language code (optional, default: "eng")
- `config`: Tesseract configuration (optional, default: "--psm 6")

**PSM (Page Segmentation Mode) Options:**
- `--psm 0`: Orientation and script detection (OSD) only
- `--psm 1`: Automatic page segmentation with OSD
- `--psm 3`: Fully automatic page segmentation (default)
- `--psm 6`: Uniform block of text
- `--psm 7`: Single text line
- `--psm 8`: Single word
- `--psm 9`: Single word in a circle
- `--psm 10`: Single character
- `--psm 11`: Sparse text
- `--psm 12`: Sparse text with OSD
- `--psm 13`: Raw line

## Frontend Integration

### JavaScript/HTML Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>OCR Demo</title>
</head>
<body>
    <input type="file" id="imageInput" accept="image/*">
    <button onclick="extractText()">Extract Text</button>
    <div id="result"></div>

    <script>
        async function extractText() {
            const fileInput = document.getElementById('imageInput');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Please select an image file');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('language', 'eng');

            try {
                const response = await fetch('http://localhost:8000/ocr/extract-text', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('result').innerHTML = `
                        <h3>Extracted Text:</h3>
                        <p>${result.text}</p>
                        <p><strong>Confidence:</strong> ${result.confidence}%</p>
                    `;
                } else {
                    document.getElementById('result').innerHTML = `<p>Error: ${result.detail}</p>`;
                }
            } catch (error) {
                document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
            }
        }
    </script>
</body>
</html>
```

### React Example

```jsx
import React, { useState } from 'react';

function OCRComponent() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const extractText = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('language', 'eng');

        try {
            const response = await fetch('http://localhost:8000/ocr/extract-text', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button onClick={extractText} disabled={!file || loading}>
                {loading ? 'Processing...' : 'Extract Text'}
            </button>
            
            {result && (
                <div>
                    <h3>Extracted Text:</h3>
                    <p>{result.text}</p>
                    <p>Confidence: {result.confidence}%</p>
                </div>
            )}
        </div>
    );
}

export default OCRComponent;
```

## Configuration

### Tesseract Path (Windows)

If you're on Windows and Tesseract is not in your PATH, uncomment and modify this line in `main.py`:

```python
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

### Environment Variables

Create a `.env` file with the following variables:

```env
HOST=0.0.0.0
PORT=8000
DEBUG=True
TESSERACT_CMD_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/bmp,image/tiff
LOG_LEVEL=INFO
```

## Troubleshooting

### Common Issues

1. **Tesseract not found**: Make sure Tesseract is installed and in your PATH
2. **Language not available**: Install additional language packs for Tesseract
3. **CORS errors**: Check the `ALLOWED_ORIGINS` configuration
4. **File upload errors**: Verify file size and type restrictions

### Performance Tips

1. **Image Preprocessing**: Consider preprocessing images for better OCR results
2. **Language Selection**: Use specific language codes for better accuracy
3. **PSM Configuration**: Choose appropriate PSM mode for your use case
4. **File Size**: Optimize image size before upload

## Development

### Running in Development Mode

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

This project is open source and available under the MIT License. 