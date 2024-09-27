import { App, bind, exec, execAsync, Gtk, Widget } from "astal";
import { spacing, uptime } from "../../../lib/variables";
import ControlCenterButton from "../ControlCenterButton";
import Bluetooth from "../items/Bluetooth";
import Network from "../items/Network";
import Volume from "../items/Volume";
import DND from "../items/DND";
import Microphone from "../items/Microphone";
import icons from "../../../lib/icons";
import Brightness from "../items/Brightness";

export default () => {
	return (
		<box
			name="main"
			className="control-center__page main"
			vertical
			spacing={spacing}
		>
			<box spacing={spacing} homogeneous>
				<Network />
				<Bluetooth />
			</box>
			<box spacing={spacing} homogeneous>
				<DND />
				<Microphone />
			</box>
			<Volume />
			<Brightness />
			<box spacing={16} className="control-center__footer">
				<button
					className="control-center__powermenu-button"
					onClick={() => App.toggle_window("powermenu")}
				>
					<icon icon={icons.powermenu.shutdown} iconSize={16} />
				</button>
				<box hexpand />
				<label
					className="control-center__time-to-empty"
					label={bind(uptime)}
				/>
				<button
					className="control-center__settings-button"
					onClick={() => {
						execAsync("bash -c hyprsettings");
					}}
				>
					<icon icon={icons.ui.settings} iconSize={16} />
				</button>
			</box>
		</box>
	);
};
