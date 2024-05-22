export type Action = 'sleep' | 'reboot' | 'logout' | 'shutdown';

class PowerMenu extends Service {
	static {
		Service.register(
			this,
			{},
			{
				title: ['string'],
				cmd: ['string'],
			},
		);
	}

	#title = '';
	#cmd = '';

	get title() {
		return this.#title;
	}
	get cmd() {
		return this.#cmd;
	}

	action(action: Action) {
		[this.#cmd, this.#title] = {
			sleep: ['systemctl suspend', 'Sleep'],
			reboot: ['systemctl reboot', 'Reboot'],
			logout: ['hyprctl dispatch exit', 'Log Out'],
			shutdown: ['shutdown now', 'Shutdown'],
		}[action];

		this.notify('cmd');
		this.notify('title');
		this.emit('changed');
		App.closeWindow('powermenu');
		App.openWindow('verification');
	}

	readonly shutdown = () => {
		this.action('shutdown');
	};
}

const powermenu = new PowerMenu();
Object.assign(globalThis, { powermenu });
export default powermenu;
