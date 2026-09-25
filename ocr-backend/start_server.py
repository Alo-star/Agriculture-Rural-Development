#!/usr/bin/env python3
"""
Startup script for OCR Backend
Handles dependency installation and server startup
"""

import subprocess
import sys
import os
import importlib.util

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def install_requirements():
    """Install required packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def check_tesseract():
    """Check if Tesseract is available"""
    try:
        import pytesseract
        version = pytesseract.get_tesseract_version()
        print(f"✅ Tesseract version {version} detected")
        return True
    except ImportError:
        print("❌ pytesseract not installed")
        return False
    except Exception as e:
        print(f"❌ Tesseract not found: {e}")
        print("\n📋 Please install Tesseract OCR:")
        print("   Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki")
        print("   macOS: brew install tesseract")
        print("   Ubuntu: sudo apt install tesseract-ocr")
        return False

def run_tests():
    """Run OCR tests"""
    print("🧪 Running OCR tests...")
    try:
        result = subprocess.run([sys.executable, "test_ocr.py"], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ OCR tests passed")
            return True
        else:
            print("❌ OCR tests failed")
            print(result.stdout)
            print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ Failed to run tests: {e}")
        return False

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting OCR Backend Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔧 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")

def main():
    """Main startup function"""
    print("🔍 OCR Backend Startup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        print("❌ Failed to install requirements")
        sys.exit(1)
    
    # Check Tesseract
    if not check_tesseract():
        print("❌ Tesseract not available")
        sys.exit(1)
    
    # Run tests
    if not run_tests():
        print("❌ OCR tests failed")
        response = input("Continue anyway? (y/N): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # Start server
    start_server()

if __name__ == "__main__":
    main() 