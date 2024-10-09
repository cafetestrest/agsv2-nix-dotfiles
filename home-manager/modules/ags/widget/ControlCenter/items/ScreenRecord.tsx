import ControlCenterButton from "../ControlCenterButton";
import icons from "../../../lib/icons";

export default ({ onClicked }: { onClicked: () => void }) => {
	return (
		<ControlCenterButton icon={icons.record} onPrimaryClick={onClicked} />
	);
};
