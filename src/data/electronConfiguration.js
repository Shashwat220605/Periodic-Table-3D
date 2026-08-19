const orbitalOrder = [
  { orbital: "1s", capacity: 2 },
  { orbital: "2s", capacity: 2 },
  { orbital: "2p", capacity: 6 },
  { orbital: "3s", capacity: 2 },
  { orbital: "3p", capacity: 6 },
  { orbital: "4s", capacity: 2 },
  { orbital: "3d", capacity: 10 },
  { orbital: "4p", capacity: 6 },
  { orbital: "5s", capacity: 2 },
  { orbital: "4d", capacity: 10 },
  { orbital: "5p", capacity: 6 },
  { orbital: "6s", capacity: 2 },
  { orbital: "4f", capacity: 14 },
  { orbital: "5d", capacity: 10 },
  { orbital: "6p", capacity: 6 },
  { orbital: "7s", capacity: 2 },
  { orbital: "5f", capacity: 14 },
  { orbital: "6d", capacity: 10 },
  { orbital: "7p", capacity: 6 },
];

const exceptions = {
  24: {
    name: "Chromium",
    configuration:
      "1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹",
    shorthand:
      "[Ar] 3d⁵ 4s¹",
  },

  29: {
    name: "Copper",
    configuration:
      "1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹",
    shorthand:
      "[Ar] 3d¹⁰ 4s¹",
  },
};

function superscript(number) {
  const map = {
    0: "⁰",
    1: "¹",
    2: "²",
    3: "³",
    4: "⁴",
    5: "⁵",
    6: "⁶",
    7: "⁷",
    8: "⁸",
    9: "⁹",
  };

  return String(number)
    .split("")
    .map((digit) => map[digit])
    .join("");
}

export function getElectronConfiguration(
  atomicNumber
) {
  /*
   * Handle known electron configuration
   * exceptions first.
   */

  if (exceptions[atomicNumber]) {
    return {
      ...exceptions[atomicNumber],
      orbitals: getOrbitals(
        atomicNumber
      ),
    };
  }

  return {
    configuration:
      buildConfiguration(
        atomicNumber
      ),

    shorthand:
      buildConfiguration(
        atomicNumber
      ),

    orbitals:
      getOrbitals(
        atomicNumber
      ),
  };
}

/*
 * Generate orbital occupancy.
 */

function getOrbitals(atomicNumber) {
  let remaining =
    atomicNumber;

  const orbitals = [];

  for (const orbital of orbitalOrder) {
    if (remaining <= 0) {
      break;
    }

    const electrons =
      Math.min(
        remaining,
        orbital.capacity
      );

    orbitals.push({
      orbital:
        orbital.orbital,

      electrons,

      capacity:
        orbital.capacity,
    });

    remaining -= electrons;
  }

  /*
   * Correct Chromium:
   * [Ar] 3d⁵ 4s¹
   */

  if (atomicNumber === 24) {
    return [
      {
        orbital: "1s",
        electrons: 2,
        capacity: 2,
      },
      {
        orbital: "2s",
        electrons: 2,
        capacity: 2,
      },
      {
        orbital: "2p",
        electrons: 6,
        capacity: 6,
      },
      {
        orbital: "3s",
        electrons: 2,
        capacity: 2,
      },
      {
        orbital: "3p",
        electrons: 6,
        capacity: 6,
      },
      {
        orbital: "4s",
        electrons: 1,
        capacity: 2,
      },
      {
        orbital: "3d",
        electrons: 5,
        capacity: 10,
      },
    ];
  }

  /*
   * Correct Copper:
   * [Ar] 3d¹⁰ 4s¹
   */

  if (atomicNumber === 29) {
    return [
      {
        orbital: "1s",
        electrons: 2,
        capacity: 2,
      },
      {
        orbital: "2s",
        electrons: 2,
        capacity: 2,
      },
      {
        orbital: "2p",
        electrons: 6,
        capacity: 6,
      },
      {
        orbital: "3s",
        electrons: 2,
        capacity: 2,
      },
      {
        orbital: "3p",
        electrons: 6,
        capacity: 6,
      },
      {
        orbital: "4s",
        electrons: 1,
        capacity: 2,
      },
      {
        orbital: "3d",
        electrons: 10,
        capacity: 10,
      },
    ];
  }

  return orbitals;
}

/*
 * Convert orbital data into:
 *
 * 1s² 2s² 2p⁶ ...
 */

function buildConfiguration(
  atomicNumber
) {
  const orbitals =
    getOrbitals(
      atomicNumber
    );

  return orbitals
    .map(
      ({
        orbital,
        electrons,
      }) =>
        `${orbital}${superscript(
          electrons
        )}`
    )
    .join(" ");
}

/*
 * Return shell populations.
 *
 * Example Carbon:
 *
 * [
 *   { shell: 1, electrons: 2 },
 *   { shell: 2, electrons: 4 }
 * ]
 */

export function getShellConfiguration(
  atomicNumber
) {
  const configuration =
    getElectronConfiguration(
      atomicNumber
    );

  const shells = {};

  configuration.orbitals.forEach(
    ({
      orbital,
      electrons,
    }) => {
      const shell =
        Number(
          orbital[0]
        );

      shells[shell] =
        (shells[shell] || 0) +
        electrons;
    }
  );

  return Object.entries(
    shells
  ).map(
    ([shell, electrons]) => ({
      shell:
        Number(shell),

      electrons,
    })
  );
}