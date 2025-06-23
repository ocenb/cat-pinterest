import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

type Tab = 'all' | 'likes';

export const TabButton = ({
	isActive,
	tab
}: {
	isActive: boolean;
	tab: Tab;
}) => {
	const navigate = useNavigate();
	const handleTabChange = () => {
		navigate(tab === 'likes' ? '/likes' : '/');
	};

	return (
		<button
			onClick={handleTabChange}
			className={cn(
				'h-full px-6 text-sm text-center font-medium transition-colors duration-200',
				{
					'bg-primary-600 text-white': isActive,
					'text-white/70 hover:text-white': !isActive
				}
			)}
		>
			{tab === 'all' ? 'Все коты' : 'Любимые коты'}
		</button>
	);
};
