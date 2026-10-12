import * as migration_20261012_152402_initial from './20261012_152402_initial';

export const migrations = [
  {
    up: migration_20261012_152402_initial.up,
    down: migration_20261012_152402_initial.down,
    name: '20261012_152402_initial'
  },
];
