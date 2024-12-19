import { Variable } from "astal";

export const weather = Variable<any | null>(null).poll(
	600_000,
	"ping 1.1.1.1", //todo replace
	(out, prev) => {
		return JSON.parse(out);
		// return JSON.parse(out);
		// return JSON.parse(JSON.stringify(data))
	},
);
