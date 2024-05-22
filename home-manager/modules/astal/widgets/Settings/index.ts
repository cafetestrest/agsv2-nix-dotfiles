import RegularWindow from 'widgets/RegularWindow';
import Wallpapers from './items/Wallpapers';
import Page from './Page';

export default () =>
	RegularWindow({
		name: 'settings',
		cssClasses: ['settings'],
		title: 'Settings',
		visible: false,
		setup: (win) => {
			win.hideOnClose = true;
			win.set_default_size(500, 700);
		},
		child: Widget.Box({
			children: [
				Widget.Box({
					cssClasses: ['settings__sidebar'],
					vertical: true,
					vexpand: true,
					children: [
						Widget.Button({
							cssClasses: ['settings__sidebar_button'],
							child: Widget.Label({
								hpack: 'start',
								label: 'Wallpaper',
							}),
						}),
					],
				}),
				Page({
					title: 'Wallpaper',
					content: Wallpapers(),
				}),
			],
		}),
	});
