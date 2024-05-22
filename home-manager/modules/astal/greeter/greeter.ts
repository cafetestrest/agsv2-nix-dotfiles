import './session';
// import GLib from 'gi://GLib?version=2.0';
import RegularWindow from 'widgets/RegularWindow';
// import statusbar from './statusbar';
import auth from './auth';

const win = RegularWindow({
	name: 'greeter',
	setup: (self) => {
		self.set_default_size(500, 500);
		self.show();
		auth.attribute.password.grab_focus();
	},
	child: Widget.Overlay({
		child: Widget.Box({ hexpand: true }),
		overlays: [
			// Widget.Box({
			// 	vpack: 'start',
			// 	hpack: 'fill',
			// 	hexpand: true,
			// 	child: statusbar,
			// }),
			Widget.Box({
				vpack: 'center',
				hpack: 'center',
				child: auth,
			}),
		],
	}),
});

App.config({
	icons: './assets',
	windows: [win],
	// cursorTheme: GLib.getenv('XCURSOR_THEME')!,
});
