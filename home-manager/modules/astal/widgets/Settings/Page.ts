import { Widget as WidgetType } from 'types/@girs/gtk-4.0/gtk-4.0.cjs';
import { BoxProps } from 'types/widgets/box';

type pageProps = BoxProps & {
	title: string;
	content: WidgetType;
};

export default ({ title, content, ...rest }: pageProps) =>
	Widget.Scrollable({
		cssClasses: ['settings__scrollable'],
		hexpand: true,
		child: Widget.Box({
			cssClasses: ['settings__page'],
			hexpand: true,
			vertical: true,
			children: [
				Widget.Label({
					hpack: 'start',
					cssClasses: ['settings__heading'],
					label: title,
				}),
				content,
			],
		}),
	});
