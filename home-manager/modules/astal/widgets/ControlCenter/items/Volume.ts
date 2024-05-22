import icons from 'lib/icons';
import { Overflow } from 'types/@girs/gtk-4.0/gtk-4.0.cjs';

const audio = await Service.import('audio');

type Type = 'microphone' | 'speaker';

const VolumeSlider = (type: Type = 'speaker') =>
	Widget.Overlay({
		cssClasses: ['control-center__volume-slider'],
		overflow: Overflow.HIDDEN,
		child: Widget.Slider({
			hexpand: true,
			on_change: ({ value }) => {
				audio[type].volume = value;
				audio[type].is_muted = false;
			},
			value: audio[type].bind('volume'),
		}),
		overlay: Widget.Icon({ icon: icons.audio.type.speaker, hexpand: false, hpack: 'start' }),
	});

export default () =>
	Widget.Box({
		children: [VolumeSlider('speaker')],
	});
