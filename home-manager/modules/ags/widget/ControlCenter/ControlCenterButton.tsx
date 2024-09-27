import { GObject, Gtk, Widget, Astal } from "astal";
import icons from "../../lib/icons";
import { Subscribable } from "../../../../.local/share/ags/src/binding";
import { currentPage } from ".";

type ControlCenterButtonProps = {
	icon: Widget.IconProps["icon"];
	label: Widget.LabelProps["label"];
	onPrimaryClick: () => void;
	menuName?: string;
	connection?: [Subscribable<unknown>, () => boolean];
} & Widget.ButtonProps;

export default ({
	icon,
	label,
	menuName,
	onPrimaryClick,
	connection,
	...props
}: ControlCenterButtonProps) => (
	<button
		className="control-center__button"
		setup={(self) => {
			if (connection) {
				let [service, condition] = connection;

				self.toggleClassName("active", condition());

				self.hook(service, () => {
					self.toggleClassName("active", condition());
				});
			}
		}}
		onClickRelease={(_, event: Astal.ClickEvent) => {
			if (event.button == 1) {
				onPrimaryClick();
			}
			if (event.button == 3) {
				if (menuName) currentPage.set(menuName);
			}
		}}
		{...props}
	>
		<box hexpand spacing={12}>
			<icon icon={icon} />
			<label label={label} halign={Gtk.Align.START} hexpand truncate />
			{menuName && (
				<box>
					<icon icon={icons.ui.arrow.right} />
				</box>
			)}
		</box>
	</button>
);
