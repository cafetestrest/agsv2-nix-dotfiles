import { bind } from "astal";
import Battery from "gi://AstalBattery";
import BarButton, { BarButtonStyle } from "../BarButton";

export default () => {
	const bat = Battery.get_default();

	return (
		<BarButton
			className="bar__battery"
			buttonStyle={BarButtonStyle.primaryContainer}
			visible={bind(bat, "isPresent")}
		>
			<box spacing={4}>
				<icon icon={bind(bat, "iconName")} />
				<label
					label={bind(bat, "percentage").as(
						(p) => `${Math.floor(p * 100)} %`,
					)}
				/>
			</box>
		</BarButton>
	);
};
