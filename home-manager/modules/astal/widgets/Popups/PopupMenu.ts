import Gtk from 'types/@girs/gtk-4.0/gtk-4.0';

type PopupMenuProps = {
	label: string;
	content: Gtk.Widget;
};

export default ({ label, content }: PopupMenuProps) => {
	const name = `popup-${label.toLowerCase()}`;
	return Widget.Window({
		name,
		layer: 'overlay',
		keymode: 'exclusive',
		visible: false,
		on_key_pressed(self, key, _controller) {
			if (key.code == 9 && self.name) {
				App.toggleWindow(self.name);
			}
		},
		child: Widget.Box({
			cssClasses: ['popup-menu', label.toLowerCase()],
			vertical: true,
			children: [
				Widget.Box({
					cssClasses: ['popup-menu__header'],
					spacing: 12,
					children: [
						Widget.Label({
							label: label,
						}),
					],
				}),
				Widget.Scrollable({
					vexpand: true,
					cssClasses: ['popup-menu__content'],
					child: content,
					setup: (self) => {
						self.hook(
							App,
							(_, windowName, visible) => {
								if (windowName == name && visible) self.grab_focus();
							},
							'window-toggled',
						);
					},
				}),
			],
		}),
		setup: (self) => {
			self.hook(
				App,
				(_, windowName, visible) => {
					if (windowName == self.name && visible) {
						const windows = App.windows.filter(
							(window) =>
								(window.name?.includes('popup') ||
									window.name?.includes('powermenu')) &&
								window.visible &&
								window.name != self.name,
						);
						windows.forEach((window) => {
							window.visible = false;
						});
					}
				},
				'window-toggled',
			);
		},
	});
};
