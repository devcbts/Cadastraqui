from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from extractor import extract_text_from_pdf
import tempfile
import os


class ExtractRequest(BaseModel):
    pdf_path: str


app = FastAPI(title="ENEM PDF Extractor Service")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))  # Usa a porta definida pela variável de ambiente ou 8000 como padrão
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
@app.get("/status")
async def status():
    print("Status check received")
    """Verifica se o serviço está no ar."""
    return {"status": "ok"}


@app.post("/extract-pdf")
async def extract_pdf(req: ExtractRequest | None = None, file: UploadFile | None = File(None)):
    """Recebe um PDF via upload (multipart) ou um caminho (JSON) e extrai o texto."""
    pdf_path: str | None = None

    # Caso venha arquivo via multipart
    if file is not None:
        try:
            contents = await file.read()
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp.write(contents)
                pdf_path = tmp.name
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Falha ao processar arquivo: {e}")

    # Caso venha JSON com caminho
    elif req is not None and req.pdf_path:
        pdf_path = req.pdf_path

    else:
        raise HTTPException(status_code=400, detail="Envie um arquivo PDF (multipart/form-data) ou informe 'pdf_path' no JSON")

    # Extrai o texto usando o extrator existente (que espera caminho)
    print(f"Extract PDF request processing path: {pdf_path}")
    result = extract_text_from_pdf(pdf_path)

    # Limpa arquivo temporário criado para upload
    try:
        if file is not None and pdf_path and os.path.exists(pdf_path):
            os.remove(pdf_path)
    except Exception:
        pass

    return result


# Para rodar localmente:
#   cd enem_pdf_service
#   python -m pip install -r requirements.txt
#   uvicorn main:app --host 0.0.0.0 --port 8000
