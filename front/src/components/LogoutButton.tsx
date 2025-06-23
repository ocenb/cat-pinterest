import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const LogoutButton = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const handleLogout = () => {
		localStorage.removeItem('authToken');
		queryClient.setQueryData(['likes'], {
			data: { data: [] }
		});
		navigate('/login');
	};

	return (
		<button
			onClick={handleLogout}
			className='h-full px-6 text-sm text-center font-medium transition-colors duration-200 text-white/70 hover:text-white'
		>
			Выход
		</button>
	);
};
