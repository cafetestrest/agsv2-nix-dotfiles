import icons from 'lib/icons';
import ControlCenterButton from '../ControlCenterButton';

const bluetooth = await Service.import('bluetooth');
export default () =>
	ControlCenterButton({
		name: 'bluetooth',
		label: bluetooth.bind('connected_devices').as((devices) => {
			if (devices[0]) {
				return devices[0].name;
			} else {
				return 'Bluetooth';
			}
		}),
		icon: bluetooth
			.bind('enabled')
			.transform((p) => icons.bluetooth[p ? 'enabled' : 'disabled']),
		connection: [bluetooth, () => bluetooth.enabled],
		onPrimaryClick: () => (bluetooth.enabled = !bluetooth.enabled),
		onSecondaryClick: () => {
			App.toggleWindow('popup-bluetooth');
		},
	});
