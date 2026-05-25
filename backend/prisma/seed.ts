// import "dotenv/config";
import { prisma } from "../src/config/prisma.js";

// ─────────────────────────────────────────────────────────────────────────────
// Roles (cargo). cargo.nome is UNIQUE, so we can upsert idempotently.
// ─────────────────────────────────────────────────────────────────────────────
const cargos = ["administrador", "profissional_saude"] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Symptoms (sintoma).
//
// ⚠️  PLACEHOLDER DATA. The names below are a plausible Fragile-X symptom set
//     and the weights (peso_m / peso_f) are dummy values. Replace BOTH with the
//     calibrated values from the clinical protocol before go-live.
//
// `aplicavelSexo`:  null = applies to both sexes; "m" = males only.
//                   Macroorquidismo is the only male-exclusive sign (RN02/RF05).
// Expectation: 12 rows total → 11 apply to females, 12 to males.
// ─────────────────────────────────────────────────────────────────────────────
const sintomas = [
  { nomeSintoma: "Dificuldade de aprendizado",            categoria: "cognitivo",      pesoM: "0.10", pesoF: "0.10", aplicavelSexo: null },
  { nomeSintoma: "Déficit de atenção",                    categoria: "comportamental", pesoM: "0.08", pesoF: "0.09", aplicavelSexo: null },
  { nomeSintoma: "Comportamento agressivo",               categoria: "comportamental", pesoM: "0.07", pesoF: "0.07", aplicavelSexo: null },
  { nomeSintoma: "Atraso no desenvolvimento da fala",     categoria: "cognitivo",      pesoM: "0.10", pesoF: "0.10", aplicavelSexo: null },
  { nomeSintoma: "Hiperatividade",                        categoria: "comportamental", pesoM: "0.07", pesoF: "0.08", aplicavelSexo: null },
  { nomeSintoma: "Ansiedade social",                      categoria: "comportamental", pesoM: "0.06", pesoF: "0.08", aplicavelSexo: null },
  { nomeSintoma: "Contato visual reduzido",               categoria: "comportamental", pesoM: "0.06", pesoF: "0.06", aplicavelSexo: null },
  { nomeSintoma: "Comportamentos repetitivos",            categoria: "comportamental", pesoM: "0.07", pesoF: "0.07", aplicavelSexo: null },
  { nomeSintoma: "Hipersensibilidade sensorial",          categoria: "comportamental", pesoM: "0.06", pesoF: "0.06", aplicavelSexo: null },
  { nomeSintoma: "Face alongada / orelhas proeminentes",  categoria: "fisico",         pesoM: "0.09", pesoF: "0.08", aplicavelSexo: null },
  { nomeSintoma: "Hiperextensibilidade articular",        categoria: "fisico",         pesoM: "0.07", pesoF: "0.08", aplicavelSexo: null },
  { nomeSintoma: "Macroorquidismo",                       categoria: "fisico",         pesoM: "0.10", pesoF: null,   aplicavelSexo: "m" },
] as const;

async function main() {
  for (const nome of cargos) {
    await prisma.cargo.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }
  console.log(`Seeded ${cargos.length} cargos.`);

  // sintoma.nomeSintoma is not unique, so guard each insert by name to stay idempotent.
  let inserted = 0;
  for (const s of sintomas) {
    const existing = await prisma.sintoma.findFirst({ where: { nomeSintoma: s.nomeSintoma } });
    if (existing) continue;
    await prisma.sintoma.create({ data: s });
    inserted++;
  }
  console.log(`Seeded ${inserted} new sintomas (${sintomas.length} total defined).`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
