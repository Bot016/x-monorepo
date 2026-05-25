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
  { nomeSintoma: "Atraso no desenvolvimento da fala",     categoria: "cognitivo",      pesoM: "0.14", pesoF: "0.01", aplicavelSexo: null },
  { nomeSintoma: "Dificuldade de aprendizado",            categoria: "cognitivo",      pesoM: "0.18", pesoF: "0.28", aplicavelSexo: null },
  { nomeSintoma: "Deficit de atenção",                    categoria: "comportamental", pesoM: "0.17", pesoF: "0.12", aplicavelSexo: null },
  { nomeSintoma: "Deficiencia intelectual",               categoria: "cognitivo", pesoM: "0.32", pesoF: "0.20", aplicavelSexo: null },
  { nomeSintoma: "Hiperatividade",                        categoria: "comportamental", pesoM: "0.12", pesoF: "0.04", aplicavelSexo: null },
  { nomeSintoma: "Comportamento agressivo",               categoria: "comportamental", pesoM: "0.01", pesoF: "0.02", aplicavelSexo: null },
  { nomeSintoma: "Evitacao de contato visual",            categoria: "comportamental", pesoM: "0.06", pesoF: "0.08", aplicavelSexo: null },
  { nomeSintoma: "Evitacao de contato fisico",            categoria: "comportamental", pesoM: "0.04", pesoF: "0.07", aplicavelSexo: null },
  { nomeSintoma: "Comportamentos repetitivos",            categoria: "comportamental", pesoM: "0.17", pesoF: "0.05", aplicavelSexo: null },
  { nomeSintoma: "Hipermobilidade articular",             categoria: "fisico",         pesoM: "0.19", pesoF: "0.04", aplicavelSexo: null },
  { nomeSintoma: "Macroorquidismo",                       categoria: "fisico",         pesoM: "0.26", pesoF: null,   aplicavelSexo: "m" },
  { nomeSintoma: "Face alongada / orelhas proeminentes",  categoria: "fisico",         pesoM: "0.29", pesoF: "0.09", aplicavelSexo: null },
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
