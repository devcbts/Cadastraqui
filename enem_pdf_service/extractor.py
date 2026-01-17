import os
import json
from typing import Dict, Any


def extract_text_from_pdf(pdf_path: str) -> Dict[str, Any]:
    """Extrai texto do PDF, usando OCR se necessário (PyMuPDF + Tesseract).
    Retorna um dicionário com as chaves: success, text, method, error.
    """
    result: Dict[str, Any] = {
        "success": False,
        "text": "",
        "method": "",
        "error": None,
    }

    try:
        import fitz  # PyMuPDF
    except ImportError:
        result["error"] = "PyMuPDF não instalado. Execute: pip install pymupdf"
        return result

    try:
        doc = fitz.open(pdf_path)
        text = ""

        # Primeiro tenta extração direta
        for page_num in range(len(doc)):
            page = doc[page_num]
            page_text = page.get_text()
            text += page_text + "\n"

        # Se já for suficiente, não faz OCR
        if len(text.strip()) > 50:
            doc.close()
            result["success"] = True
            result["text"] = text
            result["method"] = "direct"
            return result

        # Se não, tenta OCR
        try:
            from PIL import Image
            import pytesseract

            tesseract_paths = [
                r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe",
                r"C:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe",
                "/usr/bin/tesseract",
                "/usr/local/bin/tesseract",
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
                page_text = pytesseract.image_to_string(img, lang="por")
                text += page_text + "\n"

            doc.close()
            result["success"] = True
            result["text"] = text
            result["method"] = "ocr"
            return result

        except ImportError as e:
            doc.close()
            result["error"] = f"Dependências de OCR não instaladas: {e}. Execute: pip install pillow pytesseract"
            return result
        except Exception as e:
            doc.close()
            result["error"] = f"Erro no OCR: {str(e)}"
            return result

    except Exception as e:
        result["error"] = f"Erro ao processar PDF: {str(e)}"
        return result


if __name__ == "__main__":
    # Execução direta para debug rápido
    import sys

    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Caminho do PDF não fornecido"}, ensure_ascii=False))
        raise SystemExit(1)

    path_arg = sys.argv[1]
    res = extract_text_from_pdf(path_arg)
    print(json.dumps(res, ensure_ascii=False))
