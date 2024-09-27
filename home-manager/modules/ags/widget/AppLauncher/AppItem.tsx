import { App, Gtk, Widget } from "astal";
import AstalApps from "gi://AstalApps?version=0.1";

export default (app: AstalApps.Application) => {
	const title = Widget.Label({
		className: "title",
		label: app.name,
		xalign: 0,
		valign: Gtk.Align.CENTER,
		truncate: true,
	});

	const description = Widget.Label({
		className: "description",
		label: app.description || "",
		wrap: true,
		xalign: 0,
		truncate: true,
	});

	const icon = Widget.Icon({
		icon: app.iconName || "",
	});

	const textBox = Widget.Box({
		vertical: true,
		valign: Gtk.Align.CENTER,
		children: app.description ? [title, description] : [title],
	});

	const AppItem = Widget.Button({
		className: "app-launcher__item",
		on_clicked: () => {
			App.toggle_window("app-launcher");
			app.launch();
		},
		setup: (self) => {
			self.add(
				Widget.Box({
					spacing: 8,
					children: [icon, textBox],
				}),
			);
		},
	});

	return Object.assign(AppItem, {
		app,
	});
};
