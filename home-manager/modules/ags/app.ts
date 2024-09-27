import { App, Gdk, Gtk } from "astal";
import style from "./style/main.scss";
import Bar from "./widget/Bar";
import ControlCenter from "./widget/ControlCenter";
import TransparentScrim from "./widget/Scrims/TransparentScrim"; // initialize
import NotificationsPopup from "./widget/Notifications/NotificationsPopup";
import AppLauncher from "./widget/AppLauncher";
import Notifications from "./widget/Notifications";
import OSD from "./widget/OSD";
import { monitorColorsChange, toggleWindow } from "./lib/utils";
import Scrim from "./widget/Scrims/Scrim";
import SinkMenu from "./widget/Popups/menus/Sink";
// import MixerMenu from "./widget/Popups/menus/Mixer";

function main() {
	const bars = new Map<Gdk.Monitor, Gtk.Widget>();
	const notifications = new Map<Gdk.Monitor, Gtk.Widget>();
	const osds = new Map<Gdk.Monitor, Gtk.Widget>();

	for (const gdkmonitor of App.get_monitors()) {
		bars.set(gdkmonitor, Bar(gdkmonitor));
		notifications.set(gdkmonitor, NotificationsPopup(gdkmonitor));
		osds.set(gdkmonitor, OSD(gdkmonitor));
	}

	App.connect("monitor-added", (_, gdkmonitor) => {
		bars.set(gdkmonitor, Bar(gdkmonitor));
		notifications.set(gdkmonitor, NotificationsPopup(gdkmonitor));
		osds.set(gdkmonitor, OSD(gdkmonitor));
	});

	App.connect("monitor-removed", (_, gdkmonitor) => {
		bars.get(gdkmonitor)?.destroy();
		notifications.get(gdkmonitor)?.destroy();
		osds.get(gdkmonitor)?.destroy();
		bars.delete(gdkmonitor);
		notifications.delete(gdkmonitor);
		osds.delete(gdkmonitor);
	});

	Notifications();
	ControlCenter();
	AppLauncher();
	Scrim();
	TransparentScrim();
	SinkMenu();

	monitorColorsChange();
}

App.start({
	css: style,
	main: main,
	requestHandler(request: string, res: (response: any) => void) {
		const args = request.split(" ");
		if (args[0] == "toggle") {
			toggleWindow(args[1]);
			res("ok");
		} else {
			res("unknown command");
		}
	},
});
