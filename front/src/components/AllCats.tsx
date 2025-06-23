import { LogoutButton } from './LogoutButton';
import { TabButton } from './TabButton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { CatCard } from '@/components/CatCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import { catService } from '@/services/cat/catService';

export const AllCats = () => {
	return (
		<>
			<header className='bg-primary shadow-md shadow-black/30 w-full'>
				<nav className='flex h-16 container mx-auto'>
					<div className='flex h-full justify-between w-full'>
						<div className='flex h-full'>
							<TabButton isActive={true} tab='all'></TabButton>
							<TabButton isActive={false} tab='likes'></TabButton>
						</div>
						<LogoutButton />
					</div>
				</nav>
			</header>
			<main className='mt-12 container mx-auto'>
				<AllCatsGrid />
			</main>
		</>
	);
};

const AllCatsGrid = () => {
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError
	} = useInfiniteQuery({
		queryKey: ['cats', 'all'],
		queryFn: ({ pageParam = 0 }) => catService.getMany(pageParam),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length ? allPages.length : undefined;
		}
	});

	const { lastElementRef } = useInfiniteScroll(
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	);

	const cats = data?.pages.flatMap((page) => page) ?? [];

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<p className='text-muted-foreground text-xl animate-pulse'>
					Загружаем котиков...
				</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className='flex justify-center items-center h-64'>
				<p className='text-destructive'>Ошибка при загрузке: {error.message}</p>
			</div>
		);
	}

	return (
		<div>
			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-12'>
				{cats.map((cat) => (
					<CatCard key={cat.id} cat={cat} />
				))}
			</div>
			<div
				ref={lastElementRef}
				className='flex justify-center items-center h-24'
			>
				{isFetchingNextPage && (
					<p className='text-muted-foreground animate-pulse'>
						... загружаем еще котиков ...
					</p>
				)}
				{!hasNextPage && cats.length > 0 && (
					<p className='text-muted-foreground'>Вы посмотрели всех котиков</p>
				)}
			</div>
		</div>
	);
};
