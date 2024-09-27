import { Gtk } from "astal";
import { BoxProps } from "astal/widgets";

export enum BarItemStyle {
	transparent = "transparent",
	primary = "primary",
	primaryContainer = "primary_container",
}

type Props = BoxProps & {
	buttonStyle?: BarItemStyle;
	child?: JSX.Element; // when only one child is passed
};

export default ({ child, buttonStyle, className, onClicked }: Props) => {
	return (
		<box
			className={`bar__button ${buttonStyle}  ${className}`}
			valign={Gtk.Align.CENTER}
		>
			{child}
		</box>
	);
};
