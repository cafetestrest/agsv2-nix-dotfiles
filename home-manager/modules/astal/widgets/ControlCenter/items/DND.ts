import icons from 'lib/icons';
import ControlCenterButton from '../ControlCenterButton';

const notifications = await Service.import('notifications');

export default () =>
	ControlCenterButton({
		label: 'Do not disturb',
		icon: notifications
			.bind('dnd')
			.transform((dnd) => icons.notifications[dnd ? 'silent' : 'noisy']),
		on_primary_click: () => (notifications.dnd = !notifications.dnd),
		connection: [notifications, () => notifications.dnd],
	});
