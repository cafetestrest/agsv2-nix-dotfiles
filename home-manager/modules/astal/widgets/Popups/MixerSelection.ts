import icons from 'lib/icons';
import PopupMenu from './PopupMenu';
import { Stream } from 'types/service/audio';

const audio = await Service.import('audio');

const MixerItem = (stream: Stream) =>
	Widget.Box({
		hexpand: true,
		cssClasses: ['popup-menu__item', 'mixer__item'],
		spacing: 16,
		children: [
			Widget.Icon({
				cssClasses: ['mixer__tooltip'],
				tooltipText: stream.bind('name').transform((n) => n || ''),
				icon: stream.bind('name').as((n) => {
					return Utils.lookUpIcon(n || '') ? n || '' : icons.fallback.audio;
				}),
			}),
			Widget.Box({
				vertical: true,
				children: [
					Widget.Label({
						xalign: 0,
						truncate: 'end',
						label: stream.bind('description').transform((d) => d || ''),
					}),
					Widget.Slider({
						cssClasses: ['mixer__slider'],
						hexpand: true,
						drawValue: false,
						value: stream.bind('volume'),
						on_change: ({ value }) => (stream.volume = value),
					}),
				],
			}),
			Widget.Label({
				cssClasses: ['mixer__value'],
				xalign: 0.5,
				label: stream.bind('volume').transform((v) => `${Math.floor(v * 100)}%`),
			}),
		],
	});

export default () =>
	PopupMenu({
		label: 'Mixer',
		content: Widget.Box({
			vertical: true,
			children: audio.bind('apps').transform((a) => a.map(MixerItem)),
		}),
	});
