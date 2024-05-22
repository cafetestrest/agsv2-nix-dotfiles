import icons from 'lib/icons';
import BarButton from '../BarButton';

const notifications = await Service.import('notifications');
const bluetooth = await Service.import('bluetooth');
const audio = await Service.import('audio');
const network = await Service.import('network');

const DNDIndicator = () =>
	Widget.Icon({
		visible: notifications.bind('dnd'),
		icon: icons.notifications.silent,
	});

const BluetoothIndicator = () =>
	Widget.Icon({
		cssClasses: ['bar__indicators_bluetooth'],
		icon: icons.bluetooth.enabled,
		visible: bluetooth.bind('enabled'),
	});

const NetworkIndicator = () =>
	Widget.Icon().hook(network, (self) => {
		const icon = network[network.primary || 'wifi']?.icon_name;
		self.icon = icon || '';
		self.visible = !!icon;
	});

const AudioIndicator = () =>
	Widget.Icon({
		icon: audio.speaker.bind('volume').as((vol) => {
			const { muted, low, medium, high, overamplified } = icons.audio.volume;
			const cons = [
				[101, overamplified],
				[67, high],
				[34, medium],
				[1, low],
				[0, muted],
			] as const;
			const icon = cons.find(([n]) => n <= vol * 100)?.[1] || '';
			return audio.speaker.is_muted ? muted : icon;
		}),
	});

export default () =>
	BarButton({
		cssClasses: ['bar__system-indicators'],
		child: Widget.Box({
			spacing: 10,
			children: [NetworkIndicator(), AudioIndicator(), BluetoothIndicator(), DNDIndicator()],
		}),
		on_primary_click: () => App.ToggleWindow('control-center'),
		setup: (self) =>
			self.hook(App, (_, win, visible) => {
				if (win === 'control-center') {
					self.toggleCssClass('active', visible);
				}
			}),
	});
