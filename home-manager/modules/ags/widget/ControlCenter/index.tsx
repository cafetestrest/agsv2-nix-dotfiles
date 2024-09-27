import { App, Astal, bind, Gdk, Gtk, Variable } from "astal";
import Main from "./pages/Main";
import Network from "./pages/Network";
import Bluetooth from "./pages/Bluetooth";
import Media from "./items/Media";
import { spacing } from "../../lib/variables";
import PopupWindow from "../../common/PopupWindow";
export const currentPage = Variable("main");

export default () => {
	const pageHeight = bind(currentPage).as((v) => {
		if (v != "main") {
			return "min-height: 500px";
		} else {
			return "min-height: 0px";
		}
	});

	return (
		<PopupWindow
			scrimType="transparent"
			visible={false}
			margin={12}
			vexpand={true}
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
						App.toggle_window(self.name);
					} else {
						currentPage.set("main");
					}
				}
			}}
		>
			<box className="control-center" vertical spacing={spacing}>
				<box className="control-center__container" css={pageHeight}>
					<stack
						shown={bind(currentPage)}
						transitionType={
							Gtk.StackTransitionType.SLIDE_LEFT_RIGHT
						}
						transitionDuration={200}
					>
						<Main />
						<Network />
						<Bluetooth />
					</stack>
				</box>
				<Media />
			</box>
		</PopupWindow>
	);
};
