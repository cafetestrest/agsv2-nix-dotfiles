import AstalWp from "gi://AstalWp?version=0.1";
import { bind, Widget } from "astal";
import icons from "../../../lib/icons";
import Gtk from "gi://Gtk?version=3.0";
import Brightness from "../../../service/Brightness";

export default () => {
	return (
		<box>
			<overlay
				className={"control-center__volume-slider"}
				child={
					<slider
						draw_value={false}
						hexpand={true}
						onDragged={({ value }) => (Brightness.screen = value)}
						value={bind(Brightness).as((b) => b.screen)}
					/>
				}
				overlay={
					<icon
						className={"control-center__slider-icon"}
						icon={icons.brightness.screen}
						hexpand={false}
						halign={Gtk.Align.START}
					/>
				}
			/>
		</box>
	);
};
