import { type Notification as Notif } from 'types/service/notifications';
import Gtk from 'types/@girs/gtk-4.0/gtk-4.0';
import Notification from './Notification';
import icons from 'lib/icons';
import { WEATHER_SYMBOL, clock, weather } from 'lib/variables';

const notifications = await Service.import('notifications');
const notifs = notifications.bind('notifications');
const wthr = weather.bind();

// const hourlyForecast = wthr.forecast.forecastday[0].hour;
// const next4HoursForecast = hourlyForecast.filter(
// 	(hour) => hour.time_epoch >= currentTimeEpoch && hour.time_epoch <= currentTimeEpoch + 4 * 3600,
// );

const Animated = (n: Notif) =>
	Widget.Revealer({
		transitionDuration: 300,
		transition: 'slide_down',
		child: Notification(n),
		setup: (self) =>
			Utils.timeout(300, () => {
				if (!self.is_destroyed) self.revealChild = true;
			}),
	});

const NotificationList = () => {
	const map: Map<number, ReturnType<typeof Animated>> = new Map();
	const box = Widget.Box({
		spacing: 8,
		vertical: true,
		children: notifications.notifications.map((n) => {
			const w = Animated(n);
			map.set(n.id, w);
			return w;
		}),
		visible: notifs.as((n) => n.length > 0),
	});

	function remove(_: unknown, id: number) {
		const n = map.get(id);
		if (n) {
			n.revealChild = false;
			Utils.timeout(300, () => {
				box.remove(n);
				map.delete(id);
			});
		}
	}

	return box.hook(notifications, remove, 'closed').hook(
		notifications,
		(_, id: number) => {
			if (id !== undefined) {
				if (map.has(id)) remove(null, id);

				const n = notifications.getNotification(id)!;

				const w = Animated(n);
				map.set(id, w);
				box.children = [w, ...box.children];
			}
		},
		'notified',
	);
};

const Weather = () =>
	Widget.Box({
		cssClasses: ['notifications-center__weather', 'block'],
		vertical: true,
		children: [
			Widget.Box({
				cssClasses: ['notifications-center__weather_top'],
				hexpand: true,
				children: [
					Widget.Label({
						hpack: 'start',
						vpack: 'start',
						cssClasses: ['notifications-center__weather_icon'],
						label: wthr.as((w) => `${WEATHER_SYMBOL[w.current.condition.text]}`),
					}),
					Widget.Separator({
						hexpand: true,
					}),
					Widget.Box({
						vertical: true,
						hpack: 'end',
						spacing: 4,
						children: [
							Widget.Label({
								cssClasses: [
									'notifications-center__weather_country',
									'highlighted',
								],
								hpack: 'end',
								label: wthr.as((w) => `${w.location.country}`),
							}),
							Widget.Label({
								cssClasses: ['notifications-center__weather_city', 'highlighted'],
								hpack: 'end',
								label: wthr.as((w) => `${w.location.name}`),
							}),
						],
					}),
				],
			}),
			Widget.Box({
				cssClasses: ['notifications-center__weather_bottom'],
				hexpand: true,
				vpack: 'end',
				children: [
					Widget.Box({
						vertical: true,
						spacing: 8,
						children: [
							Widget.Label({
								cssClasses: ['notifications-center__weather_now', 'highlighted'],
								hpack: 'start',
								label: wthr.as((w) => `${w.current.temp_c}°`),
							}),
							Widget.Box({
								hpack: 'start',
								spacing: 8,
								cssClasses: ['notifications-center__weather_min-max'],
								children: [
									Widget.Label({
										cssClasses: [
											'notifications-center__weather_max',
											'highlighted',
										],
										label: wthr.as(
											(w) =>
												`${Math.round(
													w.forecast.forecastday[0].day.maxtemp_c,
												)}°`,
										),
									}),
									Widget.Label({
										cssClasses: ['notifications-center__weather_min'],
										label: wthr.as(
											(w) =>
												`${Math.round(
													w.forecast.forecastday[0].day.mintemp_c,
												)}°`,
										),
									}),
								],
							}),
						],
					}),
				],
			}),
		],
	});

const Placeholder = () =>
	Widget.Box({
		cssClasses: ['placeholder'],
		vertical: true,
		vpack: 'center',
		hpack: 'center',
		vexpand: true,
		hexpand: true,
		visible: notifs.as((n) => n.length === 0),
		spacing: 24,
		children: [
			Widget.Icon({ icon: icons.notifications.silent, pixelSize: 64 }),
			Widget.Label('Your inbox is empty'),
		],
	});

export default () =>
	Widget.Window({
		vpack: 'start',
		layer: 'overlay',
		exclusivity: 'normal',
		keymode: 'exclusive',
		name: `notifications-center`,
		visible: false,
		anchor: ['top'],
		on_key_pressed(_self, key, _controller) {
			if (key.code == 9) {
				App.toggleWindow('notifications-center');
			}
		},
		child: Widget.Box({
			cssClasses: ['notifications-center'],
			spacing: 14,
			children: [
				Widget.Box({
					cssClasses: ['notifications-center__left-column'],
					vertical: true,
					spacing: 14,
					setup: (self) => {
						self.hook(weather, () => {
							if (weather.value.current && self.children.length == 1) {
								self.children = [...self.children, Weather()];
							}
						});
					},
					children: [
						Widget.Box({
							cssClasses: ['notifications-center__calendar', 'block'],
							vertical: true,
							children: [
								Widget.Label({
									hpack: 'start',
									cssClasses: ['notifications-center__calendar_header'],
									label: clock
										.bind('value')
										.as((date) => date.format('%OB %Y') || '...'),
								}),
								Widget.Calendar({
									showHeading: false,
								}),
							],
						}),
					],
				}),
				Widget.Box({
					cssClasses: ['notifications-center__notificaitons', 'block'],
					vertical: true,
					spacing: 16,
					children: [
						Widget.Scrollable({
							vexpand: true,
							cssClasses: ['notifications-center__scrollable'],
							overflow: Gtk.Overflow.HIDDEN,
							vscroll: 'automatic',
							hscroll: 'never',
							child: Widget.Box({ children: [NotificationList(), Placeholder()] }),
						}),
						Widget.Button({
							cssClasses: ['notifications-center__clear'],
							onClick: () => notifications.clear(),
							child: Widget.Box({
								hpack: 'center',
								spacing: 8,
								children: [Widget.Icon(icons.trash.empty), Widget.Label('clear')],
							}),
						}),
					],
				}),
			],
		}),
	});
