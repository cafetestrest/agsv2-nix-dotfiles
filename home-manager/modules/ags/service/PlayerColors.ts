import AstalMpris from "gi://AstalMpris?version=0.1";
import { execAsync } from "astal";
import GObject from "gi://GObject?version=2.0";
import { Colors } from "../lib/variables";

const mpris = AstalMpris.get_default();

const PlayerColorsService = GObject.registerClass(
	{
		GTypeName: "PlayerColorsService",
		Properties: {},
		Signals: {
			"colors-changed": {
				param_types: [GObject.TYPE_OBJECT, GObject.TYPE_JSOBJECT],
			},
		},
	},
	class PlayerColorsService extends GObject.Object {
		constructor() {
			super();

			mpris.get_players().forEach((player) => {
				if (this.#connections.has(player)) return;
				const id = player.connect(
					"notify::cover-art",
					this.#onCoverChange.bind(this),
				);
				this.#connections.set(player, id);
				this.#onCoverChange(player);
			});

			mpris.connect("player-added", (_, player: AstalMpris.Player) => {
				if (this.#connections.has(player)) return;
				if (player) {
					const id = player.connect(
						"notify::cover-art",
						this.#onCoverChange.bind(this),
					);
					this.#connections.set(player, id);
				}
			});

			mpris.connect("player-closed", (_, player: AstalMpris.Player) => {
				if (!this.#connections.has(player)) return;
				if (player) {
					const id = this.#connections.get(player);
					player.disconnect(id);
					this.#connections.delete(player);
				}
			});
		}

		#colors = new Map();
		#previousCoverPaths = new Map();
		#connections = new Map();

		get colors() {
			return this.#colors;
		}

		#setColors(player: AstalMpris.Player) {
			if (player.coverArt) {
				execAsync(
					`matugen image ${player.coverArt} --dry-run -j hex`,
				).then((str) => {
					const colors = JSON.parse(str).colors as {
						light: Colors;
						dark: Colors;
					};
					this.#colors.set(player.coverArt, colors.light);
					try {
						this.emit(`colors-changed`, player, colors.light);
					} catch (e) {
						print(e);
					}
				});
			}
		}

		#onCoverChange(player: AstalMpris.Player) {
			const previousCoverPath = this.#previousCoverPaths.get(
				player.busName,
			);
			if (
				previousCoverPath == undefined ||
				previousCoverPath != player.coverArt
			) {
				this.#previousCoverPaths.set(player.busName, player.coverArt);
				this.#setColors(player);
			}
		}
	},
);

const service = new PlayerColorsService();
export default service;
