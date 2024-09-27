import { Gtk } from "astal";
import { ButtonProps } from "../../../../.local/share/ags/src/widgets";

export enum BarButtonStyle {
	transparent = "transparent",
	primary = "primary",
	primaryContainer = "primary_container",
}

type Props = ButtonProps & {
	buttonStyle?: BarButtonStyle;
	clickable?: boolean;
	child?: JSX.Element; // when only one child is passed
};

export default ({
	child,
	buttonStyle,
	clickable = false,
	className,
	onClicked,
}: Props) => {
	return (
		<button
			className={`bar__button ${buttonStyle} ${clickable && "clickable"} ${className}`}
			onClicked={onClicked}
			valign={Gtk.Align.CENTER}
		>
			{child}
		</button>
	);
};
