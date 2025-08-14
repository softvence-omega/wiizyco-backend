export type ContactCategory = 'Bug' | 'General' | 'Media' | 'Partnership';

export type TContact = {
  name: string;
  email: string;
  category: ContactCategory;
  message: string;
};
