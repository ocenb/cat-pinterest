import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeService } from '@/services/like/likeService';
import { useLikesQuery } from '@/hooks/useLikesQuery';
import { CatImage } from '@/services/cat/catTypes';

export const CatCard = ({ cat }: { cat: CatImage }) => {
	const isMobile = useIsMobile();
	const queryClient = useQueryClient();

	const likesQuery = useLikesQuery();
	const likes = likesQuery.data;
	const isLiked = !!likes?.some(
		(like: { cat_id: string }) => like.cat_id === cat.id
	);

	const addLikeMutation = useMutation({
		mutationFn: () => likeService.add({ cat_id: cat.id }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['likes'] });
		}
	});

	const deleteLikeMutation = useMutation({
		mutationFn: () => likeService.delete(cat.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['likes'] });
		}
	});

	return (
		<div className='group relative aspect-square overflow-hidden bg-gray-200 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-black/50 hover:translate-y-1'>
			<img
				src={cat.url}
				alt='A cute cat'
				className='h-full w-full object-cover'
			/>

			<button
				onClick={() => {
					isLiked ? deleteLikeMutation.mutate() : addLikeMutation.mutate();
				}}
				className={cn(
					'absolute bottom-3 right-3 p-1 bg-transparent transition-all duration-300 opacity-100',
					{
						'opacity-0': !isMobile,
						'group-hover:opacity-100': !isMobile
					}
				)}
				aria-label={isLiked ? 'Remove from likes' : 'Add to likes'}
			>
				<Heart
					size={40}
					className={cn(
						'text-destructive transition-all hover:fill-current cursor-pointer',
						{
							'fill-current': isLiked
						}
					)}
				/>
			</button>
		</div>
	);
};
