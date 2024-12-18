import { Widget } from "astal/gtk3";
import { bind } from "astal";
import AstalMpris from "gi://AstalMpris?version=0.1";
import icons from "../../../lib/icons";
import { lookUpIcon } from "../../../lib/utils";

type PlayerProps = {
	player: AstalMpris.Player;
};

const Player = ({ player }: PlayerProps) => {
	const PlayerIcon = () => (
		<icon
			icon={bind(player, "entry").as((i) =>
				lookUpIcon(`${i}-symbolic`) ? `${i}-symbolic` : lookUpIcon(i) ? i : icons.fallback.audio,
			)}
			className="player__icon"
		/>
	);

	const Title = new Widget.Label({
		label: player.get_title(),
		truncate: true,
		className: "player__title",
	});

	const Artist = new Widget.Label({
		label: player.get_artist(),
		truncate: true,
		className: "player__artist",
	});

	const ControlButton = ({ icon, onClick, className }: { icon: string; onClick: () => void; className: string }) => (
		<button onClicked={onClick} className={className}>
			<icon icon={icon} />
		</button>
	);

	const PlayPauseButton = ({ className }: Widget.ButtonProps) => (
		<button
			onClicked={() => player.play_pause()}
			className={`player__playpause ${className}`}
			setup={(self) => {
				const toggleActive = () => {
					self.toggleClassName("active", player.playbackStatus === AstalMpris.PlaybackStatus.PLAYING);
				};
				toggleActive();
				self.hook(player, "notify::playback-status", toggleActive);
			}}
		>
			<icon
				icon={bind(player, "playbackStatus").as((status) =>
					status === AstalMpris.PlaybackStatus.PLAYING ? icons.media.playing : icons.media.stopped,
				)}
			/>
		</button>
	);

	return (
		<box
		className={`player player-${player.busName}`}
		visible={bind(player, "playback_status").as((v) => {
			if (v != 2)
				return true;
			return false;
		})}
		>
			<PlayerIcon />
			<box>
				<box className="player__title-box"
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
                <box/>
				<PlayPauseButton />
			</box>
			<box visible={bind(player, "canGoNext")}>
				<ControlButton icon={icons.media.next} onClick={() => player.next()} className="player__next" />
			</box>
			<box visible={bind(player, "canGoPrevious")}>
				<ControlButton icon={icons.media.prev} onClick={() => player.previous()} className="player__previous" />
			</box>
		</box>
	)
};

export default () => {
	const mpris = AstalMpris.get_default();

    return <box vertical>
        {bind(mpris, "players").as(arr => arr.map(player => {
				return (<Player player={player} />)
			}
		))}
    </box>
};
