export type Image = {
  id: string;
  url: string;
  altText: string;
  displayOrder: number;
  publicationId: string;
  publication: string;
};

export type Publication = {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  isPremium: boolean;
  type: string;
  isPaused: boolean;
  userId: string;
  brand: string;
  model: string;
  color: string;
  condition: string;
  compatibility: string;
  images: Image[];
};

export type ListPublicationsRequest = {
  page: number;
  size: number;
};

export type ListPublicationsResponse = {
  total: number;
  publications: Publication[];
};

export type ListPublicationsByUserRequest = {
  userId: string;
  page: number;
  size: number;
};

export type ListPublicationsByUserResponse = Publication[];

export type CreatePublicationRequest = {
  title: string;
  description: string;
  price: number;
  city: string;
  isPremium: boolean;
  type: string;
  brand: string;
  model: string;
  color: string;
  condition: 'Excelente' | 'Bueno' | 'Aceptable' | '';
  compatibility: string;
};

export type CreatePublicationResponse = {};

export type ToogleVisibilityRequest = {
  idPublication: string;
};

export type ToogleVisibilityResponse = {};

export type DeletePublicationRequest = {
  idPublication: string;
};

export type DeletePublicationResponse = {};

export type EditPublicationRequest = {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  isPremium: boolean;
  type: string;
  brand: string;
  model: string;
  color: string;
  condition: 'Excelente' | 'Bueno' | 'Aceptable' | '';
  compatibility: string;
};

export type EditPublicationResponse = {};
