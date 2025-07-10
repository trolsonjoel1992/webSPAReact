import AxiosClient from '@app/axios';
import { PublicationsService } from '@features/publications/service';
import {
  CreatePublicationRequest,
  ListPublicationsRequest,
} from '@features/publications/types';

const publicationsService = new PublicationsService(AxiosClient);

export const listPublications = async (dataSend: ListPublicationsRequest) =>
  publicationsService.listPublications(dataSend);

export const createPublication = async (dataSend: CreatePublicationRequest) =>
  publicationsService.createPublication(dataSend);
