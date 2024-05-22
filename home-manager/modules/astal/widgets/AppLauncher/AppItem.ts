import { icon, launchApp } from 'lib/utils';

export default (app) => {
	const title = Widget.Label({
		cssClasses: ['title'],
		label: app.name,
		xalign: 0,
		vpack: 'center',
		truncate: 'end',
	});

	const description = Widget.Label({
		cssClasses: ['description'],
		label: app.description || '',
		wrap: true,
		xalign: 0,
		truncate: 'end',
		justification: 'left',
	});

	const icon = Widget.Icon({
		icon: Utils.lookUpIcon(app.icon_name || '') ? app.icon_name || '' : '',
		pixelSize: 32,
	});

	const textBox = Widget.Box({
		vertical: true,
		vpack: 'center',
		children: app.description ? [title, description] : [title],
	});

	return Widget.Button({
		cssClasses: ['app-launcher__item'],
		attribute: app,
		child: Widget.Box({
			children: [icon, textBox],
		}),
		on_clicked: () => {
			App.closeWindow('app-launcher');
			launchApp(app);
		},
	});
};
