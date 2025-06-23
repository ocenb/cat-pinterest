import { useQuery, useQueries } from '@tanstack/react-query';
import { catService } from '@/services/cat/catService';
import { likeService } from '@/services/like/likeService';
import { useMemo } from 'react';

import { Like } from '@/services/like/likeTypes';
import { CatImage } from '@/services/cat/catTypes';

export const useLikesQuery = () => {
	const {
		data: likesData,
		isLoading: areLikesLoading,
		isError: likesError,
		error
	} = useQuery({
		queryKey: ['likes'],
		queryFn: async () => {
			const response = await likeService.getAll();
			return response.data.data as Like[];
		}
	});

	const likesWithCatDetailsQueries = useQueries({
		queries: (likesData ?? []).map((like) => {
			return {
				queryKey: ['cat', like.cat_id],
				queryFn: async () => {
					const response = await catService.getOneById(like.cat_id);
					return response.data as CatImage;
				},

				enabled: !!like.cat_id,

				staleTime: 5 * 60 * 1000
			};
		})
	});

	const combinedData = useMemo(() => {
		if (!likesData) return [];

		return likesData.map((like, index) => {
			const catDetailsQuery = likesWithCatDetailsQueries[index];
			return {
				...like,
				url: catDetailsQuery.data?.url,
				isCatImageLoading: catDetailsQuery.isLoading,
				catImageError: catDetailsQuery.error
			};
		});
	}, [likesData, likesWithCatDetailsQueries]);

	return {
		data: combinedData,
		isLoading:
			areLikesLoading || likesWithCatDetailsQueries.some((q) => q.isLoading),
		isError: likesError || likesWithCatDetailsQueries.some((q) => q.isError),
		error
	};
};
