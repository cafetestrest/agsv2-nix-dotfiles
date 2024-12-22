import { Gtk, Widget, astalify, ConstructProps } from "astal/gtk3";
import { bind, execAsync, GObject, Variable } from "astal";
import { spacing, uptime } from "../../../lib/variables";
import NetworkButton from "../items/Network";
import Volume, { SinkButton, SinkRevealer } from "../items/Volume";
import DND from "../items/DND";
import Microphone from "../items/Microphone";
import icons from "../../../lib/icons";
// import Brightness from "../items/Brightness";
import FanProfileButton from "../items/FanProfile";
import ScreenRecord from "../items/ScreenRecord";
import ColorScheme from "../items/ColorScheme";
import ScreenRecordMenu from "../items/ScreenRecordMenu";
import ScreenRecordService from "../../../service/ScreenRecord";
import BluetoothButton from "../items/Bluetooth";
import { toggleWindow } from "../../../lib/utils";
import NightLight from "../items/NightLight";
import Idle from "../items/Idle";
import { Tooltip } from "../../Dashboard/weather";
import Media from "../items/Media";
import ControlCenterButton from "../ControlCenterButton";

// class FlowBox extends astalify(Gtk.FlowBox) {
// 	static {
// 		GObject.registerClass(this);
// 	}

// 	constructor(
// 		props: ConstructProps<Gtk.FlowBox, Gtk.FlowBox.ConstructorProps>,
// 	) {
// 		super(props as any);
// 	}
// }

export default () => {
	const revealScreenRecord = Variable(false);
	const revealFristPage = Variable(true);
	const revealSecondPage = Variable(false);

	// const fb = new FlowBox({
	// 	homogeneous: true,
	// 	selectionMode: Gtk.SelectionMode.NONE,
	// 	maxChildrenPerLine: 2,
	// 	minChildrenPerLine: 2,
	// 	rowSpacing: spacing,
	// 	columnSpacing: spacing,
	// });

	// const FanProfile = FanProfileButton();
	// const Network = NetworkButton();
	// const Bluetooth = BluetoothButton();

	// if (Network != undefined) {
	// 	fb.add(Network);
	// }
	// if (Bluetooth != undefined) {
	// 	fb.add(Bluetooth);
	// }


	// if (FanProfile != undefined) {
	// 	fb.add(FanProfile);
	// }
	// fb.add(Microphone());
	// fb.add(DND());
	// fb.add(
	// 	new Widget.Box({
	// 		spacing,
	// 		homogeneous: true,
	// 		children: [
	// 			ColorScheme(),
	// 			ScreenRecord({
	// 				onClicked: () => {
	// 					if (ScreenRecordService.recording) {
	// 						ScreenRecordService.stop();
	// 					} else {
	// 						revealScreenRecord.set(!revealScreenRecord.get());
	// 					}
	// 				},
	// 			}),
	// 		],
	// 	}),
	// );

	return (
		<box
			name="main"
			className="control-center__page main"
			vertical
			spacing={spacing}
		>
			{/* {fb} */}

			<revealer
				className={"page-revealer first-revealer"}
				revealChild={bind(revealFristPage)}
				visible={bind(revealFristPage)}
				transition_duration={300}
				transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
			>
				<box vertical>
					<box>
						<BluetoothButton />
						<box className={"control-center-space"} />
						<NightLight />
					</box>

					<box className={"control-center-box-space"} />

					<box>
						<Microphone />
						<box className={"control-center-space"} />
						<DND />
					</box>

					<box className={"control-center-box-space"} />

					<box>
						<Idle />
						<box className={"control-center-space"} />
						<ScreenRecord
							onClicked={() => {
								if (ScreenRecordService.recording) {
									ScreenRecordService.stop();
								} else {
									revealScreenRecord.set(!revealScreenRecord.get());
								}
							}}
						/>
					</box>

					<ScreenRecordMenu
						revealMenu={bind(revealScreenRecord)}
						closeMenu={() =>
							revealScreenRecord.set(!revealScreenRecord.get())
						}
					/>
				</box>
			</revealer>

			<revealer
				className={"page-revealer second-revealer"}
				revealChild={bind(revealSecondPage)}
				visible={bind(revealSecondPage)}
				transition_duration={300}
				transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
			>
				<box vertical>
					<box>
						<NetworkButton />
						<box className={"control-center-space"} />
						{/* {Brightness()} */}
						<ControlCenterButton
							className={"screenshot-button toggles"}
							icon={icons.screenshot}
							label={"Screenshot"}
							onClicked={() => {//TODO
								if (ScreenRecordService.recording) {
									ScreenRecordService.stop();
								} else {
									revealScreenRecord.set(!revealScreenRecord.get());
								}
							}}
							connection={[
								bind(ScreenRecordService, "recording"),
								() => ScreenRecordService.recording,
							]}
						/>
					</box>
				</box>
			</revealer>

			<box halign={Gtk.Align.CENTER} className={"control-center-page-indicators"}>
				<button
					className={bind(revealFristPage).as((r) => {
						if (r)
							return "control-center-page active"
						return "control-center-page"
					})}
					onClick={() =>{
						revealFristPage.set(true)
						revealSecondPage.set(false)
					}}
				>
					<box className={"page-dot"} />
				</button>
				<button
					className={bind(revealSecondPage).as((r) => {
						if (r)
							return "control-center-page active"
						return "control-center-page"
					})}
					onClick={() =>{
						revealFristPage.set(false)
						revealSecondPage.set(true)
					}}
				>
					<box className={"page-dot"} />
				</button>
			</box>

			<box className={"qsvolume-box"}>
				<Volume valign={Gtk.Align.CENTER}/>
				<box className={"control-center-space"} />
				<SinkButton />
			</box>
			<SinkRevealer />

			{/* <box spacing={16} className="control-center__footer">
				<button
					className="control-center__powermenu-button"
					onClick={() => toggleWindow("powermenu")}
				>
					<icon icon={icons.powermenu.shutdown} iconSize={16} />
				</button>
				<box hexpand />
				<label
					className="control-center__time-to-empty"
					label={bind(uptime)}
				/>
			</box> */}
			< Tooltip total={5} />
			<Media />
		</box>
	);
};
