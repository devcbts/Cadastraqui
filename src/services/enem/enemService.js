import { api } from "../axios";

class EnemService {
  async extractFromPdf(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/enem/extract-pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async deleteEnemScore(familyMemberId) {
    const response = await api.delete("/candidates/enem-score" + (familyMemberId ? `/${familyMemberId}` : ''));
    return response.data;
  }
}

export default new EnemService();
