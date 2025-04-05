export interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export type Languages = Record<string, Language>;