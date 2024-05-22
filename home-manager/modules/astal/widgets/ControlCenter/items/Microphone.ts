import icons from 'lib/icons';
import ControlCenterButton from '../ControlCenterButton';

const { microphone } = await Service.import('audio');

const icon = () =>
	microphone.is_muted || microphone.stream?.isMuted
		? icons.audio.mic.muted
		: icons.audio.mic.high;

const label = () => (microphone.is_muted || microphone.stream?.isMuted ? 'Muted' : 'Unmuted');

export default () =>
	ControlCenterButton({
		icon: Utils.watch(icon(), microphone, icon),
		label: Utils.watch(label(), microphone, label),
		on_primary_click: () => (microphone.is_muted = !microphone.is_muted),
		connection: [microphone, () => microphone.is_muted || microphone.stream?.isMuted || false],
	});
