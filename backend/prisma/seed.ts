import { prisma } from "../src/config/prisma.js";

const roles = ["administrator", "healthcare_professional"] as const;

const symptoms = [
  {
    symptomName: "Delayed speech development",
    category: "cognitive",
    weightM: "0.14",
    weightF: "0.01",
    applicableSex: null,
  },
  {
    symptomName: "Learning difficulty",
    category: "cognitive",
    weightM: "0.18",
    weightF: "0.28",
    applicableSex: null,
  },
  {
    symptomName: "Attention deficit",
    category: "behavioral",
    weightM: "0.17",
    weightF: "0.12",
    applicableSex: null,
  },
  {
    symptomName: "Intellectual disability",
    category: "cognitive",
    weightM: "0.32",
    weightF: "0.20",
    applicableSex: null,
  },
  {
    symptomName: "Hyperactivity",
    category: "behavioral",
    weightM: "0.12",
    weightF: "0.04",
    applicableSex: null,
  },
  {
    symptomName: "Aggressive behavior",
    category: "behavioral",
    weightM: "0.01",
    weightF: "0.02",
    applicableSex: null,
  },
  {
    symptomName: "Avoidance of eye contact",
    category: "behavioral",
    weightM: "0.06",
    weightF: "0.08",
    applicableSex: null,
  },
  {
    symptomName: "Avoidance of physical contact",
    category: "behavioral",
    weightM: "0.04",
    weightF: "0.07",
    applicableSex: null,
  },
  {
    symptomName: "Repetitive behaviors",
    category: "behavioral",
    weightM: "0.17",
    weightF: "0.05",
    applicableSex: null,
  },
  {
    symptomName: "Joint hypermobility",
    category: "physical",
    weightM: "0.19",
    weightF: "0.04",
    applicableSex: null,
  },
  {
    symptomName: "Macroorchidism",
    category: "physical",
    weightM: "0.26",
    weightF: null,
    applicableSex: "m",
  },
  {
    symptomName: "Elongated face / prominent ears",
    category: "physical",
    weightM: "0.29",
    weightF: "0.09",
    applicableSex: null,
  },
] as const;

async function main() {
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Seeded ${roles.length} roles.`);

  // symptom.symptomName is not unique, so guard each insert by name to stay idempotent.
  let inserted = 0;
  for (const s of symptoms) {
    const existing = await prisma.symptom.findFirst({
      where: { symptomName: s.symptomName },
    });
    if (existing) continue;
    await prisma.symptom.create({ data: s });
    inserted++;
  }
  console.log(
    `Seeded ${inserted} new symptoms (${symptoms.length} total defined).`,
  );
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