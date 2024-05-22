import { BoxProps } from 'types/widgets/box';

type BarItemProps = BoxProps & {
	cssClasses?: string[];
};

export default ({ cssClasses = [], ...rest }: BarItemProps = {}) => {
	return Widget.Box({
		cssClasses: ['bar__item', ...cssClasses],
		hexpand: false,
		...rest,
	});
};
