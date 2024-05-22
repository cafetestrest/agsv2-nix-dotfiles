import ControlCenterButton from '../ControlCenterButton';

const { wifi } = await Service.import('network');

export default () =>
	ControlCenterButton({
		name: 'network',
		icon: wifi.bind('icon_name'),
		label: wifi.bind('ssid').as((ssid) => ssid || 'Not Connected'),
		connection: [wifi, () => wifi.enabled],
		on_primary_click: () => {
			if (wifi.enabled) {
				wifi.enabled = false;
			} else {
				wifi.enabled = true;
				wifi.scan();
			}
		},
		onSecondaryClick: () => {
			App.toggleWindow('popup-network');
		},
	});
