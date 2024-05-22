import powerProfiles, { profileBinding } from 'services/powerProfiles';
import ControlCenterButton from '../ControlCenterButton';
import icons from 'lib/icons';

const profile = powerProfiles.bind('profile');

export default () =>
	ControlCenterButton({
		name: 'network',
		icon: profile.as((p) => icons.powerprofile[p]),
		label: profile
			.as((p) => profileBinding[p])
			.as((p) => p.charAt(0).toUpperCase() + p.slice(1)),
		onPrimaryClick: () => {
			powerProfiles.nextProfile();
		},
		onSecondaryClick: () => {
			App.toggleWindow('popup-profiles');
		},
	});
