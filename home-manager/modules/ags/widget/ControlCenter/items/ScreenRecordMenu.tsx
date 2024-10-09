import { Binding, Gtk, timeout } from "astal";
import icons from "../../../lib/icons";
import { spacing } from "../../../lib/variables";
import Button from "../../../common/Button";

export default ({
	revealMenu,
	closeMenu,
}: {
	revealMenu: Binding<boolean>;
	closeMenu: () => void;
}) => {
	return (
		<box
			vertical
			className={"control-center__dropdown-menu"}
			spacing={spacing * 2}
			visible={revealMenu}
		>
			<icon
				icon={icons.record}
				className={"control-center__dropdown-menu_icon"}
			/>
			<label
				label={"Start recording?"}
				className={"control-center__dropdown-menu_title"}
			/>
			<box
				hexpand
				className={"control-center__dropdown-menu_item"}
				spacing={spacing * 2}
			>
				<icon icon={icons.audio.mic.high} />
				<label label={"Record audio"} />
				<switch hexpand halign={Gtk.Align.END} />
			</box>
			<box
				hexpand
				className={"control-center__dropdown-menu_item"}
				spacing={spacing * 2}
			>
				<icon icon={icons.audio.type.speaker} />
				<label label={"Record internal audio"} />
				<switch hexpand halign={Gtk.Align.END} />
			</box>
			<box hexpand halign={Gtk.Align.END} spacing={spacing}>
				<Button buttonType="outlined" onClicked={closeMenu}>
					Cancel
				</Button>
				<Button>Start</Button>
			</box>
		</box>
	);
};