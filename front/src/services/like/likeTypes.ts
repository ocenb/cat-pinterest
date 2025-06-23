export interface AddLikeDto {
	cat_id: string;
}

export interface Like {
	cat_id: string;
	created_at: string;
}

export interface LikesList {
	data: Like[];
}
