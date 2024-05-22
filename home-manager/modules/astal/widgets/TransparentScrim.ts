export default () =>
	Widget.Window({
		name: 'transparent-scrim',
		layer: 'top',
		visible: false,
		keymode: 'none',
		cssClasses: ['transparent-scrim'],
		anchor: ['top', 'bottom', 'left', 'right'],
		onPrimaryClick: (self) => {
			self.visible = false;
		},
		setup: (self) => {
			self.hook(
				App,
				(_, windowName, visible) => {
					const windows = App.windows.filter(
						(window) =>
							(window.name?.includes('app-launcher') ||
								window.name?.includes('notifications-center') ||
								window.name?.includes('control-center')) &&
							window.visible,
					);
					if (windowName == 'transparent-scrim' && !visible) {
						windows.forEach((window) => {
							window.visible = false;
						});
					} else {
						self.visible = windows.length > 0;
					}
				},
				'window-toggled',
			);
		},
	});
