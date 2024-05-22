import ActiveApp from './items/ActiveApp';
import Clock from './items/Clock';
import Workspaces from './items/Workspaces';
import Weather from './items/Weather';
import KeyboardLayout from './items/KeyboardLayout';
import Battery from './items/Battery';
import SystemIndicators from './items/SystemIndicators';
import BarButton from './BarButton';

const Left = () =>
	Widget.Box({
		cssClasses: ['bar__left'],
		hpack: 'start',
		hexpand: true,
		spacing: 8,
		children: [
			BarButton({
				cssClasses: ['bar__app-launcher'],
				child: Widget.Box({
					cssClasses: ['bar__app-launcher_icon'],
					vpack: 'center',
					hpack: 'center',
					hexpand: true,
					vexpand: true,
				}),
				onClick: () => {
					App.toggleWindow('app-launcher');
				},
			}),
			Workspaces(),
			ActiveApp(),
			Weather(),
		],
	});

const Right = () =>
	Widget.Box({
		cssClasses: ['bar__right'],
		hpack: 'end',
		hexpand: true,
		spacing: 8,
		children: [SystemIndicators(), KeyboardLayout(), Battery()],
	});

export default (monitor: number) =>
	Widget.Window({
		name: `bar${monitor}`,
		anchor: ['top', 'left', 'right'],
		exclusivity: 'exclusive',
		layer: 'top',
		monitor,
		hexpand: true,
		child: Widget.CenterBox({
			cssClasses: ['bar'],
			startWidget: Left(),
			centerWidget: Clock(),
			endWidget: Right(),
		}),
	});
