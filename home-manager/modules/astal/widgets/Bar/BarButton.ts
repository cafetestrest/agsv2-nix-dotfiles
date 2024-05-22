import { ButtonProps } from 'types/widgets/button';

type BarButtonProps = ButtonProps & {
	cssClasses?: string[];
};

export default ({ cssClasses = [], ...rest }: BarButtonProps) => {
	return Widget.Button({
		cssClasses: ['bar__item', 'bar__button', ...cssClasses],
		...rest,
	});
};
