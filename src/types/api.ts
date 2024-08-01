export interface Name {
	title: string;
	first: string;
	last: string;
}

// Define the type for the street address
export interface Street {
	number: number;
	name: string;
}

// Define the type for coordinates
export interface Coordinates {
	latitude: string;
	longitude: string;
}

// Define the type for timezone
export interface Timezone {
	offset: string;
	description: string;
}

// Define the type for the full location information
export interface Location {
	street: Street;
	city: string;
	state: string;
	country: string;
	postcode: number;
	coordinates: Coordinates;
	timezone: Timezone;
}

// Define the type for login information
export interface Login {
	uuid: string;
	username: string;
	password: string;
	salt: string;
	md5: string;
	sha1: string;
	sha256: string;
}

// Define the type for date and age
export interface DateAndAge {
	date: string; // Assuming date is in ISO 8601 format
	age: number;
}

// Define the type for ID
export interface ID {
	name: string;
	value: string | null;
}

// Define the type for pictures
export interface Picture {
	large: string;
	medium: string;
	thumbnail: string;
}

// Define the type for user information
export interface User {
	gender: string;
	name: Name;
	location: Location;
	email: string;
	login: Login;
	dob: DateAndAge;
	registered: DateAndAge;
	phone: string;
	cell: string;
	id: ID;
	picture: Picture;
	nat: string; // Nationality abbreviation
}

// Define the type for API response information
export interface Info {
	seed: string;
	results: number;
	page: number;
	version: string;
}

// Define the type for the entire response from randomuser.me API
export interface RandomUserResponse {
	results: User[];
	info: Info;
}