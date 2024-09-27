import Hyprland from "gi://AstalHyprland";
import { bind, Gtk } from "astal";
import BarButton from "../BarButton";
import icons, { substitutions } from "../../../lib/icons";
import { lookUpIcon } from "../../../lib/utils";
import { Revealer } from "../../../../../.local/share/ags/src/widgets";

export default () => {
	const hypr = Hyprland.get_default();
	const focused = bind(hypr, "focusedClient");

	var focusedWindow = {
		class: "",
		title: "",
	};

	return (
		<revealer
			transitionType={Gtk.RevealerTransitionType.CROSSFADE}
			transitionDuration={300}
			revealChild={focused.as(Boolean)}
		>
			<BarButton className="bar__active-app">
				{focused.as((client) =>
					client ? (
						<box spacing={8}>
							<icon
								icon={bind(client, "class").as((cls) =>
									substitutions.icons[cls]
										? substitutions.icons[cls]
										: lookUpIcon(cls)
											? cls
											: icons.fallback.executable,
								)}
							/>
							<label
								label={bind(client, "title").as(String)}
								truncate={true}
								maxWidthChars={24}
							/>
						</box>
					) : (
						<box />
					),
				)}
			</BarButton>
		</revealer>
	);
};
