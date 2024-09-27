import icons from "../../lib/icons";
import { currentPage } from "./index";
import { Widget, Gtk, bind } from "astal";

type PageProps = {
	label: string;
	child?: JSX.Element;
	refresh?: () => void;
};

export default ({ label, child, refresh = undefined }: PageProps) => {
	return (
		<box
			name={label.toLowerCase()}
			className={`control-center__page ${label.toLowerCase()}`}
			// css={pageHeight}
			vertical={true}
		>
			<centerbox
				className="control-center__page_header"
				spacing={12}
				startWidget={Widget.Button({
					hexpand: false,
					halign: Gtk.Align.START,
					className: "control-center__page_header_button",
					child: Widget.Icon({
						icon: icons.ui.arrow.left,
					}),
					onClicked: () => currentPage.set("main"),
				})}
				centerWidget={Widget.Label({
					className: "control-center__page_header_title",
					halign: Gtk.Align.CENTER,
					hexpand: true,
					label: label,
				})}
				setup={(self) => {
					if (refresh)
						self.end_widget = Widget.Button({
							halign: Gtk.Align.END,
							hexpand: false,
							className: "control-center__page_header_button",
							child: Widget.Icon({
								hexpand: false,
								icon: icons.ui.refresh,
							}),
							onClicked: () => refresh(),
						});
				}}
			/>
			<scrollable vexpand={true} className="control-center__page_content">
				{child}
			</scrollable>
		</box>
	);
};
