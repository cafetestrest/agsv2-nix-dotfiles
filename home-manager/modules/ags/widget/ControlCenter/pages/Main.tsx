import { App, Gtk, Gdk, Widget } from "astal/gtk3";
import { bind, execAsync, timeout, Variable } from "astal";
import { spacing, uptime } from "../../../lib/variables";
import ControlCenterButton from "../ControlCenterButton";
import Bluetooth from "../items/Bluetooth";
import Network from "../items/Network";
import Volume from "../items/Volume";
import DND from "../items/DND";
import Microphone from "../items/Microphone";
import icons from "../../../lib/icons";
import Brightness from "../items/Brightness";
import FanProfile from "../items/FanProfile";
import ScreenRecord from "../items/ScreenRecord";
import ColorScheme from "../items/ColorScheme";
import ScreenRecordMenu from "../items/ScreenRecordMenu";

export default () => {
	const revealScreenRecord = Variable(false);

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
				<FanProfile />
				<Microphone />
			</box>
			<box spacing={spacing} homogeneous>
				<DND />
				<box spacing={spacing} homogeneous>
					<ScreenRecord
						onClicked={() => {
							revealScreenRecord.set(!revealScreenRecord.get());
						}}
					/>
					<ColorScheme />
				</box>
			</box>
			<ScreenRecordMenu
				revealMenu={bind(revealScreenRecord)}
				closeMenu={() =>
					revealScreenRecord.set(!revealScreenRecord.get())
				}
			/>
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
