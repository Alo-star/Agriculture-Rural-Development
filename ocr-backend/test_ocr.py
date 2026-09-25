#!/usr/bin/env python3
"""
Test script to verify Tesseract OCR installation and functionality
"""

import sys
import os
from PIL import Image
import pytesseract

def test_tesseract_installation():
    """Test if Tesseract is properly installed"""
    try:
        # Get Tesseract version
        version = pytesseract.get_tesseract_version()
        print(f"✅ Tesseract version: {version}")
        return True
    except Exception as e:
        print(f"❌ Tesseract not found: {e}")
        print("Please install Tesseract OCR first.")
        return False

def test_languages():
    """Test available languages"""
    try:
        languages = pytesseract.get_languages()
        print(f"✅ Available languages: {languages}")
        return True
    except Exception as e:
        print(f"❌ Error getting languages: {e}")
        return False

def test_basic_ocr():
    """Test basic OCR functionality with a simple test"""
    try:
        # Create a simple test image with text
        from PIL import Image, ImageDraw, ImageFont
        
        # Create a white image
        img = Image.new('RGB', (300, 100), color='white')
        draw = ImageDraw.Draw(img)
        
        # Try to use a default font, fallback to basic if not available
        try:
            # Try to use a system font
            font = ImageFont.truetype("arial.ttf", 20)
        except:
            # Fallback to default font
            font = ImageFont.load_default()
        
        # Draw text
        draw.text((10, 10), "Hello World!", fill='black', font=font)
        
        # Perform OCR
        text = pytesseract.image_to_string(img, lang='eng')
        print(f"✅ Basic OCR test successful. Extracted text: '{text.strip()}'")
        return True
        
    except Exception as e:
        print(f"❌ Basic OCR test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Tesseract OCR Installation...")
    print("=" * 50)
    
    tests = [
        ("Tesseract Installation", test_tesseract_installation),
        ("Available Languages", test_languages),
        ("Basic OCR Functionality", test_basic_ocr)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Running: {test_name}")
        if test_func():
            passed += 1
        else:
            print(f"❌ {test_name} failed")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Tesseract OCR is ready to use.")
        return True
    else:
        print("⚠️  Some tests failed. Please check the installation.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 