import AstalNetwork from "gi://AstalNetwork?version=0.1";
import Page from "../Page";
import { bind, Gtk } from "astal";
import icons from "../../../lib/icons";

export default () => {
	const network = AstalNetwork.get_default();
	const { wifi } = AstalNetwork.get_default();

	return (
		<Page label={"Network"}>
			<box vertical spacing={8}>
				<eventbox
					onClickRelease={(_, event) => {
						if (event.button !== 1) return;
						if (network.wifi.enabled) {
							network.wifi.enabled = false;
						} else {
							network.wifi.enabled = true;
							network.wifi.scan();
						}
					}}
				>
					<box
						className="control-center__page_item-header"
						setup={(self) => {
							self.toggleClassName("active", wifi.enabled);
							self.hook(wifi, "notify::enabled", () => {
								self.toggleClassName("active", wifi.enabled);
							});
						}}
					>
						<icon icon={bind(wifi, "iconName")} />
						<label
							label={"Wi-Fi"}
							hexpand
							halign={Gtk.Align.START}
						/>
						<switch
							hexpand={false}
							halign={Gtk.Align.END}
							valign={Gtk.Align.CENTER}
							active={bind(wifi, "enabled")}
							onActivate={({ active }) =>
								(network.wifi.enabled = active)
							}
						/>
					</box>
				</eventbox>
				<box vertical spacing={4}>
					{bind(wifi, "accessPoints").as((points) =>
						points.map((ap) => (
							<button
								className="control-center__page_item"
								on_clicked={() => {
									wifi.connect(ap.ssid, () => {});
								}}
							>
								<box>
									<icon icon={ap.iconName} iconSize={20} />
									<label label={ap.ssid || ""} />
									<icon
										visible={bind(
											wifi,
											"activeAccessPoint",
										).as((aap) => aap === ap)}
										icon={icons.ui.tick}
										hexpand
										halign={Gtk.Align.END}
									/>
								</box>
							</button>
						)),
					)}
				</box>
			</box>
		</Page>
	);
};
