// symptom.service.ts
import {
  symptomRepository,
  type SexOption,
} from "../repositories/symptom.repository.js";

export const symptomService = {
  async getBySex(sex: SexOption) {
    const symptoms = await symptomRepository.findBySex(sex);

    return symptoms.map((symptom) => ({
      id: symptom.id,
      symptomName: symptom.symptomName,
      category: symptom.category,
      weight: "weight" in symptom ? symptom.weight : undefined,
      weightM: "weightM" in symptom ? symptom.weightM : undefined,
      weightF: "weightF" in symptom ? symptom.weightF : undefined,
    }));
  },
};
