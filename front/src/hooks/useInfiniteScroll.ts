import { useRef, useCallback, useEffect } from 'react';

export const useInfiniteScroll = (
	callback: () => void,
	hasMore: boolean,
	isLoading: boolean
) => {
	const observer = useRef<IntersectionObserver | null>(null);

	const lastElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					callback();
				}
			});

			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore, callback]
	);

	useEffect(() => {
		return () => {
			if (observer.current) observer.current.disconnect();
		};
	}, []);

	return { lastElementRef };
};
