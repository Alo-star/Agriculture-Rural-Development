# OCR Integration Guide for ZeroWasteMart

This guide explains how to integrate the OCR (Optical Character Recognition) backend with your existing ZeroWasteMart project.

## 🚀 Quick Start

### 1. Install Tesseract OCR

**Windows:**
1. Download Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to `C:\Program Files\Tesseract-OCR\`
3. Add to PATH environment variable

**macOS:**
```bash
brew install tesseract
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install tesseract-ocr tesseract-ocr-eng
```

### 2. Start the OCR Backend

```bash
cd ocr-backend
python start_server.py
```

The server will be available at `http://localhost:8000`

### 3. Test the Integration

Open `ocr-backend/test_frontend.html` in your browser to test the OCR functionality.

## 📁 Project Structure

```
ZeroWasteMart/
├── ocr-backend/                 # OCR Backend Service
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── test_ocr.py            # OCR testing script
│   ├── start_server.py        # Startup script
│   ├── test_frontend.html     # Test frontend
│   └── README.md              # Backend documentation
├── OCR_INTEGRATION_GUIDE.md   # This file
└── [your existing files...]
```

## 🔧 API Endpoints

### Basic Text Extraction
- **POST** `/ocr/extract-text`
- **Parameters:** `file` (image), `language` (optional, default: "eng")
- **Returns:** Extracted text with confidence score

### Advanced Text Extraction
- **POST** `/ocr/extract-text-advanced`
- **Parameters:** `file` (image), `language`, `config` (Tesseract config)
- **Returns:** Detailed OCR results

### Health Check
- **GET** `/health`
- **Returns:** API status

## 💻 Frontend Integration

### JavaScript Integration

Add this to your existing JavaScript files:

```javascript
// OCR API functions
const OCR_API_BASE = 'http://localhost:8000';

async function extractTextFromImage(imageFile, language = 'eng') {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('language', language);

    try {
        const response = await fetch(`${OCR_API_BASE}/ocr/extract-text`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('OCR Error:', error);
        throw error;
    }
}

// Example usage
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const result = await extractTextFromImage(file, 'eng');
        
        if (result.success) {
            console.log('Extracted text:', result.text);
            console.log('Confidence:', result.confidence);
            
            // Update your UI with the extracted text
            document.getElementById('extracted-text').textContent = result.text;
        } else {
            console.error('OCR failed:', result.detail);
        }
    } catch (error) {
        console.error('Error processing image:', error);
    }
}
```

### HTML Integration

Add this to your existing HTML files:

```html
<!-- OCR Image Upload Section -->
<div class="ocr-section">
    <h3>Extract Text from Image</h3>
    <input type="file" id="ocrImageInput" accept="image/*" onchange="handleImageUpload(event)">
    
    <select id="ocrLanguage">
        <option value="eng">English</option>
        <option value="fra">French</option>
        <option value="deu">German</option>
        <option value="spa">Spanish</option>
    </select>
    
    <button onclick="processImage()">Extract Text</button>
    
    <div id="ocrResult" style="display: none;">
        <h4>Extracted Text:</h4>
        <div id="extracted-text"></div>
        <p id="confidence-score"></p>
    </div>
</div>

<script>
async function processImage() {
    const fileInput = document.getElementById('ocrImageInput');
    const languageSelect = document.getElementById('ocrLanguage');
    const resultDiv = document.getElementById('ocrResult');
    
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select an image first');
        return;
    }
    
    try {
        const result = await extractTextFromImage(file, languageSelect.value);
        
        if (result.success) {
            document.getElementById('extracted-text').textContent = result.text;
            document.getElementById('confidence-score').textContent = 
                `Confidence: ${result.confidence}%`;
            resultDiv.style.display = 'block';
        } else {
            alert('Failed to extract text: ' + result.detail);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
</script>
```

## 🎯 Use Cases for ZeroWasteMart

### 1. Product Label Scanning
- Scan product labels to extract ingredients, nutritional info, or recycling instructions
- Automatically populate product database with scanned information

### 2. Receipt Processing
- Scan receipts to extract purchase details
- Track spending and categorize purchases automatically

### 3. Document Digitization
- Convert paper documents to searchable text
- Archive important documents digitally

### 4. Inventory Management
- Scan barcodes or product codes
- Quick inventory updates from photos

## 🔒 Security Considerations

1. **File Validation**: Always validate uploaded files
2. **File Size Limits**: Implement reasonable file size restrictions
3. **CORS Configuration**: Configure CORS properly for production
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Input Sanitization**: Sanitize extracted text before storing

## 🚀 Production Deployment

### Environment Variables
```env
HOST=0.0.0.0
PORT=8000
DEBUG=False
ALLOWED_ORIGINS=https://yourdomain.com
MAX_FILE_SIZE=10485760
```

### Using with a Reverse Proxy
```nginx
location /ocr/ {
    proxy_pass http://localhost:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 🧪 Testing

### Run OCR Tests
```bash
cd ocr-backend
python test_ocr.py
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Test OCR (replace with actual image path)
curl -X POST "http://localhost:8000/ocr/extract-text" \
     -F "file=@test-image.jpg" \
     -F "language=eng"
```

## 📚 Additional Resources

- [Tesseract Documentation](https://tesseract-ocr.github.io/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [pytesseract Documentation](https://pypi.org/project/pytesseract/)

## 🆘 Troubleshooting

### Common Issues

1. **Tesseract not found**
   - Ensure Tesseract is installed and in PATH
   - For Windows, check the installation path in `main.py`

2. **CORS errors**
   - Check the `ALLOWED_ORIGINS` configuration
   - Ensure the frontend domain is included

3. **Poor OCR accuracy**
   - Use higher quality images
   - Try different PSM modes
   - Preprocess images (resize, enhance contrast)

4. **Memory issues**
   - Limit file sizes
   - Process images in batches
   - Use image compression

### Getting Help

1. Check the backend logs for error messages
2. Run the test script to verify installation
3. Check the API documentation at `http://localhost:8000/docs`
4. Review the README.md in the ocr-backend directory

## 📈 Performance Optimization

1. **Image Preprocessing**: Resize images before OCR
2. **Caching**: Cache OCR results for repeated images
3. **Async Processing**: Use background tasks for large files
4. **Load Balancing**: Use multiple OCR workers for high traffic

---

**Happy OCR Integration! 🎉** 