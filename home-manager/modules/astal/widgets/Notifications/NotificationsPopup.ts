import Gtk from 'types/@girs/gtk-4.0/gtk-4.0';
import Notification from './Notification';

const notifications = await Service.import('notifications');
const transitionDuration = 300;

export default function (monitor) {
	const notificationPopups = new Map();
	const list = Widget.Box({
		spacing: 8,
		vertical: true,
		css: 'min-width: 450px;',
		cssClasses: ['notifications'],
		children: [],
		setup: (self) => self,
	});

	function onNotified(_, id: number) {
		const n = notifications.getNotification(id);
		if (n) {
			const wdgt = Widget.Revealer({
				vpack: 'start',
				attribute: { id },
				revealChild: false,
				child: Notification(n),
				transition: 'slide_down',
				transitionDuration: transitionDuration,
			});
			notificationPopups.set(id, wdgt);
			list.prepend(wdgt);
			wdgt.revealChild = true;

			// const wdgt = Notification(n);
			// notificationPopups.set(id, wdgt);
			// list.prepend(wdgt);
		}
	}

	function onDismissed(_, id: number) {
		let wdgt = notificationPopups.get(id);
		if (wdgt) {
			wdgt.revealChild = false;
			setTimeout(() => {
				list.remove(wdgt);
			}, transitionDuration);
		}

		// if (wdgt) {
		// 	list.remove(wdgt);
		// }
	}

	list.hook(notifications, onNotified, 'notified')
		.hook(notifications, onDismissed, 'dismissed')
		.hook(notifications, onDismissed, 'closed');

	return Widget.Window({
		vpack: 'start',
		layer: 'overlay',
		defaultHeight: 1,
		name: `notifications${monitor}`,
		anchor: ['top'],
		monitor,
		child: list,
	});
}
