declare namespace App {
  interface Locals {
    /** Live preview: when each page/entry shown was last saved (set by src/middleware.ts). */
    previewStamps?: Record<string, string>;
  }
}
