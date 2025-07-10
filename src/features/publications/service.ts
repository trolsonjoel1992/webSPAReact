import { HttpClient } from '@app/axios';
import {
  CreatePublicationRequest,
  CreatePublicationResponse,
  ListPublicationsRequest,
  ListPublicationsResponse,
} from '@features/publications/types';

export class PublicationsService {
  constructor(private readonly http: HttpClient) {}
  listPublications(
    data: ListPublicationsRequest
  ): Promise<ListPublicationsResponse> {
    return this.http.get(
      `api/Publications/paged?page=${data.page}&pageSize=${data.size}`
    );
  }

  createPublication(
    data: CreatePublicationRequest
  ): Promise<CreatePublicationResponse> {
    return this.http.post('api/Publications', data);
  }
}
