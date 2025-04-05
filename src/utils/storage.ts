
const TOKEN_KEY = 'tokens';
const LANGUAGE_KEY = 'language';

export const getUserTokens = ()  => {
  const tokens = localStorage.getItem(TOKEN_KEY);
  return tokens ? JSON.parse(tokens) : null;
};

export const saveUserTokens = (tokens:any)=> {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const removeTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const clearStorage = (): void => {
  localStorage.clear();
};

export const setActiveCompanyId = (companyId: string): void => {
  localStorage.setItem('activeCompany', companyId);
};

export const getActiveCompanyId = (): string | null => {
  return localStorage.getItem('activeCompany');
};


export const getPreferredLanguage = () => {
  return localStorage.getItem(LANGUAGE_KEY);
}

export const setPreferredLanguage = (language: string) => {
  localStorage.setItem(LANGUAGE_KEY, language);
}