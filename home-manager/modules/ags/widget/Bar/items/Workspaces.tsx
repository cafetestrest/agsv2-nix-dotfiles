import { Gtk, Widget } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
// import { range } from "../../../lib/utils";
// import BarItem from "../BarItem";
// import { bind } from "astal";

export default () => {
	const hypr = Hyprland.get_default();
	const ws: number = 0;

	const focusWorkspace = (workspaceId: number) =>
		hypr.dispatch("workspace", workspaceId.toString());

// Adding `workspace-tile-focused` to focused worspace
const setupWorkspaceTile = (i: number) => (self: Widget.Button) => {
	self.hook(hypr, "event", () => {
		self.toggleClassName(
		"focused",
		i === hypr.focusedWorkspace.id
		);

		self.toggleClassName(
		"active",
		Boolean(hypr.get_workspace(i)?.clients.length)
		);
	});
	};
	return (
	<box
		className="bar__app-launcher.bar__button"
		setup={(self) => {
			if (ws === 0) {
				self.hook(hypr, "event", () => self.children.map(btn => {
					btn.visible = hypr.workspaces.some(ws => {
						if (ws.id < 10)
							return ws.id +1 >= btn.attribute

						return ws.id >= btn.attribute
					});
				}));
			}
		}}
	>
		{Array.from({ length: ws || 10 }, (_, i) => i + 1).map(i => (
		<button
			halign={Gtk.Align.CENTER}
			valign={Gtk.Align.CENTER}
			className="bar__workspaces-indicator"
			cursor="pointer"
			onClicked={() => hypr.dispatch("workspace", `${i}`)}
			setup={setupWorkspaceTile(i)}
			attribute={i}
		/>
		))}
	</box>
	);
};
