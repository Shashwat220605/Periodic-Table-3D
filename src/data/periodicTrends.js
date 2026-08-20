// Periodic-trend dataset for all 118 elements.
// Electronegativity, atomic radius, melting point and density values are
// based on the referenced interactive periodic-table dataset. Some
// superheavy-element properties are genuinely unknown and remain null.

const rows = [
  // Z: electronegativity, radius(pm), melting(K), density(g/cm³)
  [2.20,25,14.01,0.00009],[null,31,0.95,0.00018],[0.98,145,453.65,0.534],[1.57,105,1560,1.85],
  [2.04,85,2349,2.34],[2.55,70,3823,2.27],[3.04,65,63.15,0.00125],[3.44,60,54.36,0.00143],
  [3.98,50,53.53,0.0017],[null,38,24.56,0.0009],[0.93,180,370.87,0.971],[1.31,150,923,1.738],
  [1.61,125,933.47,2.7],[1.90,110,1687,2.33],[2.19,100,317.3,1.82],[2.58,100,388.36,2.07],
  [3.16,100,171.6,0.00321],[null,71,83.8,0.00178],[0.82,220,336.53,0.862],[1.00,180,1115,1.54],
  [1.36,160,1814,2.99],[1.54,140,1941,4.51],[1.63,135,2183,6.0],[1.66,140,2180,7.15],
  [1.55,140,1519,7.44],[1.83,140,1811,7.874],[1.88,135,1768,8.86],[1.91,135,1728,8.912],
  [1.90,135,1357.77,8.96],[1.65,135,692.68,7.134],[1.81,130,302.91,5.907],[2.01,125,1211.4,5.323],
  [2.18,115,1090,5.776],[2.55,115,494,4.809],[2.96,115,265.8,3.122],[3.00,88,115.79,0.00375],
  [0.82,235,312.46,1.532],[0.95,200,1050,2.64],[1.22,180,1799,4.47],[1.33,155,2128,6.52],
  [1.60,145,2750,8.57],[2.16,145,2896,10.28],[1.90,135,2430,11.5],[2.20,130,2607,12.37],
  [2.28,135,2237,12.41],[2.20,140,1828.05,12.02],[1.93,160,1234.93,10.501],[1.69,155,594.22,8.69],
  [1.78,155,429.75,7.31],[1.96,145,505.08,7.287],[2.05,145,903.78,6.685],[2.10,140,722.66,6.232],
  [2.66,140,386.85,4.93],[2.60,108,161.4,0.00589],[0.79,260,301.59,1.873],[0.89,215,1000,3.594],
  [1.10,195,1193,6.145],[1.12,185,1068,6.77],[1.13,185,1208,6.773],[1.14,185,1297,7.007],
  [1.13,185,1373,7.26],[1.17,185,1345,7.52],[1.20,185,1099,5.243],[1.20,180,1585,7.895],
  [1.10,175,1629,8.229],[1.22,175,1680,8.55],[1.23,175,1734,8.795],[1.24,175,1802,9.066],
  [1.25,175,1818,9.321],[1.10,175,1097,6.965],[1.27,175,1925,9.84],[1.30,155,2506,13.31],
  [1.50,145,3290,16.654],[2.36,135,3695,19.25],[1.90,135,3459,21.02],[2.20,130,3306,22.59],
  [2.20,135,2719,22.56],[2.28,135,2041.4,21.46],[2.54,135,1337.33,19.282],[2.00,150,234.32,13.5336],
  [1.62,190,577,11.85],[2.33,180,600.61,11.342],[2.02,160,544.7,9.807],[2.00,190,527,9.32],
  [2.20,127,575,null],[2.20,120,202,0.00973],[0.79,260,300,1.87],[0.90,215,973,5.5],
  [1.10,195,1323,10.07],[1.30,180,2115,11.72],[1.50,180,1841,15.37],[1.38,175,1405.3,18.95],
  [1.36,175,917,20.45],[1.28,175,912.5,19.84],[1.13,175,1449,13.69],[1.28,175,1613,13.51],
  [1.30,null,1259,14.79],[1.30,null,1173,15.1],[1.30,null,1133,8.84],[1.30,null,1800,null],
  [1.30,null,null,null],[1.30,null,null,null],[1.30,null,null,null],[null,null,null,null],
  [null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],
  [null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],
  [null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],
];

export const trendData = Object.fromEntries(
  rows.map(([electronegativity, atomicRadius, meltingPoint, density], index) => [
    index + 1,
    { electronegativity, atomicRadius, meltingPoint, density },
  ])
);

export const trendDefinitions = {
  atomicRadius: {
    label: "Atomic Radius",
    unit: "pm",
    description: "Atomic size generally increases down a group and decreases across a period.",
    getValue: (element) => trendData[element?.number]?.atomicRadius ?? null,
    format: (value) => `${value} pm`,
  },
  electronegativity: {
    label: "Electronegativity",
    unit: "Pauling",
    description: "The tendency of an atom to attract bonding electrons. It generally rises toward fluorine.",
    getValue: (element) => trendData[element?.number]?.electronegativity ?? null,
    format: (value) => value.toFixed(2),
  },
  meltingPoint: {
    label: "Melting Point",
    unit: "K",
    description: "Temperature at which the element changes from solid to liquid at standard pressure.",
    getValue: (element) => trendData[element?.number]?.meltingPoint ?? null,
    format: (value) => `${value} K`,
  },
  density: {
    label: "Density",
    unit: "g/cm³",
    description: "Mass per unit volume. Values are presented in g/cm³ where available.",
    getValue: (element) => trendData[element?.number]?.density ?? null,
    format: (value) => `${value} g/cm³`,
  },
  metallicCharacter: {
    label: "Metallic Character",
    unit: "trend",
    description: "A qualitative periodic trend that generally increases toward the lower-left of the table.",
    getValue: (element) => {
      const period = element?.period ?? 1;
      const group = element?.group ?? 1;
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
