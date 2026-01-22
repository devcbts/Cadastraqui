from fastapi import FastAPI
from pydantic import BaseModel
from extractor import extract_text_from_pdf


class ExtractRequest(BaseModel):
    pdf_path: str


app = FastAPI(title="ENEM PDF Extractor Service")


@app.get("/status")
async def status():
    print("Status check received")
    """Verifica se o serviço está no ar."""
    return {"status": "ok"}


@app.post("/extract-pdf")
async def extract_pdf(req: ExtractRequest):
    print(f"Extract PDF request received for path: {req.pdf_path}")
    """Recebe o caminho de um PDF no servidor e devolve o texto extraído."""
    result = extract_text_from_pdf(req.pdf_path)
    return result


# Para rodar localmente:
#   cd enem_pdf_service
#   python -m pip install -r requirements.txt
#   uvicorn main:app --host 0.0.0.0 --port 8000
