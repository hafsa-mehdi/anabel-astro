import * as migration_20261012_152402_initial from './20261012_152402_initial';
import * as migration_20261012_181848_blob_fields from './20261012_181848_blob_fields';
import * as migration_20261012_185345_drafts_and_slugs from './20261012_185345_drafts_and_slugs';
import * as migration_20261012_192328_live_preview_autosave from './20261012_192328_live_preview_autosave';
import * as migration_20261013_154536_structured_data from './20261013_154536_structured_data';
import * as migration_20261013_160736_custom_schema from './20261013_160736_custom_schema';

export const migrations = [
  {
    up: migration_20261012_152402_initial.up,
    down: migration_20261012_152402_initial.down,
    name: '20261012_152402_initial',
  },
  {
    up: migration_20261012_181848_blob_fields.up,
    down: migration_20261012_181848_blob_fields.down,
    name: '20261012_181848_blob_fields',
  },
  {
    up: migration_20261012_185345_drafts_and_slugs.up,
    down: migration_20261012_185345_drafts_and_slugs.down,
    name: '20261012_185345_drafts_and_slugs',
  },
  {
    up: migration_20261012_192328_live_preview_autosave.up,
    down: migration_20261012_192328_live_preview_autosave.down,
    name: '20261012_192328_live_preview_autosave',
  },
  {
    up: migration_20261013_154536_structured_data.up,
    down: migration_20261013_154536_structured_data.down,
    name: '20261013_154536_structured_data',
  },
  {
    up: migration_20261013_160736_custom_schema.up,
    down: migration_20261013_160736_custom_schema.down,
    name: '20261013_160736_custom_schema'
  },
];
