import GdkPixbuf from 'types/@girs/gdkpixbuf-2.0/gdkpixbuf-2.0';
import { themeFromPixbuf } from 'lib/utils';
import { hexFromArgb } from 'node_modules/@material/material-color-utilities/index';
import { MprisPlayer } from 'types/service/mpris';

const mpris = await Service.import('mpris');

class MaterialColors extends Service {
	static {
		Service.register(this, {
			'colors-changed': ['string'],
		});
	}

	#colors = new Map();
	#previousCoverPaths = new Map();
	#connections = new Map();

	get colors() {
		return this.#colors;
	}

	constructor() {
		super();

		mpris.connect('player-added', (_, busName) => {
			const player = mpris.getPlayer(busName);
			if (this.#connections.has(player)) return;
			if (player) {
				const id = player.connect('notify::cover-path', this.#onCoverChange.bind(this));
				this.#connections.set(player, id);
			}
		});

		mpris.connect('player-closed', (_, busName) => {
			const player = mpris.getPlayer(busName);
			if (!this.#connections.has(player)) return;
			if (player) {
				const id = this.#connections.get(player);
				player.disconnect(id);
				this.#connections.delete(player);
			}
		});
	}

	#setColors(player: MprisPlayer) {
		const pixbuf = GdkPixbuf.Pixbuf.new_from_file(player.cover_path);
		const theme = themeFromPixbuf(pixbuf);

		this.#colors.set(player.cover_path, {
			primary: hexFromArgb(theme.schemes.light.primary),
			onPrimary: hexFromArgb(theme.schemes.light.onPrimary),
			primaryContainer: hexFromArgb(theme.schemes.light.primaryContainer),
			onPrimaryContainer: hexFromArgb(theme.schemes.light.onPrimaryContainer),
		});
		this.emit(`changed`);
		this.emit(`colors-changed`, player.bus_name);
	}

	#onCoverChange(player: MprisPlayer) {
		const previousCoverPath = this.#previousCoverPaths.get(player.bus_name);
		if (!previousCoverPath || previousCoverPath != player.cover_path) {
			this.#previousCoverPaths.set(player.bus_name, player.cover_path);
			this.#setColors(player);
		}
	}
}

export default new MaterialColors();
