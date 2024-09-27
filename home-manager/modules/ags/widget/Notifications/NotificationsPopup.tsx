import Notification from "./Notification";
import Notifd from "gi://AstalNotifd";
import { Widget, timeout, idle, Gtk, Gdk } from "astal";
import Astal from "gi://Astal?version=0.1";

const notifications = Notifd.get_default();

const transitionDuration = 300;

function Animated(id: number) {
	const n = notifications.get_notification(id)!;
	const widget = Notification(n);

	const inner = Widget.Revealer({
		transitionType: Gtk.RevealerTransitionType.SLIDE_DOWN,
		transition_duration: transitionDuration,
		child: widget,
	});

	const outer = Widget.Revealer({
		transitionType: Gtk.RevealerTransitionType.SLIDE_UP,
		transition_duration: transitionDuration,
		child: inner,
	});

	const box = Widget.Box({
		child: outer,
	});

	idle(() => {
		outer.reveal_child = true;
		timeout(transitionDuration, () => {
			inner.reveal_child = true;
		});
	});

	return Object.assign(box, {
		dismiss() {
			inner.reveal_child = false;
			timeout(transitionDuration, () => {
				outer.reveal_child = false;
				timeout(transitionDuration, () => {
					box.destroy();
				});
			});
		},
	});
}

function PopupList() {
	const map: Map<number, ReturnType<typeof Animated>> = new Map();

	function remove(_: unknown, id: number, reason: Notifd.ClosedReason) {
		if (
			reason == Notifd.ClosedReason.EXPIRED ||
			reason == Notifd.ClosedReason.DISMISSED_BY_USER
		) {
			map.get(id)?.dismiss();
			map.delete(id);
		}
	}

	return (
		<box
			className="notifications-popup"
			spacing={8}
			vertical={true}
			setup={(self) => {
				self.hook(notifications, "resolved", remove);
				self.hook(notifications, "notified", (_, id: number) => {
					if (id !== undefined) {
						if (!map.has(id)) {
							if (notifications.dontDisturb) return;

							const w = Animated(id);
							map.set(id, w);
							self.children = [w, ...self.children];
						}
					}
				});
			}}
		/>
	);
}

export default (monitor: Gdk.Monitor) => (
	<window
		layer={Astal.Layer.OVERLAY}
		marginTop={20}
		className="NotificationsPopup"
		namespace="notifications-popup"
		anchor={Astal.WindowAnchor.TOP}
		gdkmonitor={monitor}
	>
		<PopupList />
	</window>
);
