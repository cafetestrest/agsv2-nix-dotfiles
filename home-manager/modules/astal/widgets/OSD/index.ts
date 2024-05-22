import icons from 'lib/icons';
import brightness from 'services/brightness';
import Progress from './Progress';

const audio = await Service.import('audio');

const DELAY = 2500;

function OnScreenProgress(vertical: boolean) {
	const indicator = Widget.Icon({
		pixelSize: 24,
		vpack: 'center',
		css: 'margin-left: 12px;',
	});
	const progress = Progress({
		vertical,
		width: vertical ? 48 : 400,
		height: vertical ? 400 : 48,
		child: indicator,
	});

	const revealer = Widget.Revealer({
		transition: 'slide_up',
		child: progress,
	});

	let count = 0;

	function show(value: number, icon: string) {
		revealer.revealChild = true;
		indicator.icon = icon;
		progress.setValue(value);
		count++;
		Utils.timeout(DELAY, () => {
			count--;
			if (count === 0) revealer.revealChild = false;
		});
	}

	return Widget.Box({
		cssClasses: ['indicator'],
		hpack: 'center',
		vpack: 'end',
		css: 'min-height: 2px;',
		child: revealer
			.hook(
				brightness,
				() => show(brightness.screen, icons.brightness.screen),
				'notify::screen',
			)
			.hook(
				audio.speaker,
				() => show(audio.speaker.volume, icons.audio.type.speaker),
				'notify::volume',
			),
	});
}

export default (monitor: number) =>
	Widget.Window({
		monitor,
		name: `indicator${monitor}`,
		layer: 'overlay',
		anchor: ['bottom'],
		defaultHeight: 1,
		child: Widget.Box({
			cssClasses: ['osd'],
			vertical: true,
			children: [OnScreenProgress(false)],
		}),
	});
