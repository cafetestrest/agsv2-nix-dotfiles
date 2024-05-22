import { WEATHER_SYMBOL, weather } from 'lib/variables';
import BarButton from '../BarButton';

const wthr = weather.bind();

export default () =>
	BarButton({
		cssClasses: ['bar__weather'],
		child: Widget.Box({
			spacing: 8,
			children: [
				Widget.Label({
					label: wthr.as(
						(w) => `${w.current ? WEATHER_SYMBOL[w.current.condition.text] : '...'}`,
					),
				}),
				Widget.Label({
					label: wthr.as((w) => (w.current ? `${w.current.temp_c}°` : '')),
				}),
			],
		}),
	});
