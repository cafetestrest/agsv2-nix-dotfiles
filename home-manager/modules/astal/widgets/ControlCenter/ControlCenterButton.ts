import GObject from 'types/@girs/gobject-2.0/gobject-2.0';
import { ButtonProps } from 'types/widgets/button';
import { IconProps } from 'types/widgets/icon';
import { LabelProps } from 'types/widgets/label';

type ControlCenterButtonProps = {
	label: LabelProps['label'];
	connection?: [GObject.Object, () => boolean];
	icon: IconProps['icon'];
} & ButtonProps;
export default ({ icon, label, connection, ...props }: ControlCenterButtonProps) =>
	Widget.Button({
		cssClasses: ['control-center__button'],
		child: Widget.Box({
			hexpand: true,
			hpack: 'start',
			spacing: 12,
			children: [Widget.Icon({ icon }), Widget.Label({ label })],
		}),
		setup: (self) => {
			if (connection) {
				let [service, condition] = connection;
				self.hook(service, () => {
					self.toggleCssClass('active', condition());
				});
			}
		},
		...props,
	});
