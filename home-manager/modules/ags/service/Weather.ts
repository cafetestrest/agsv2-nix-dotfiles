import { Variable } from "astal";

export const weather = Variable<any | null>(null).poll(
	600_000,
	"openweathermap",
	(out, prev) => {
		return JSON.parse(out);
	},
);
