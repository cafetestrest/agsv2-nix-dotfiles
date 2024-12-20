import { bind } from "astal";
import icons from "../../../lib/icons";
import ScreenRecordService from "../../../service/ScreenRecord";
import ControlCenterButton from "../ControlCenterButton";

export default ({ onClicked }: { onClicked: () => void }) => {
	return (
		<ControlCenterButton
			className={"recorder-indicator toggles"}
			icon={icons.record}
			label={"Screen record"}
			onPrimaryClick={onClicked}
			connection={[
				bind(ScreenRecordService, "recording"),
				() => ScreenRecordService.recording,
			]}
		/>
	);
};
