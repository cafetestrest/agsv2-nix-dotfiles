import powermenu from 'services/powermenu';

export default () =>
	Widget.Window({
		name: 'verification',
		visible: false,
		layer: 'overlay',
		child: Widget.Box({
			cssClasses: ['verification'],
			spacing: 16,
			vertical: true,
			children: [
				Widget.Label({
					hpack: 'start',
					cssClasses: ['title'],
					label: powermenu.bind('title'),
				}),
				Widget.Label({
					cssClasses: ['desc'],
					label: 'Are you sure?',
				}),
				Widget.Box({
					vexpand: true,
					homogeneous: true,
					spacing: 8,
					children: [
						Widget.Button({
							cssClasses: ['verification__button'],
							child: Widget.Label('No'),
							on_clicked: () => App.toggleWindow('verification'),
						}),
						Widget.Button({
							cssClasses: ['verification__button'],
							child: Widget.Label('Yes'),
							on_clicked: () => {
								Utils.exec(powermenu.cmd);
								App.toggleWindow('verification');
							},
							setup: (self) =>
								self.hook(App, (_, name: string, visible: boolean) => {
									if (name === 'verification' && visible) self.grab_focus();
								}),
						}),
					],
				}),
			],
		}),
	});
