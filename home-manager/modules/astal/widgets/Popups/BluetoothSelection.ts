import icons from 'lib/icons';
import { BluetoothDevice } from 'types/service/bluetooth';
import PopupMenu from './PopupMenu';

const bluetooth = await Service.import('bluetooth');

const DeviceItem = (device: BluetoothDevice) =>
	Widget.Button({
		cssClasses: ['popup-menu__item'],
		on_clicked: () => device.setConnection(!device.connected),
		child: Widget.Box({
			children: [
				Widget.Icon(device.icon_name + '-symbolic'),
				Widget.Label(device.name),
				Widget.Label({
					cssClasses: ['bluetooth__percentage'],
					label: `${device.battery_percentage}%`,
					visible: device.bind('battery_percentage').transform((p) => p > 0),
				}),
				Widget.Box({ hexpand: true }),
				Widget.Spinner({
					visible: device.bind('connecting'),
				}),
				Widget.Icon({
					icon: icons.tick,
					visible: device.bind('connected'),
					setup: (self) =>
						self.hook(device, (self) => {
							if (device.connecting) {
								self.visible = false;
							} else if (device.connected) {
								self.visible = true;
							} else {
								self.visible = false;
							}
						}),
				}),
			],
		}),
	});

export default () =>
	PopupMenu({
		label: 'Bluetooth',
		content: Widget.Box({
			hexpand: true,
			vertical: true,
			children: bluetooth
				.bind('devices')
				.transform((ds) => ds.filter((d) => d.name).map(DeviceItem)),
		}),
	});
