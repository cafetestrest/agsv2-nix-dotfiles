import BarItem from '../BarItem';

const hyprland = await Service.import('hyprland');

function getLayout(layoutName: string) {
	if (layoutName.includes('English')) {
		return 'en';
	} else {
		return 'ru';
	}
}

export default () =>
	BarItem({
		cssClasses: ['bar__keyboard-layout'],
		child: Widget.Stack({
			transition: 'slide_up_down',
			children: { en: Widget.Label('en'), ru: Widget.Label('ru') },
			hpack: 'center',
			hexpand: true,
			setup: (self) =>
				self.hook(
					hyprland,
					(_, kbName, layoutName) => {
						if (!kbName) {
							return;
						}
						self.shown = getLayout(layoutName);
					},
					'keyboard-layout',
				),
		}),
	});
