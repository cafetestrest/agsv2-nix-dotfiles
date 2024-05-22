import { substitute } from 'lib/utils';
import BarItem from '../BarItem';
const hyprland = await Service.import('hyprland');

const substitutions = {
	icons: [
		['transmission-gtk', 'transmission'],
		['blueberry.py', 'bluetooth'],
		['Caprine', 'facebook-messenger'],
		['de.shorsh.discord-screenaudio', 'discord'],
		['org.pwmt.zathura', 'x-office-document'],
		['', 'preferences-desktop-display'],
		['code-url-handler', 'visual-studio-code'],
	],
	titles: [
		['com.github.Aylur.ags', 'AGS'],
		['transmission-gtk', 'Transmission'],
		['com.obsproject.Studio', 'OBS'],
		['com.usebottles.bottles', 'Bottles'],
		['com.github.wwmm.easyeffects', 'Easy Effects'],
		['org.gnome.TextEditor', 'Text Editor'],
		['org.gnome.design.IconLibrary', 'Icon Library'],
		['blueberry.py', 'Blueberry'],
		['org.wezfurlong.wezterm', 'Wezterm'],
		['com.raggesilver.BlackBox', 'BlackBox'],
		['firefox', 'Firefox'],
		['org.gnome.Nautilus', 'Files'],
		['libreoffice-writer', 'Writer'],
		['chromium-browser', 'Chromium'],
		['org.telegram.desktop', 'Telegram'],
		['de.shorsh.discord-screenaudio', 'Discord'],
		['org.pwmt.zathura', 'Zathura'],
		['kitty', 'Kitty'],
		['code-url-handler', 'VSCode'],
		['', 'Desktop'],
	],
};

export const ClientLabel = () =>
	Widget.Label({
		label: hyprland.active.client.bind('class').transform((c) => {
			const { titles } = substitutions;
			return substitute(titles, c);
		}),
	});

export const ClientIcon = () =>
	Widget.Icon({
		setup: (self) =>
			self.hook(hyprland.active.client, () => {
				const { icons } = substitutions;
				const { client } = hyprland.active;

				const classIcon = substitute(icons, client.class) + '-symbolic';
				const titleIcon = substitute(icons, client.class) + '-symbolic';

				const hasTitleIcon = Utils.lookUpIcon(titleIcon);
				const hasClassIcon = Utils.lookUpIcon(classIcon);

				if (hasClassIcon) self.icon = classIcon;

				if (hasTitleIcon) self.icon = titleIcon;

				self.visible = !!(hasTitleIcon || hasClassIcon);
			}),
	});

export default () =>
	BarItem({
		cssClasses: ['bar__active-app'],
		children: [ClientIcon(), ClientLabel()],
		spacing: 8,
	});
