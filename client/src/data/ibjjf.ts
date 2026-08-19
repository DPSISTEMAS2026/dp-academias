/** Divisiones IBJJF con gi, en español. Identidad DP: sin inglés ni portugués de competición. */

const BELT_LABELS: Record<string, string> = {
  WHITE: 'Blanco',
  BLUE: 'Azul',
  PURPLE: 'Morado',
  BROWN: 'Marrón',
  BLACK: 'Negro',
  GRAY: 'Gris',
};

type Cut = { max: number; name: string };

function kg(n: number) {
  return `${n.toFixed(2).replace('.', ',')} kg`;
}

function pickDivision(weight: number, cuts: Cut[], overflow: string) {
  for (const cut of cuts) {
    if (weight <= cut.max) return { name: cut.name, limit: `hasta ${kg(cut.max)}` };
  }
  return { name: overflow, limit: `más de ${kg(cuts[cuts.length - 1].max)}` };
}

const JUV_M: Cut[] = [
  { max: 53.5, name: 'Galo' }, { max: 58.5, name: 'Pluma' }, { max: 64, name: 'Pena' },
  { max: 69, name: 'Leve' }, { max: 74, name: 'Medio' }, { max: 79.3, name: 'Medio pesado' },
  { max: 84.3, name: 'Pesado' }, { max: 89.3, name: 'Super pesado' },
];
const JUV_F: Cut[] = [
  { max: 44.3, name: 'Galo' }, { max: 48.3, name: 'Pluma' }, { max: 52.5, name: 'Pena' },
  { max: 56.5, name: 'Leve' }, { max: 60.5, name: 'Medio' }, { max: 65, name: 'Medio pesado' },
  { max: 69, name: 'Pesado' },
];
const AD_F: Cut[] = [
  { max: 48.5, name: 'Galo' }, { max: 53.5, name: 'Pluma' }, { max: 58.5, name: 'Pena' },
  { max: 64, name: 'Leve' }, { max: 69, name: 'Medio' }, { max: 74, name: 'Medio pesado' },
  { max: 79.3, name: 'Pesado' },
];
const AD_M: Cut[] = [
  { max: 57.5, name: 'Galo' }, { max: 64, name: 'Pluma' }, { max: 70, name: 'Pena' },
  { max: 76, name: 'Leve' }, { max: 82.3, name: 'Medio' }, { max: 88.3, name: 'Medio pesado' },
  { max: 94.3, name: 'Pesado' }, { max: 100.5, name: 'Super pesado' },
];

export type IBJJFCategory = {
  age: number;
  ageCategory: string;
  divisionName: string;
  weightLimitText: string;
  beltName: string;
  genderText: string;
  hasGender: boolean;
  fullCategoryString: string;
  ready: boolean;
};

export function calculateIBJJFCategory(
  birthDate?: string | null,
  weightKg?: number | null,
  gender?: 'MALE' | 'FEMALE' | string | null,
  beltStr: string = 'WHITE'
): IBJJFCategory {
  let age = 0;
  if (birthDate) {
    const birth = new Date(birthDate);
    if (!isNaN(birth.getTime())) {
      const now = new Date();
      age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    }
  }

  const hasGender = gender === 'MALE' || gender === 'FEMALE';
  const isFemale = gender === 'FEMALE';
  const weight = weightKg && Number(weightKg) > 0 ? Number(weightKg) : 0;

  let ageCategory = age > 0 ? 'Adulto (18-29 años)' : 'Sin fecha de nacimiento';
  let isJuvenile = false;
  if (age > 0 && age < 16) {
    if (age < 7) ageCategory = 'Pre-infantil (menos de 7)';
    else if (age <= 9) ageCategory = 'Infantil A (7-9 años)';
    else if (age <= 12) ageCategory = 'Infantil B (10-12 años)';
    else ageCategory = 'Infanto-juvenil (13-15 años)';
  } else if (age >= 16 && age <= 17) {
    isJuvenile = true;
    ageCategory = 'Juvenil (16-17 años)';
  } else if (age >= 18 && age <= 29) ageCategory = 'Adulto (18-29 años)';
  else if (age >= 30 && age <= 35) ageCategory = 'Master 1 (30-35 años)';
  else if (age >= 36 && age <= 40) ageCategory = 'Master 2 (36-40 años)';
  else if (age >= 41 && age <= 45) ageCategory = 'Master 3 (41-45 años)';
  else if (age >= 46 && age <= 50) ageCategory = 'Master 4 (46-50 años)';
  else if (age >= 51 && age <= 55) ageCategory = 'Master 5 (51-55 años)';
  else if (age >= 56) ageCategory = 'Master 6 (56 años o más)';

  let divisionName = 'Falta el peso';
  let weightLimitText = '';
  if (!hasGender) {
    divisionName = 'Falta el género';
  } else if (weight > 0) {
    const picked = isJuvenile && !isFemale ? pickDivision(weight, JUV_M, 'Pesadísimo')
      : isJuvenile && isFemale ? pickDivision(weight, JUV_F, 'Super pesado')
      : isFemale ? pickDivision(weight, AD_F, 'Super pesado')
      : pickDivision(weight, AD_M, 'Pesadísimo');
    divisionName = picked.name;
    weightLimitText = picked.limit;
  }

  const beltName = BELT_LABELS[beltStr] || beltStr;
  const genderText = hasGender ? (isFemale ? 'Femenino' : 'Masculino') : 'Por definir';
  const ageShort = ageCategory.split(' ')[0];
  let fullCategoryString = `${ageShort} · ${beltName}`;
  if (hasGender && weight > 0) {
    fullCategoryString += ` · ${genderText} · ${divisionName} (${weightLimitText})`;
  } else if (hasGender) {
    fullCategoryString += ` · ${genderText} · indica el peso`;
  } else {
    fullCategoryString += ' · indica género y peso';
  }

  return {
    age,
    ageCategory,
    divisionName,
    weightLimitText,
    beltName,
    genderText,
    hasGender,
    fullCategoryString,
    ready: age > 0 && hasGender && weight > 0,
  };
}
