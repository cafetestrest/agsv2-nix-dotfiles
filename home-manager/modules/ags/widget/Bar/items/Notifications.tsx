import { App, Astal, bind, Gtk, timeout } from "astal";
import BarButton from "../BarButton";
import Notifications from "gi://AstalNotifd";
import { toggleWindow } from "../../../lib/utils";

export default () => {
	const notifications = Notifications.get_default();

	return (
		<revealer
			visible={notifications.get_notifications().length > 0}
			revealChild={notifications.get_notifications().length > 0}
			transitionDuration={300}
			transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
			setup={(self) => {
				self.hook(notifications, "notify::notifications", () => {
					if (notifications.get_notifications().length > 0) {
						self.visible = true;
						self.reveal_child = true;
					} else {
						self.reveal_child = false;
						setTimeout(() => {
							self.visible = false;
						}, 300);
					}
				});
			}}
		>
			<BarButton
				className={"bar__notifications"}
				onClicked={() => {
					toggleWindow("notifications");
				}}
			>
				<label
					valign={Gtk.Align.CENTER}
					className="bar__notifications_label"
					label={bind(notifications, "notifications").as((n) =>
						n.length.toString(),
					)}
				/>
			</BarButton>
		</revealer>
	);
};
