import Bluetooth from './items/Bluetooth';
import Brightness from './items/Brightness';
import DND from './items/DND';
import Media from './items/Media';
import Microphone from './items/Microphone';
import Network from './items/Network';
import Volume from './items/Volume';
import icons from 'lib/icons';
import { uptime } from 'lib/variables';
import PowerProfile from './items/PowerProfile';

export default () =>
	Widget.Window({
		name: `control-center`,
		anchor: ['top', 'right'],
		exclusivity: 'normal',
		layer: 'overlay',
		hexpand: true,
		visible: false,
		keymode: 'exclusive',
		on_key_pressed(_self, key, _controller) {
			if (key.code == 9) {
				App.toggleWindow('control-center');
			}
		},
		child: Widget.Box({
			vertical: true,
			cssClasses: ['control-center'],
			spacing: 8,
			children: [
				Widget.FlowBox({
					homogeneous: true,
					cssClasses: ['control-center__buttons'],
					selectionMode: 0,
					columnSpacing: 8,
					rowSpacing: 8,
					maxChildrenPerLine: 2,
					setup: (self) => {
						self.append(Network());
						self.append(Bluetooth());
						self.append(Microphone());
						self.append(DND());
						self.append(PowerProfile());
					},
				}),
				Volume(),
				Brightness(),
				Widget.Box({
					spacing: 16,
					children: [
						Widget.Button({
							cssClasses: ['control-center__powermenu-button'],
							child: Widget.Icon({
								icon: icons.powermenu.shutdown,
								pixelSize: 16,
							}),
							onPrimaryClick: () => App.toggleWindow('powermenu'),
						}),
						Widget.Separator({ hexpand: true }),
						Widget.Label({
							cssClasses: ['control-center__uptime'],
							label: uptime.bind('value').as((time) => {
								var date = new Date(0);
								date.setSeconds(time); // specify value for SECONDS here
								return 'uptime - ' + date.toISOString().substring(11, 16);
							}),
						}),
						Widget.Button({
							cssClasses: ['control-center__settings-button'],
							child: Widget.Icon({
								icon: icons.settings,
								pixelSize: 16,
							}),
							onPrimaryClick: () => {
								App.toggleWindow('settings');
								App.toggleWindow('transparent-scrim');
							},
							// Utils.execAsync([
							// 	'hyprctl',
							// 	'dispatch',
							// 	'exec',
							// 	'zsh -c /home/posaydone/.config/astal/bin/randomWallpaper',
							// ]),
						}),
					],
				}),
				Media(),
			],
		}),
	});
