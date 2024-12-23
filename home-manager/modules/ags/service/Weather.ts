import { Variable } from "astal";

export const weather = Variable<string | null>(null).poll(
	600_000,
	"openweathermap",
	(out, prev) => {
		return JSON.parse(out);
	},
);
