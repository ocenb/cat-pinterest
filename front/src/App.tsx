import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from '@/components/AuthForm';
import { AllCats } from '@/components/AllCats';
import { LikedCats } from '@/components/LikedCats';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const token = localStorage.getItem('authToken');
	return token ? <>{children}</> : <Navigate to='/login' replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
	const token = localStorage.getItem('authToken');
	return !token ? <>{children}</> : <Navigate to='/' replace />;
};

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route
						path='/login'
						element={
							<PublicRoute>
								<AuthForm />
							</PublicRoute>
						}
					/>
					<Route
						path='/'
						element={
							<ProtectedRoute>
								<AllCats />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/likes'
						element={
							<ProtectedRoute>
								<LikedCats />
							</ProtectedRoute>
						}
					/>
					<Route path='*' element={<Navigate to='/' replace />} />
				</Routes>
				<Toaster />
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
