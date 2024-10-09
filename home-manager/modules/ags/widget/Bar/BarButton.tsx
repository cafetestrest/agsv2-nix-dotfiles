import { Gtk } from "astal";
import { ButtonProps } from "../../../../.local/share/ags/src/widgets";

export enum BarButtonStyle {
	transparent = "transparent",
	primary = "primary",
	primaryContainer = "primary_container",
}

type Props = ButtonProps & {
	buttonStyle?: BarButtonStyle;
	child?: JSX.Element; // when only one child is passed
};

export default ({
	child,
	buttonStyle,
	className,
	onClicked,
	...props
}: Props) => {
	return (
		<button
			className={`bar__item bar__button ${buttonStyle || ""} ${className}`}
			onClicked={onClicked}
			valign={Gtk.Align.CENTER}
			{...props}
		>
			{child}
		</button>
	);
};
