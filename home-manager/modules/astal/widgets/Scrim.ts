export default () =>
	Widget.Window({
		name: 'scrim',
		layer: 'top',
		visible: false,
		keymode: 'none',
		cssClasses: ['scrim'],
		anchor: ['top', 'bottom', 'left', 'right'],
		onPrimaryClick: (self) => {
			self.visible = false;
		},
		setup: (self) => {
			self.hook(
				App,
				(_, windowName, visible) => {
					const active_windows = App.windows.filter(
						(window) =>
							(window.name?.includes('popup') ||
								window.name?.includes('verification') ||
								window.name?.includes('powermenu')) &&
							window.visible,
					);
					if (windowName == 'scrim' && !visible) {
						active_windows.forEach((window) => (window.visible = false));
					} else {
						self.visible = active_windows.length > 0;
					}
				},
				'window-toggled',
			);
		},
	});
