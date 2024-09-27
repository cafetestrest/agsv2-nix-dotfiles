import { bind, Gtk, Widget } from "astal";
import PopupMenu from "../PopupMenu";
import AstalWp from "gi://AstalWp?version=0.1";
import icons from "../../../lib/icons";
import { lookUpIcon } from "../../../lib/utils";

export default () => {
	const audio = AstalWp.get_default()?.audio!;

	const SinkItem = (device: AstalWp.Endpoint) => (
		<button
			className="popup-menu__item"
			hexpand={true}
			on_clicked={() => device.set_is_default(true)}
		>
			{Widget.Box({
				children: [
					Widget.Icon({
						icon: lookUpIcon(device.icon)
							? device.icon
							: icons.fallback.audio,
						tooltipText: device.icon,
					}),
					Widget.Label({
						label: (device.description || "")
							.split(" ")
							.slice(0, 4)
							.join(" "),
					}),
					Widget.Icon({
						icon: icons.ui.tick,
						hexpand: true,
						halign: Gtk.Align.END,
						visible: bind(device, "isDefault"),
					}),
				],
			})}
		</button>
	);

	return (
		<PopupMenu label="Sink">
			<box vertical>
				{bind(audio, "speakers").as((speaker) => speaker.map(SinkItem))}
			</box>
		</PopupMenu>
	);
};
