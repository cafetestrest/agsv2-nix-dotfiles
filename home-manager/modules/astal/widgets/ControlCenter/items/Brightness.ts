import icons from 'lib/icons';
import brightness from 'services/brightness';
import { Overflow } from 'types/@girs/gtk-4.0/gtk-4.0.cjs';

export default () =>
	Widget.Overlay({
		cssClasses: ['control-center__brightness-slider'],
		overflow: Overflow.HIDDEN,
		child: Widget.Slider({
			hexpand: true,
			min: 0,
			max: 1,
			value: 0.5,
			on_change: ({ value }) => (brightness.screen = value),
			setup: (self) => {
				self.value = brightness.screen;
				self.hook(brightness, () => {
					self.value = brightness.screen;
				});
			},
		}),
		overlay: Widget.Icon({ icon: icons.brightness.screen, hexpand: false, hpack: 'start' }),
	});
