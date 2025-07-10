import {
  activatePublication,
  createPublication,
  deletePublication,
  editPublication,
  getPublicationById,
  listPublications,
  listPublicationsByUser,
  pausePublication,
} from '@features/publications/api';
import {
  CreatePublicationRequest,
  EditPublicationRequest,
  ListPublicationsRequest,
} from '@features/publications/types';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

export const useListPublications = (dataSend: ListPublicationsRequest) => {
  return useQuery({
    queryKey: ['listPublications', dataSend],
    queryFn: async () => {
      const data = await listPublications(dataSend);

      return data;
    },
  });
};

export const useListPublicationsByUser = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ['listPublicationsByUser', userId],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await listPublicationsByUser({
        userId,
        page: pageParam,
        size: 12, // tamaño de página
      });

      // Como el backend devuelve directamente un array, lo envolvemos en el formato esperado
      return {
        publications: Array.isArray(data) ? data : [],
        total: Array.isArray(data) ? data.length : 0,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages) => {
      // Como no tenemos paginación real por ahora, no hay más páginas
      return undefined;
    },
    enabled: !!userId, // Solo ejecutar si hay userId
  });
};

export const useInfinitePublications = () => {
  return useInfiniteQuery({
    queryKey: ['infinitePublications'],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await listPublications({
        size: 12, // tamaño de página
        page: pageParam,
      });

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedItems = allPages.flatMap((p) => p.publications).length;
      if (loadedItems < lastPage.total) {
        return allPages.length + 1; // próxima página
      }
      return undefined; // no hay más
    },
  });
};

export const useCreatePublication = () => {
  return useMutation({
    mutationKey: ['createPublication'],
    mutationFn: async (dataSend: CreatePublicationRequest) => {
      const data = await createPublication(dataSend);

      return data;
    },
  });
};

export const usePausePublication = () => {
  return useMutation({
    mutationKey: ['pausePublication'],
    mutationFn: async (idPublication: string) => {
      const data = await pausePublication(idPublication);

      return data;
    },
  });
};

export const useActivatePublication = () => {
  return useMutation({
    mutationKey: ['activatePublication'],
    mutationFn: async (idPublication: string) => {
      const data = await activatePublication(idPublication);

      return data;
    },
  });
};

export const useDeletePublication = () => {
  return useMutation({
    mutationKey: ['deletePublication'],
    mutationFn: async (idPublication: string) => {
      const data = await deletePublication(idPublication);

      return data;
    },
  });
};

export const useEditPublication = () => {
  return useMutation({
    mutationKey: ['editPublication'],
    mutationFn: async (dataSend: EditPublicationRequest) => {
      const data = await editPublication(dataSend);

      return data;
    },
  });
};

export const useGetPublicationById = (id: string) => {
  return useQuery({
    queryKey: ['getPublicationById', id],
    queryFn: async () => {
      const data = await getPublicationById(id);
      return data;
    },
    enabled: !!id, // Solo ejecutar si hay id
  });
};
