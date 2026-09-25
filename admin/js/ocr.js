const OCR_API_BASE = 'http://localhost:8000';

async function processOCRImage() {
    const fileInput = document.getElementById('ocrImageInput');
    const languageSelect = document.getElementById('ocrLanguage');
    const resultDiv = document.getElementById('ocrResult');
    const errorDiv = document.getElementById('ocrError');
    const extractedTextDiv = document.getElementById('extracted-text');
    const confidenceScore = document.getElementById('confidence-score');

    errorDiv.style.display = 'none';
    resultDiv.style.display = 'none';

    const file = fileInput.files[0];
    if (!file) {
        errorDiv.textContent = 'Please select an image file.';
        errorDiv.style.display = 'block';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', languageSelect.value);

    try {
        const response = await fetch(`${OCR_API_BASE}/ocr/extract-text`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            extractedTextDiv.textContent = result.text;
            confidenceScore.textContent = `Confidence: ${result.confidence}%`;
            resultDiv.style.display = 'block';
        } else {
            errorDiv.textContent = result.detail || 'OCR failed. Please try again.';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Error connecting to OCR API.';
        errorDiv.style.display = 'block';
    }
} 