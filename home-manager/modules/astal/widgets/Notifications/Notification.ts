import { type Notification } from 'types/service/notifications';
import GLib from 'gi://GLib';
import icons from 'lib/icons';

const time = (time: number, format = '%H:%M') =>
	GLib.DateTime.new_from_unix_local(time).format(format);

const NotificationIcon = ({ app_entry, app_icon, image }: Notification) => {
	if (image) {
		if (image.includes('file://')) image = image.replace('file://', '');
		return Widget.Box({
			vpack: 'start',
			hexpand: false,
			cssClasses: ['notification__icon'],
			css: `
                background-image: url("file://${image}");
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                min-width:  48px;
                min-height: 48px;
            `,
		});
	}

	let icon = icons.fallback.notification;
	if (Utils.lookUpIcon(app_icon)) icon = app_icon;

	if (Utils.lookUpIcon(app_entry || '')) icon = app_entry || '';

	return Widget.Box({
		vpack: 'start',
		hexpand: false,
		cssClasses: ['notification__icon'],
		child: Widget.Icon({
			icon,
			pixelSize: 48,
			hpack: 'center',
			hexpand: true,
			vpack: 'center',
		}),
	});
};

export default (notification: Notification) => {
	const content = Widget.Box({
		hexpand: true,
		cssClasses: ['content'],
		children: [
			NotificationIcon(notification),
			Widget.Box({
				hexpand: true,
				vertical: true,
				children: [
					Widget.Box({
						cssClasses: ['notification__header'],
						children: [
							Widget.Box({
								hexpand: true,
								spacing: 6,
								children: [
									Widget.Label({
										cssClasses: ['notification__title'],
										maxWidthChars: 10,
										wrap: true,
										justification: 'left',
										truncate: 'end',
										label: notification.summary.trim(),
										useMarkup: true,
									}),
									Widget.Label({
										cssClasses: ['notification__dot'],
										label: '•',
									}),
									Widget.Label({
										cssClasses: ['notification__app-name'],
										justification: 'left',
										truncate: 'end',
										wrap: true,
										label: notification.app_name.trim(),
										useMarkup: true,
									}),
									Widget.Label({
										cssClasses: ['notification__dot'],
										label: '•',
									}),
									Widget.Label({
										cssClasses: ['notification__time'],
										label: time(notification.time),
									}),
								],
							}),
						],
					}),
					Widget.Label({
						cssClasses: ['notification__description'],
						hexpand: true,
						useMarkup: true,
						xalign: 0,
						lines: 3,
						justification: 'left',
						truncate: 'end',
						label: notification.body.trim(),
						maxWidthChars: 24,
						wrap: true,
					}),
				],
			}),
			Widget.Button({
				vexpand: true,
				vpack: 'start',
				cssClasses: ['notification__close-button'],
				child: Widget.Icon('window-close-symbolic'),
				on_clicked: () => notification.close(),
			}),
		],
	});

	const actionsbox =
		notification.actions.length > 0
			? Widget.Revealer({
					transition: 'slide_down',
					child: Widget.Box({
						child: Widget.Box({
							cssClasses: ['notification__actions'],
							children: notification.actions.map((action) =>
								Widget.Button({
									cssClasses: ['notification__action'],
									on_clicked: () => notification.invoke(action.id),
									hexpand: true,
									child: Widget.Label(action.label),
								}),
							),
						}),
					}),
			  })
			: null;

	const eventbox = Widget.Box({
		vexpand: false,
		on_primary_click: notification.dismiss,
		on_hover_enter() {
			if (actionsbox) actionsbox.revealChild = true;
		},
		on_hover_leave() {
			if (actionsbox) actionsbox.revealChild = true;

			notification.dismiss();
		},
		child: Widget.Box({
			vertical: true,
			children: actionsbox ? [content, actionsbox] : [content],
		}),
	});

	return Widget.Box({
		vpack: 'start',
		cssClasses: ['notification', notification.urgency],
		attribute: { id: notification.id },
		child: eventbox,
	});
};
