import icons from 'lib/icons';
import { ButtonProps } from 'types/widgets/button';
import powermenu, { type Action } from 'services/powermenu';

type PowermenuButtonProps = {
	action: Action;
} & ButtonProps;

const PowermenuButton = ({ action, iconName, onClick, ...props }: PowermenuButtonProps) =>
	Widget.Button({
		on_clicked: () => powermenu.action(action),
		cssClasses: ['powermenu__button'],
		iconName: iconName,
		onClick,
		...props,
	});

export default () =>
	Widget.Window({
		name: 'powermenu',
		layer: 'overlay',
		visible: false,
		keymode: 'exclusive',
		on_key_pressed(_self, key, _controller) {
			if (key.code == 9) {
				App.toggleWindow('powermenu');
			}
		},
		setup: (self) =>
			self.hook(
				App,
				(_, windowName, visible) => {
					if (windowName == self.name && visible) {
						const windows = App.windows.filter(
							(window) =>
								(window.name?.includes('popup') ||
									window.name?.includes('powermenu')) &&
								window.visible &&
								window.name != self.name,
						);
						windows.forEach((window) => {
							window.visible = false;
						});
					}
				},
				'window-toggled',
			),
		child: Widget.FlowBox({
			cssClasses: ['powermenu'],
			homogeneous: true,
			minChildrenPerLine: 2,
			maxChildrenPerLine: 2,
			rowSpacing: 24,
			columnSpacing: 24,
			setup: (self) => {
				self.append(
					PowermenuButton({
						action: 'shutdown',
						iconName: icons.powermenu.shutdown,
						onClick: () => {},
					}),
				);
				self.append(
					PowermenuButton({
						action: 'reboot',
						iconName: icons.powermenu.reboot,
						onClick: () => {},
					}),
				);
				self.append(
					PowermenuButton({
						action: 'sleep',
						iconName: icons.powermenu.sleep,
						onClick: () => {},
					}),
				);
				self.append(
					PowermenuButton({
						action: 'logout',
						iconName: icons.powermenu.logout,
						onClick: () => {},
					}),
				);
			},
		}),
	});
