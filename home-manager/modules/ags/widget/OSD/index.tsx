import { Astal, bind, Gdk, Gtk, timeout, Widget } from "astal";
import Progress from "./Progress";
import AstalWp from "gi://AstalWp?version=0.1";
import icons from "../../lib/icons";
import Brightness from "../../service/Brightness";

const DELAY = 2500;

function OnScreenProgress(window: Astal.Window, vertical: boolean) {
	const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;

	const indicator = Widget.Icon({
		pixelSize: 20,
		valign: Gtk.Align.CENTER,
		icon: bind(speaker, "volumeIcon"),
	});

	const progress = Progress({
		vertical,
		width: vertical ? 48 : 400,
		height: vertical ? 400 : 48,
		child: indicator,
	});

	let count = 0;

	function show(value: number, icon: string) {
		window.visible = true;
		indicator.icon = icon;
		progress.setValue(value);
		count++;
		timeout(DELAY, () => {
			count--;
			if (count === 0) window.visible = false;
		});
	}

	return Widget.Box({
		className: "indicator",
		halign: Gtk.Align.CENTER,
		valign: Gtk.Align.END,
		css: "min-height: 2px;",
		child: progress,
		setup: (self) => {
			progress.setMute(speaker.mute);
			progress.hook(speaker, "notify::volume", () =>
				show(speaker.volume, icons.audio.type.speaker),
			);
			progress.hook(speaker, "notify::mute", () => {
				progress.setMute(speaker.mute);
			});
			progress.hook(Brightness, () =>
				show(Brightness.screen, icons.brightness.screen),
			);
		},
	});
}

export default (gdkmonitor: Gdk.Monitor) => (
	<window
		className="OSD"
		namespace="osd"
		gdkmonitor={gdkmonitor}
		layer={Astal.Layer.OVERLAY}
		anchor={Astal.WindowAnchor.BOTTOM}
		setup={(self) => {
			self.child = (
				<box className="osd" vertical={true}>
					{OnScreenProgress(self, false)}
				</box>
			);
		}}
	></window>
);
