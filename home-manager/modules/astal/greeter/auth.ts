import GLib from 'gi://GLib?version=2.0';
import icons from 'lib/icons';

const loggingin = Variable(false);

const CMD = GLib.getenv('ASZTAL_DM_CMD') || 'Hyprland';

const ENV =
	GLib.getenv('ASZTAL_DM_ENV') || 'WLR_NO_HARDWARE_CURSORS=1 _JAVA_AWT_WM_NONREPARENTING=1';

async function login(pw: string) {
	loggingin.value = true;
	const greetd = await Service.import('greetd');
	return greetd.login('vasya', pw, CMD, ENV.split(/\s+/)).catch((res) => {
		loggingin.value = false;
		response.label = res?.description || JSON.stringify(res);
		password.text = '';
		revealer.revealChild = true;
	});
}

const avatar = Widget.Box({
	cssClasses: ['avatar'],
	hpack: 'center',
	// css: `background-image: url('${iconFile}')`,
});

const password = Widget.Entry({
	placeholderText: 'Password',
	hexpand: true,
	visibility: false,
	on_accept: ({ text }) => {
		login(text || '');
	},
});

const response = Widget.Label({
	cssClasses: ['response'],
	wrap: true,
	maxWidthChars: 35,
	hpack: 'center',
	hexpand: true,
	xalign: 0.5,
});

const revealer = Widget.Revealer({
	transition: 'slide_down',
	child: response,
});

export default Widget.Box({
	cssClasses: ['auth'],
	attribute: { password },
	vertical: true,
	children: [
		Widget.Overlay({
			child: Widget.Box(
				{
					css: 'min-width: 200px; min-height: 200px;',
					vertical: true,
				},
				Widget.Box({
					cssClasses: ['wallpaper'],
					css: `background-image: url('${WALLPAPER}')`,
				}),
				Widget.Box({
					cssClasses: ['wallpaper-contrast'],
					vexpand: true,
				}),
			),
			overlay: Widget.Box(
				{
					vpack: 'end',
					vertical: true,
				},
				avatar,
				Widget.Box({
					hpack: 'center',
					children: [Widget.Icon(icons.ui.avatar), Widget.Label('vasya')],
				}),
				Widget.Box(
					{
						cssClasses: ['password'],
					},
					Widget.Spinner({
						visible: loggingin.bind(),
					}),
					Widget.Icon({
						visible: loggingin.bind().as((b) => !b),
						icon: icons.ui.lock,
					}),
					password,
				),
			),
		}),
		Widget.Box({ cssClasses: ['response-box'], child: revealer }),
	],
});
