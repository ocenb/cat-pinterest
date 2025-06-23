import { LogoutButton } from './LogoutButton';
import { TabButton } from './TabButton';
import { CatCard } from '@/components/CatCard';
import { Loader2, CatIcon } from 'lucide-react';
import { useLikesQuery } from '@/hooks/useLikesQuery';

export const LikedCats = () => {
	return (
		<>
			<header className='bg-primary shadow-md shadow-black/30 w-full'>
				<nav className='flex h-16 container mx-auto'>
					<div className='flex h-full justify-between w-full'>
						<div className='flex h-full'>
							<TabButton isActive={false} tab='all'></TabButton>
							<TabButton isActive={true} tab='likes'></TabButton>
						</div>
						<LogoutButton />
					</div>
				</nav>
			</header>
			<main className='mt-12 container mx-auto'>
				<LikedCatsGrid />
			</main>
		</>
	);
};

const LikedCatsGrid = () => {
	const likesQuery = useLikesQuery();
	const likes = likesQuery.data;

	if (likesQuery.isLoading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<Loader2 className='animate-spin text-primary' size={40} />
			</div>
		);
	}

	if (likesQuery.isError) {
		return (
			<div className='flex justify-center items-center h-64'>
				<p className='text-destructive'>
					Ошибка при загрузке: {likesQuery.error!.message}
				</p>
			</div>
		);
	}

	if (!likes || likes.length === 0) {
		return (
			<div className='flex flex-col justify-center items-center h-64 text-center text-muted-foreground'>
				<CatIcon size={48} className='mb-4' />
				<h3 className='text-xl font-semibold'>Тут пока пусто</h3>
				<p>Добавляйте котиков в любимые, нажимая на сердечко.</p>
			</div>
		);
	}

	return (
		<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12'>
			{likes.map((like) => (
				<CatCard
					key={like.cat_id}
					cat={{
						id: like.cat_id,
						url: like.url!
					}}
				/>
			))}
		</div>
	);
};
