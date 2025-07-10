import { HttpClient } from '@app/axios';
import {
  CreatePublicationRequest,
  CreatePublicationResponse,
  DeletePublicationRequest,
  DeletePublicationResponse,
  EditPublicationRequest,
  EditPublicationResponse,
  ListPublicationsByUserRequest,
  ListPublicationsByUserResponse,
  ListPublicationsRequest,
  ListPublicationsResponse,
  ToogleVisibilityRequest,
  ToogleVisibilityResponse,
  Publication,
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

  listPublicationsByUser(
    data: ListPublicationsByUserRequest
  ): Promise<ListPublicationsByUserResponse> {
    // Temporal: usar endpoint sin paginación para debug
    return this.http.get(`api/Publications/user/${data.userId}`);
  }

  getPublicationById(id: string): Promise<Publication> {
    return this.http.get(`api/Publications/${id}`);
  }

  createPublication(
    data: CreatePublicationRequest
  ): Promise<CreatePublicationResponse> {
    return this.http.post('api/Publications', data);
  }

  pausePublication(
    data: ToogleVisibilityRequest
  ): Promise<ToogleVisibilityResponse> {
    return this.http.post(`api/Publications/${data.idPublication}/pause`);
  }

  activatePublication(
    data: ToogleVisibilityRequest
  ): Promise<ToogleVisibilityResponse> {
    return this.http.post(`api/Publications/${data.idPublication}/activate`);
  }

  deletePublication(
    data: DeletePublicationRequest
  ): Promise<DeletePublicationResponse> {
    return this.http.delete(`api/Publications/${data.idPublication}`);
  }

  editPublication(
    data: EditPublicationRequest
  ): Promise<EditPublicationResponse> {
    return this.http.put(`api/Publications/${data.id}`, data);
  }
}
