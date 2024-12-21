import { App, Gtk, Astal, Widget } from "astal/gtk3";
import { bind, Variable } from "astal";
import AstalApps from "gi://AstalApps?version=0.1";
import AppItem from "./AppItem";
import PopupWindow from "../../common/PopupWindow";
import icons from "../../lib/icons";

const apps = new AstalApps.Apps();

const query = Variable<string>("");

export default () => {
	const items = query((query) =>
		apps
			.fuzzy_query(query)
			.map((app: AstalApps.Application) => AppItem(app)),
	);

	const Entry = new Widget.Entry({
		text: bind(query),
		canFocus: true,
		className: "app-launcher__input",
		onActivate: () => {
			items.get()[0]?.app.launch();
			App.toggle_window("app-launcher");
		},
		setup: (self) => {
			self.hook(self, "notify::text", () => {
				query.set(self.get_text());
			});
		},
	});

	return (
		<PopupWindow
			scrimType="transparent"
			visible={false}
			margin={12}
			vexpand={true}
			name="app-launcher"
			namespace="app-launcher"
			className="AppLauncher"
			keymode={Astal.Keymode.EXCLUSIVE}
			exclusivity={Astal.Exclusivity.NORMAL}
			layer={Astal.Layer.OVERLAY}
			application={App}
			onKeyPressEvent={(self, event) => {
				const [keyEvent, keyCode] = event.get_keycode();
				if (keyEvent && keyCode == 9) {
					App.toggle_window(self.name);
				}
			}}
			setup={(self) => {
				self.hook(self, "notify::visible", () => {
					if (!self.get_visible()) {
						query.set("");
					} else {
						Entry.grab_focus();
					}
				});
			}}
		>
			<box className="app-launcher" vertical>
				<box className="entry-box" >
					<icon
						icon={icons.apps.search}
						className="entry-icon"
						halign={Gtk.Align.CENTER}
						valign={Gtk.Align.CENTER}
					/>
					{Entry}
				</box>
				<scrollable vexpand className={"app-scroll-list"}>
					<box className="app-launcher__list" vertical>
						{items}
					</box>
				</scrollable>
			</box>
		</PopupWindow>
	);
};
