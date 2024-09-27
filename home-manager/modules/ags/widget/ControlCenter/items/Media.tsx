import AstalMpris from "gi://AstalMpris?version=0.1";
import { bind, Gtk, Widget } from "astal";
import icons from "../../../lib/icons";
import { spacing } from "../../../lib/variables";
import PlayerColors from "../../../service/PlayerColors";
import { hexToRgb } from "../../../lib/utils";

type PlayerProps = {
	player: AstalMpris.Player;
};

const Player = ({ player }: PlayerProps) => {
	const Title = Widget.Label({
		label: player.get_title(),
		truncate: true,
		className: `player__title`,
		halign: Gtk.Align.START,
	});

	const Artist = Widget.Label({
		label: player.get_artist(),
		truncate: true,
		className: `player__artist`,
		halign: Gtk.Align.START,
	});

	const PlayerIcon = () => (
		<icon
			icon={bind(player, "entry").as((i) => `${i}-symbolic`)}
			className="player__icon"
		/>
	);
	const PlayPause = ({ className, ...props }: Widget.ButtonProps) => (
		<button
			onClicked={() => player.play_pause()}
			className={`player__playpause ${className}`}
			{...props}
			setup={(self) => {
				const colors = PlayerColors.colors.get(player.coverArt);
				if (colors) {
					self.css = `
						background: ${colors.primary_container}; \
						color: ${colors.on_primary_container};
					`;
				}
				self.toggleClassName(
					"active",
					player.playbackStatus === AstalMpris.PlaybackStatus.PLAYING,
				);
				self.hook(player, "notify::playback-status", () => {
					self.toggleClassName(
						"active",
						player.playbackStatus ===
							AstalMpris.PlaybackStatus.PLAYING,
					);
				});
				self.hook(
					PlayerColors,
					"colors-changed",
					(self, changedPlayer, colors) => {
						if (player == changedPlayer) {
							self.css = `
								background: ${colors.primary_container}; \
								color: ${colors.on_primary_container};
							`;
						}
					},
				);
			}}
		>
			<icon
				icon={bind(player, "playbackStatus").as((status) => {
					switch (status) {
						case AstalMpris.PlaybackStatus.PLAYING:
							return icons.media.playing;
						case AstalMpris.PlaybackStatus.STOPPED:
						case AstalMpris.PlaybackStatus.PAUSED:
							return icons.media.stopped;
					}
				})}
			/>
		</button>
	);
	const Next = () => (
		<button onClicked={() => player.next()} className={"player__next"}>
			<icon icon={icons.media.next} />
		</button>
	);
	const Previous = () => (
		<button
			onClicked={() => player.previous()}
			className={"player__previous"}
		>
			<icon icon={icons.media.prev} />
		</button>
	);
	// const PositionSlider = () => (
	// 	<slider
	// 		className={"player__position-slider"}
	// 		drawValue={false}
	// 		hexpand
	// 		onDragged={({ value }) => (player.position = value * player.length)}
	// 		setup={(self) => {
	// 			// const update = () => {
	// 			// 	const { length, position } = player;
	// 			// 	print(length, position);
	// 			// 	self.visible = length > 0;
	// 			// 	self.value = length > 0 ? position / length : 0;
	// 			// };
	// 			// self.hook(player, "notify::position", update);
	// 			// self.hook(player, "position", update);
	// 			// self.poll(1000, update);
	// 		}}
	// 	></slider>
	// );

	return (
		<centerbox
			vertical
			className="player"
			vexpand
			setup={(self) => {
				const colors = PlayerColors.colors.get(player.coverArt);
				if (colors) {
					const primary_rgb = hexToRgb(colors.primary)!;
					self.css = `
						background-image:
							radial-gradient(circle,\
								rgba(${primary_rgb.r}, ${primary_rgb.g}, ${primary_rgb.b}, 0.05) 10%,\
								rgba(${primary_rgb.r}, ${primary_rgb.g}, ${primary_rgb.b}, 0.6)),\
							radial-gradient(circle,\
								rgba(0,0,0, 0.25) 10%,\
								rgba(0,0,0, 0.25)),\
								url("${player.coverArt}");\
						color: ${colors.on_primary};
					`;
				}
				self.hook(
					PlayerColors,
					"colors-changed",
					(self, changedPlayer, colors) => {
						if (player == changedPlayer) {
							const colors_rgb = hexToRgb(colors.primary)!;
							self.css = `
								background-image:
									radial-gradient(circle,\
										rgba(${colors_rgb.r}, ${colors_rgb.g}, ${colors_rgb.b}, 0.05) 10%,\
										rgba(${colors_rgb.r}, ${colors_rgb.g}, ${colors_rgb.b}, 0.6)),\
									radial-gradient(circle,\
										rgba(0,0,0, 0.25) 10%,\
										rgba(0,0,0, 0.25)),\
										url("${player.coverArt}");\
								color: ${colors.on_primary};
							`;
						}
					},
				);
			}}
		>
			<box vexpand valign={Gtk.Align.START}>
				<PlayerIcon />
			</box>
			<box hexpand vexpand valign={Gtk.Align.CENTER}>
				<box
					vertical
					halign={Gtk.Align.START}
					vexpand
					valign={Gtk.Align.CENTER}
					className="player__title-box"
					setup={(self) => {
						self.hook(player, "notify::title", (_) => {
							self.toggleClassName("dissappear", true);
							setTimeout(() => {
								self.toggleClassName("dissappear", false);
								Title.label = player.title;
								Artist.label = player.artist;
							}, 300);
						});
					}}
				>
					{Title}
					{Artist}
				</box>
				<box hexpand />
				<PlayPause halign={Gtk.Align.END} />
			</box>
			<box vexpand valign={Gtk.Align.END}>
				<Previous />
				<box hexpand />
				<Next />
			</box>
		</centerbox>
	);
};

export default () => {
	const mpris = AstalMpris.get_default();
	return (
		<box vertical spacing={spacing}>
			{bind(mpris, "players").as((players) =>
				players.map((player) => <Player player={player} />),
			)}
		</box>
	);
};
