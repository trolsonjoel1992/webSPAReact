import AxiosClient from '@app/axios';
import { PublicationsService } from '@features/publications/service';
import {
  CreatePublicationRequest,
  EditPublicationRequest,
  ListPublicationsByUserRequest,
  ListPublicationsRequest,
} from '@features/publications/types';

const publicationsService = new PublicationsService(AxiosClient);

export const listPublications = async (dataSend: ListPublicationsRequest) =>
  publicationsService.listPublications(dataSend);

export const listPublicationsByUser = async (
  dataSend: ListPublicationsByUserRequest
) => publicationsService.listPublicationsByUser(dataSend);

export const createPublication = async (dataSend: CreatePublicationRequest) =>
  publicationsService.createPublication(dataSend);

export const pausePublication = async (idPublication: string) =>
  publicationsService.pausePublication({ idPublication });

export const activatePublication = async (idPublication: string) =>
  publicationsService.activatePublication({ idPublication });

export const deletePublication = async (idPublication: string) =>
  publicationsService.deletePublication({ idPublication });

export const editPublication = async (dataSend: EditPublicationRequest) =>
  publicationsService.editPublication(dataSend);

export const getPublicationById = async (id: string) =>
  publicationsService.getPublicationById(id);
