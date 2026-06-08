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

  it("deve retornar os sintomas mapeados apenas com 'weight' unificado ao informar sexo 'm'", async () => {
    const mockRepoResponse = [
      {
        id: "uuid-1",
        symptomName: "Delayed speech development",
        category: "cognitive",
        weight: "0.14",
      },
      {
        id: "uuid-2",
        symptomName: "Macroorchidism",
        category: "physical",
        weight: "0.26",
      },
    ];

    vi.mocked(symptomRepository.findBySex).mockResolvedValue(
      mockRepoResponse as never,
    );

    const result = await symptomService.getBySex("m");

    expect(result).toEqual([
      {
        id: "uuid-1",
        symptomName: "Delayed speech development",
        category: "cognitive",
        weight: "0.14",
        weightM: undefined,
        weightF: undefined,
      },
      {
        id: "uuid-2",
        symptomName: "Macroorchidism",
        category: "physical",
        weight: "0.26",
        weightM: undefined,
        weightF: undefined,
      },
    ]);
  });

  it("deve retornar os sintomas mapeados apenas com 'weight' unificado ao informar sexo 'f'", async () => {
    const mockRepoResponse = [
      {
        id: "uuid-1",
        symptomName: "Delayed speech development",
        category: "cognitive",
        weight: "0.01",
      },
      {
        id: "uuid-2",
        symptomName: "Macroorchidism",
        category: "physical",
        weight: null,
      },
    ];

    vi.mocked(symptomRepository.findBySex).mockResolvedValue(
      mockRepoResponse as never,
    );

    const result = await symptomService.getBySex("f");

    expect(result).toEqual([
      {
        id: "uuid-1",
        symptomName: "Delayed speech development",
        category: "cognitive",
        weight: "0.01",
        weightM: undefined,
        weightF: undefined,
      },
      {
        id: "uuid-2",
        symptomName: "Macroorchidism",
        category: "physical",
        weight: null,
        weightM: undefined,
        weightF: undefined,
      },
    ]);
  });

  it("deve retornar os sintomas com 'weightM' e 'weightF' separados quando nenhum sexo ('') é informado", async () => {
    const mockRepoResponse = [
      {
        id: "uuid-1",
        symptomName: "Delayed speech development",
        category: "cognitive",
        weightM: "0.14",
        weightF: "0.01",
        applicableSex: null,
      },
      {
        id: "uuid-2",
        symptomName: "Macroorchidism",
        category: "physical",
        weightM: "0.26",
        weightF: null,
        applicableSex: "m",
      },
    ];

    vi.mocked(symptomRepository.findBySex).mockResolvedValue(
      mockRepoResponse as never,
    );

    const result = await symptomService.getBySex("");

    expect(result).toEqual([
      {
        id: "uuid-1",
        symptomName: "Delayed speech development",
        category: "cognitive",
        weight: undefined,
        weightM: "0.14",
        weightF: "0.01",
      },
      {
        id: "uuid-2",
        symptomName: "Macroorchidism",
        category: "physical",
        weight: undefined,
        weightM: "0.26",
        weightF: null,
      },
    ]);
  });

  it("deve retornar um array vazio se o repositório não encontrar nada", async () => {
    vi.mocked(symptomRepository.findBySex).mockResolvedValue([]);

    const result = await symptomService.getBySex("f");

    expect(result).toEqual([]);
  });
});
