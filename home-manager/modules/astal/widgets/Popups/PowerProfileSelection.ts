import PopupMenu from './PopupMenu';
import icons from 'lib/icons';
import powerProfiles, { FanProfile, profileBinding } from 'services/powerProfiles';

const profileName = (profile: FanProfile) => {
	const profileName = profileBinding[profile];
	return profileName.charAt(0).toUpperCase() + profileName.slice(1);
};

const PowerProfileItem = (profile: FanProfile) =>
	Widget.Button({
		cssClasses: ['popup-menu__item'],
		hexpand: true,
		on_clicked: () => powerProfiles.setProfile(profile),
		child: Widget.Box({
			children: [
				Widget.Icon({
					icon: icons.powerprofile[profile],
				}),
				Widget.Label(profileName(profile)),
				Widget.Icon({
					icon: icons.tick,
					hexpand: true,
					hpack: 'end',
					visible: powerProfiles.bind('profile').as((p) => p === profile),
				}),
			],
		}),
	});

export default () =>
	PopupMenu({
		label: 'Profiles',
		content: Widget.Box({
			vertical: true,
			children: powerProfiles
				.bind('profiles')
				.transform((profiles) => profiles.map(PowerProfileItem)),
		}),
	});
