import { Stream } from 'types/service/audio';
import PopupMenu from './PopupMenu';
import icons from 'lib/icons';
import { icon } from 'lib/utils';

const audio = await Service.import('audio');

const SinkItem = (stream: Stream) =>
	Widget.Button({
		cssClasses: ['popup-menu__item'],
		hexpand: true,
		on_clicked: () => (audio.speaker = stream),
		child: Widget.Box({
			children: [
				Widget.Icon({
					icon: icon(stream.icon_name || '', icons.fallback.audio),
					tooltipText: stream.icon_name,
				}),
				Widget.Label((stream.description || '').split(' ').slice(0, 4).join(' ')),
				Widget.Icon({
					icon: icons.tick,
					hexpand: true,
					hpack: 'end',
					visible: audio.speaker.bind('stream').as((s) => s === stream.stream),
				}),
			],
		}),
	});

export default () =>
	PopupMenu({
		label: 'Sink',
		content: Widget.Box({
			vertical: true,
			children: audio.bind('speakers').transform((a) => a.map(SinkItem)),
		}),
	});
