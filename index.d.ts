import { Plugin } from "webpack";

export interface Options {
  /**
   * An array of locales to keep bundled (other locales would be removed).
   *
   * default: ['en']
   */
  localesToKeep?: string[],
  ignoreInvalidLocales: boolean,
}

declare class MomentLocalesWebpackPlugin extends Plugin{
  constructor(options?: Options);
}

export default MomentLocalesWebpackPlugin;
