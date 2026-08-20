export const trendDefinitions = {
  atomicRadius: {
    label: "Atomic Radius",
    unit: "pm",
    description: "Approximate atomic size. Generally increases down a group and decreases across a period.",
    getValue: (element) => element.atomicRadius ?? null,
    format: (value) => `${value} pm`,
  },
  electronegativity: {
    label: "Electronegativity",
    unit: "Pauling",
    description: "How strongly an atom attracts bonding electrons. It generally rises toward fluorine.",
    getValue: (element) => element.electronegativity ?? null,
    format: (value) => value.toFixed(2),
  },
  ionizationEnergy: {
    label: "Ionization Energy",
    unit: "kJ/mol",
    description: "Energy required to remove an electron from a gaseous atom.",
    getValue: (element) => element.ionizationEnergy ?? null,
    format: (value) => `${value} kJ/mol`,
  },
  electronAffinity: {
    label: "Electron Affinity",
    unit: "kJ/mol",
    description: "Energy change associated with adding an electron to a neutral gaseous atom.",
    getValue: (element) => element.electronAffinity ?? null,
    format: (value) => `${value} kJ/mol`,
  },
  metallicCharacter: {
    label: "Metallic Character",
    unit: "trend",
    description: "Metallic behavior generally increases toward the lower-left of the periodic table.",
    getValue: (element) => {
      const period = element.period ?? 1;
      const group = element.group ?? 1;
      return Math.max(0, Math.min(100, 78 + period * 5 - group * 2.8));
    },
    format: (value) => `${Math.round(value)}%`,
  },
};

export const getTrendValue = (element, trendKey) => {
  const trend = trendDefinitions[trendKey];
  if (!trend || !element) return null;
  return trend.getValue(element);
};

export const getTrendColorIntensity = (value, min, max) => {
  if (value == null || min == null || max == null || max === min) return 0.12;
  return 0.14 + ((value - min) / (max - min)) * 0.78;
};
