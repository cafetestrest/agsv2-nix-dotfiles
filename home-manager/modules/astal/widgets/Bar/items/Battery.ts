import BarItem from '../BarItem';

const battery = await Service.import('battery');
export default () =>
	BarItem({
		cssClasses: ['bar__battery'],
		children: [
			Widget.Icon({
				icon: battery.bind('icon_name'),
				setup: (self) =>
					self.hook(battery, () => {
						self.toggleCssClass('charging', battery.charging);
						self.toggleCssClass('charged', battery.charged);
						self.toggleCssClass('low', battery.percent < 30);
					}),
			}),
			Widget.Label({
				setup: (self) => {
					self.hook(battery, (self) => (self.label = `${battery.percent}%`));
				},
			}),
		],
	});
