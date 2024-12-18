import { GLib, Variable } from "astal";
import BarButton from "../BarButton";
import { toggleWindow } from "../../../lib/utils";

export default () => {
	const format = '%a %b %e   %H:%M:%S';
	const time = Variable<string>("").poll(
		1000,
		() => GLib.DateTime.new_now_local().format(format)!,
	);
	return (
		<BarButton
			onClicked={() => {
				toggleWindow("dashboard");
			}}
		>
			<label
				className="Time"
				onDestroy={() => time.drop()}
				label={time()}
			/>
		</BarButton>
	);
};
