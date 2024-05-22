import GLib from 'types/@girs/glib-2.0/glib-2.0';
import BarButton from '../BarButton';
import { clock } from 'lib/variables';

export default ({ format = '%a %d %b, %H:%M', interval = 1000, ...props } = {}) =>
	BarButton({
		cssClasses: ['bar__clock'],
		child: Widget.Label({
			label: clock.bind('value').as((date) => date.format(format) || '...'),
		}),
		onClick: () => App.toggleWindow('notifications-center'),
		setup: (self) =>
			self.hook(App, (_, win, visible) => {
				if (win === 'notifications-center') {
					self.toggleCssClass('active', visible);
				}
			}),
	});
