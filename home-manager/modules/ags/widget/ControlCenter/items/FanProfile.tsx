import ControlCenterButton from "../ControlCenterButton";
import FanProfiles, { profileName } from "../../../service/FanProfiles";
import { bind } from "astal";
import icons from "../../../lib/icons";

export default () => {
	const profile = bind(FanProfiles, "profile");
	return (
		<ControlCenterButton
			icon={profile.as((p) => icons.powerprofile[p])}
			label={profile.as((p) => profileName(p))}
			onPrimaryClick={() => {
				FanProfiles.nextProfile();
			}}
			menuName="profiles"
		/>
	);
};
