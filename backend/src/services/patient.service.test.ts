import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../repositories/patient.repository.js", () => ({
  patientRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    createWithGuardian: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
  },
}));

vi.mock("../repositories/user.repository.js", () => ({
  userRepository: {
    hasActiveRole: vi.fn(),
  },
}));

import { patientService } from "./patient.service.js";
import { patientRepository } from "../repositories/patient.repository.js";
import { userRepository } from "../repositories/user.repository.js";

const guardian = {
  id: "g-1",
  name: "Maria Silva",
  cpf: "12345678901",
  email: "maria@example.com",
  phone: "11999999999",
};

function makePatient(overrides: object = {}) {
  return {
    id: "p-1",
    name: "João da Silva",
    sex: "m" as const,
    birthDate: new Date("2018-04-10"),
    guardianId: "g-1",
    guardian,
    deletedAt: null,
    ...overrides,
  };
}

describe("patientService.list", () => {
  beforeEach(() => vi.clearAllMocks());

  it("passes isAdmin=true when the user has the administrator role", async () => {
    vi.mocked(userRepository.hasActiveRole).mockResolvedValue({
      id: "ur-1",
    } as never);
    vi.mocked(patientRepository.findAll).mockResolvedValue([]);

    await patientService.list("u-1");

    expect(patientRepository.findAll).toHaveBeenCalledWith({
      userId: "u-1",
      isAdmin: true,
    });
  });

  it("passes isAdmin=false when the user has no administrator role", async () => {
    vi.mocked(userRepository.hasActiveRole).mockResolvedValue(null);
    vi.mocked(patientRepository.findAll).mockResolvedValue([]);

    await patientService.list("u-2");

    expect(patientRepository.findAll).toHaveBeenCalledWith({
      userId: "u-2",
      isAdmin: false,
    });
  });

  it("maps rows to DTOs and omits CPF from the guardian", async () => {
    vi.mocked(userRepository.hasActiveRole).mockResolvedValue(null);
    vi.mocked(patientRepository.findAll).mockResolvedValue([
      makePatient(),
    ] as never);

    const result = await patientService.list("u-1");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: "p-1", name: "João da Silva" });
    expect(result[0].guardian).not.toHaveProperty("cpf");
  });
});

describe("patientService.getById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a DTO with birthDate as YYYY-MM-DD string", async () => {
    vi.mocked(patientRepository.findById).mockResolvedValue(
      makePatient() as never,
    );

    const result = await patientService.getById("p-1");

    expect(result?.birthDate).toBe("2018-04-10");
  });

  it("passes through a birthDate that is already a string", async () => {
    vi.mocked(patientRepository.findById).mockResolvedValue(
      makePatient({ birthDate: "2018-04-10" }) as never,
    );

    const result = await patientService.getById("p-1");

    expect(result?.birthDate).toBe("2018-04-10");
  });

  it("returns null when the patient does not exist", async () => {
    vi.mocked(patientRepository.findById).mockResolvedValue(null);

    expect(await patientService.getById("missing")).toBeNull();
  });

  it("returns null guardian when the patient has no guardian", async () => {
    vi.mocked(patientRepository.findById).mockResolvedValue(
      makePatient({ guardianId: null, guardian: null }) as never,
    );

    const result = await patientService.getById("p-1");

    expect(result?.guardian).toBeNull();
    expect(result?.guardianId).toBeNull();
  });
});

describe("patientService.create", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls create (no guardian) when no guardian is provided", async () => {
    vi.mocked(patientRepository.create).mockResolvedValue(
      makePatient() as never,
    );

    await patientService.create({
      name: "João da Silva",
      sex: "m",
      birthDate: "2018-04-10",
    });

    expect(patientRepository.create).toHaveBeenCalledOnce();
    expect(patientRepository.createWithGuardian).not.toHaveBeenCalled();
  });

  it("calls createWithGuardian when an inline guardian is provided", async () => {
    vi.mocked(patientRepository.createWithGuardian).mockResolvedValue(
      makePatient() as never,
    );

    await patientService.create({
      name: "João da Silva",
      sex: "m",
      birthDate: "2018-04-10",
      guardian: { name: "Maria Silva" },
    });

    expect(patientRepository.createWithGuardian).toHaveBeenCalledOnce();
    expect(patientRepository.create).not.toHaveBeenCalled();
  });

  it("converts the birthDate string to a Date before persisting", async () => {
    vi.mocked(patientRepository.create).mockResolvedValue(
      makePatient() as never,
    );

    await patientService.create({
      name: "João da Silva",
      sex: "m",
      birthDate: "2018-04-10",
    });

    const [data] = vi.mocked(patientRepository.create).mock.calls[0];
    expect(data.birthDate).toBeInstanceOf(Date);
  });
});

describe("patientService.update", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when the patient does not exist", async () => {
    vi.mocked(patientRepository.findById).mockResolvedValue(null);

    expect(await patientService.update("missing", { name: "X" })).toBeNull();
    expect(patientRepository.update).not.toHaveBeenCalled();
  });

  it("only passes defined fields to the repository", async () => {
    vi.mocked(patientRepository.findById).mockResolvedValue(
      makePatient() as never,
    );
    vi.mocked(patientRepository.update).mockResolvedValue(
      makePatient() as never,
    );

    await patientService.update("p-1", { name: "Novo Nome" });

    const [, data] = vi.mocked(patientRepository.update).mock.calls[0];
    expect(data).toEqual({ name: "Novo Nome" });
    expect(data).not.toHaveProperty("sex");
    expect(data).not.toHaveProperty("birthDate");
  });

  it("allows unlinking a guardian by passing guardianId: null", async () => {
    vi.mocked(patientRepository.findById).mockResolvedValue(
      makePatient() as never,
    );
    vi.mocked(patientRepository.update).mockResolvedValue(
      makePatient({ guardianId: null, guardian: null }) as never,
    );

    const result = await patientService.update("p-1", { guardianId: null });

    expect(result?.guardianId).toBeNull();
    const [, data] = vi.mocked(patientRepository.update).mock.calls[0];
    expect(data.guardianId).toBeNull();
  });
});

describe("patientService.delete", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when the patient does not exist", async () => {
    vi.mocked(patientRepository.findById).mockResolvedValue(null);

    expect(await patientService.delete("missing")).toBeNull();
    expect(patientRepository.softDelete).not.toHaveBeenCalled();
  });

  it("calls softDelete and returns the DTO of the deleted patient", async () => {
    vi.mocked(patientRepository.findById).mockResolvedValue(
      makePatient() as never,
    );
    vi.mocked(patientRepository.softDelete).mockResolvedValue(
      undefined as never,
    );

    const result = await patientService.delete("p-1");

    expect(patientRepository.softDelete).toHaveBeenCalledWith("p-1");
    expect(result?.id).toBe("p-1");
  });
});
