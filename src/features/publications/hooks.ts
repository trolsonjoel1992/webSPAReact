import {
  createPublication,
  listPublications,
} from '@features/publications/api';
import {
  CreatePublicationRequest,
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
