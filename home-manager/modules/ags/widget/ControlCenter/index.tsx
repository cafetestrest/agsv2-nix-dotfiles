import { App, Gtk, Gdk, Widget, Astal } from "astal/gtk3";
import { bind, execAsync, timeout, Variable } from "astal";
import Main from "./pages/Main";
// import Network from "./pages/Network";
import Bluetooth from "./pages/Bluetooth";
import Media from "./items/Media";
import { spacing } from "../../lib/variables";
import PopupWindow from "../../common/PopupWindow";
import { toggleWindow } from "../../lib/utils";
import Network from "./pages/Network";
import FanProfiles from "./pages/FanProfiles";
export const currentPage = Variable("main");

export default () => {
	const pageHeight = bind(currentPage).as((v) => {
		if (v != "main") {
			return `
			min-height: 500px;
			`;
		} else {
			return `
			min-height: 0px;`;
		}
	});

	return (
		<PopupWindow
			valign={Gtk.Align.START}
			scrimType="transparent"
			visible={false}
			margin={12}
			name="control-center"
			namespace="control-center"
			className="ControlCenter"
			layer={Astal.Layer.OVERLAY}
			exclusivity={Astal.Exclusivity.NORMAL}
			keymode={Astal.Keymode.EXCLUSIVE}
			anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
			application={App}
			onKeyPressEvent={(self, event) => {
				const [keyEvent, keyCode] = event.get_keycode();
				if (keyEvent && keyCode == 9) {
					if (currentPage.get() == "main") {
						toggleWindow(self.name);
					} else {
						currentPage.set("main");
					}
				}
			}}
		>
			<box
				className="control-center"
				vertical
				spacing={spacing}
				valign={Gtk.Align.START}
			>
				<box
					className="control-center__container"
					css={pageHeight}
					valign={Gtk.Align.START}
				>
					<stack
						shown={bind(currentPage)}
						transitionType={
							Gtk.StackTransitionType.SLIDE_LEFT_RIGHT
						}
						transitionDuration={200}
						setup={(self) => {
							const NetworkWdgt = Network();
							if (NetworkWdgt) self.add(NetworkWdgt);
						}}
					>
						<Main />
                        <FanProfiles />
						<Bluetooth />
					</stack>
				</box>
				<Media />
			</box>
		</PopupWindow>
	);
};
