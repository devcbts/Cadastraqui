#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extrator de texto de PDF usando PyMuPDF e Tesseract OCR
Usado pelo backend Cadastraqui para extrair dados do ENEM.
"""

import sys
import json
import os


def extract_text_from_pdf(pdf_path):
    """Extrai texto do PDF, usando OCR se necessário"""
    result = {
        'success': False,
        'text': '',
        'method': '',
        'error': None
    }

    try:
        import fitz  # PyMuPDF
    except ImportError:
        result['error'] = 'PyMuPDF não instalado. Execute: pip install pymupdf'
        return result

    try:
        doc = fitz.open(pdf_path)
        text = ""

        for page_num in range(len(doc)):
            page = doc[page_num]
            page_text = page.get_text()
            text += page_text + "\n"

        if len(text.strip()) > 50:
            doc.close()
            result['success'] = True
            result['text'] = text
            result['method'] = 'direct'
            return result

        try:
            from PIL import Image
            import pytesseract

            tesseract_paths = [
                r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe',
                r'C:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe',
                '/usr/bin/tesseract',
                '/usr/local/bin/tesseract',
            ]

            for path_ in tesseract_paths:
                if os.path.exists(path_):
                    pytesseract.pytesseract.tesseract_cmd = path_
                    break

            text = ""
            for page_num in range(len(doc)):
                page = doc[page_num]
                mat = fitz.Matrix(2, 2)
                pix = page.get_pixmap(matrix=mat)

                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                page_text = pytesseract.image_to_string(img, lang='por')
                text += page_text + "\n"

            doc.close()
            result['success'] = True
            result['text'] = text
            result['method'] = 'ocr'
            return result

        except ImportError as e:
            doc.close()
            result['error'] = f'Dependências de OCR não instaladas: {e}. Execute: pip install pillow pytesseract'
            return result
        except Exception as e:
            doc.close()
            result['error'] = f'Erro no OCR: {str(e)}'
            return result

    except Exception as e:
        result['error'] = f'Erro ao processar PDF: {str(e)}'
        return result


def main():
    if len(sys.argv) < 2:
        print(json.dumps({'success': False, 'error': 'Caminho do PDF não fornecido'}))
        sys.exit(1)

    pdf_path = sys.argv[1]

    if not os.path.exists(pdf_path):
        print(json.dumps({'success': False, 'error': f'Arquivo não encontrado: {pdf_path}'}))
        sys.exit(1)

    result = extract_text_from_pdf(pdf_path)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    main()
