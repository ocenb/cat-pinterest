import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { authService } from '@/services/auth/authService';
import { FormProvider, useForm } from 'react-hook-form';
import { LoginDto, LoginSchema } from '@/services/auth/authTypes';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from './ui/form';

export const AuthForm: React.FC = () => {
	const navigate = useNavigate();

	const form = useForm<LoginDto>({
		resolver: zodResolver(LoginSchema),
		defaultValues: { login: '', password: '' },
		mode: 'onSubmit'
	});

	const loginMutation = useMutation({
		mutationFn: (data: LoginDto) => authService.login(data),
		onSuccess: (response) => {
			const token = response.headers['x-auth-token'];
			if (token) {
				localStorage.setItem('authToken', token);
			}
			navigate('/');
		},
		onError: (error: any) => {
			if (error.status !== 400) {
				toast(error.response.data.message);
			}
		}
	});

	function onSubmit(data: LoginDto) {
		loginMutation.mutate(data);
	}

	return (
		<main className='flex flex-col min-h-screen'>
			<div className='flex-grow flex items-center justify-center p-4'>
				<Card className='w-full max-w-[350px]'>
					<CardHeader>
						<CardTitle className='text-center'>Вход</CardTitle>
					</CardHeader>
					<CardContent>
						<FormProvider {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								noValidate
								className='space-y-4'
							>
								<FormField
									control={form.control}
									name='login'
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor='login'></FormLabel>
											<FormControl>
												<Input
													id='login'
													type='text'
													placeholder='Логин'
													required
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor='password'></FormLabel>
											<FormControl>
												<Input
													id='password'
													type='password'
													placeholder='Пароль'
													required
													{...field}
												/>
											</FormControl>
											<FormMessage></FormMessage>
										</FormItem>
									)}
								/>
								<Button type='submit' className='w-full'>
									{loginMutation.isPending ? 'Вход...' : 'Войти'}
								</Button>
							</form>
						</FormProvider>
					</CardContent>
				</Card>
			</div>
		</main>
	);
};
