import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
};
export default config;
