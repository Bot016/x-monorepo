import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../repositories/symptom.repository.js", () => ({
  symptomRepository: {
    findBySex: vi.fn(),
  },
}));

import { symptomService } from "./symptom.service.js";
import { symptomRepository } from "../repositories/symptom.repository.js";

describe("symptomService.getBySex", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve repassar o parâmetro recebido para o repositório", async () => {
    vi.mocked(symptomRepository.findBySex).mockResolvedValue([]);

    await symptomService.getBySex("m");

    expect(symptomRepository.findBySex).toHaveBeenCalledWith("m");
  });

  it("deve retornar os sintomas mapeados apenas com 'weight' quando um sexo ('m' ou 'f') é informado", async () => {
    const mockRepoResponse = [
      {
        id: "s-1",
        symptomName: "Dor de Cabeça",
        category: "GERAL",
        weight: 1.5,
        createdAt: new Date(), 
      },
    ];
    
    vi.mocked(symptomRepository.findBySex).mockResolvedValue(mockRepoResponse as never);

    const result = await symptomService.getBySex("m");

    expect(result).toEqual([
      {
        id: "s-1",
        symptomName: "Dor de Cabeça",
        category: "GERAL",
        weight: 1.5,
        weightM: undefined,
        weightF: undefined,
      },
    ]);
  });

  it("deve retornar os sintomas com 'weightM' e 'weightF' quando nenhum sexo ('') é informado", async () => {
    // O repositório retorna os pesos separados quando recebe string vazia
    const mockRepoResponse = [
      {
        id: "s-2",
        symptomName: "Enjoo",
        category: "GASTRO",
        weightM: 1.0,
        weightF: 2.0,
      },
    ];

    vi.mocked(symptomRepository.findBySex).mockResolvedValue(mockRepoResponse as never);

    const result = await symptomService.getBySex("");

    expect(result).toEqual([
      {
        id: "s-2",
        symptomName: "Enjoo",
        category: "GASTRO",
        weight: undefined,
        weightM: 1.0,
        weightF: 2.0,
      },
    ]);
  });

  it("deve retornar um array vazio se o repositório não encontrar nada", async () => {
    vi.mocked(symptomRepository.findBySex).mockResolvedValue([]);

    const result = await symptomService.getBySex("f");

    expect(result).toEqual([]);
  });
});