import { forMonitors, reloadCss } from 'lib/utils';
import AppLauncher from 'widgets/AppLauncher/index';
import Bar from 'widgets/Bar/index';
import ControlCenter from 'widgets/ControlCenter/index';
import OSD from 'widgets/OSD/index';
import TransparentScrim from 'widgets/TransparentScrim';
import BluetoothSelection from 'widgets/Popups/BluetoothSelection';
import Scrim from 'widgets/Scrim';
import SinkSelection from 'widgets/Popups/SinkSelection';
import WifiSelection from 'widgets/Popups/WifiSelection';
import MixerSelection from 'widgets/Popups/MixerSelection';
import PowerProfileSelection from 'widgets/Popups/PowerProfileSelection';
import Powermenu from 'widgets/Powermenu/index';
import Settings from 'widgets/Settings/index';
import Verification from 'widgets/Powermenu/Verification';
import NotificationCenter from 'widgets/Notifications/NotificationCenter';
import NotificationsPopup from 'widgets/Notifications/NotificationsPopup';

const notifications = await Service.import('notifications');
notifications.clearDelay = 100;

reloadCss();

App.config({
	windows: () => [
		...forMonitors(Bar),
		...forMonitors(NotificationsPopup),
		...forMonitors(OSD),
		ControlCenter(),
		AppLauncher(),
		NotificationCenter(),
		WifiSelection(),
		BluetoothSelection(),
		MixerSelection(),
		SinkSelection(),
		PowerProfileSelection(),
		Powermenu(),
		Scrim(),
		TransparentScrim(),
		Verification(),
		Settings(),
	],
	style: `${App.configDir}/style.css`,
});

// App.config
