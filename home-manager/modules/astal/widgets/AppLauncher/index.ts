import icons from 'lib/icons';
import AppItem from './AppItem';
import { launchApp } from 'lib/utils';

const applications = await Service.import('applications');

const Applauncher = () => {
	const mkItems = () => [
		...applications.query('').flatMap((app) =>
			Widget.Revealer({
				setup: (w) => (w.attribute = { app, revealer: w }),
				child: Widget.Box({
					vertical: true,
					children: [AppItem(app)],
				}),
			}),
		),
	];

	let items = mkItems();

	const list = Widget.Box({
		cssClasses: ['app-launcher__list'],
		vertical: true,
		children: items,
	});

	const entry = Widget.Entry({
		cssClasses: ['app-launcher__input'],
		hexpand: true,
		primaryIconName: icons.apps.search,

		// set some text so on-change works the first time
		text: '-',
		on_accept: ({ text }) => {
			const list = applications.query(text || '');
			if (list[0]) {
				App.toggleWindow('app-launcher');
				launchApp(list[0]);
			}
		},
		on_change: ({ text }) =>
			items.map((item) => {
				if (item.attribute) {
					const { app, revealer } = item.attribute;
					revealer.reveal_child = app.match(text);
				}
			}),
	});

	return Widget.Box({
		cssClasses: ['app-launcher'],
		vertical: true,
		children: [
			entry,
			Widget.Scrollable({
				hscroll: 'never',
				vexpand: true,
				child: list,
			}),
		],
		setup: (self) =>
			self.hook(App, (_, win, visible) => {
				if (win !== 'app-launcher') return;

				entry.text = '-';
				entry.text = '';
				if (visible) {
					entry.grab_focus();
				}
			}),
	});
};

export default () =>
	Widget.Window({
		name: `app-launcher`,
		anchor: ['top', 'left'],
		exclusivity: 'normal',
		layer: 'overlay',
		hexpand: true,
		visible: false,
		keymode: 'exclusive',
		on_key_pressed(_self, key, _controller) {
			if (key.code == 9) {
				App.closeWindow('app-launcher');
			}
		},
		child: Applauncher(),
	});
