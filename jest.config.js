/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/build/', // Exclude the build folder
  ],
};

// /** @type {import('jest').Config} */
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   moduleFileExtensions: ['ts', 'js'],
//   transform: {
//     '^.+\\.(ts|tsx)$': 'ts-jest',
//   },
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1',
//   },
//   testPathIgnorePatterns: [
//     '<rootDir>/build/',
//     '<rootDir>/dist/',
//   ],
//   clearMocks: true,
//   verbose: true,
// };

