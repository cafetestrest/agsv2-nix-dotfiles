import icons from 'lib/icons';
import PopupMenu from './PopupMenu';
const network = await Service.import('network');

export default () =>
	PopupMenu({
		label: 'Network',
		content: Widget.Box({
			vertical: true,
			setup: (self) => {
				network.wifi.scan();
				self.hook(
					network,
					() =>
						(self.children = network.wifi?.access_points.map((ap) =>
							Widget.Button({
								cssClasses: ['popup-menu__item'],
								on_clicked: () =>
									Utils.execAsync(`nmcli device wifi connect ${ap.bssid}`),
								child: Widget.Box({
									children: [
										Widget.Icon({ icon: ap.iconName, pixelSize: 20 }),
										Widget.Label({ label: ap.ssid || '' }),
										Widget.Icon({
											icon: icons.tick,
											hexpand: true,
											hpack: 'end',
											setup: (self) =>
												Utils.idle(() => {
													if (!self.is_destroyed)
														self.visible = ap.active;
												}),
										}),
									],
								}),
							}),
						)),
				);
			},
		}),
	});
