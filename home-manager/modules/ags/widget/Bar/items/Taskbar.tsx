import { bind, execAsync } from "astal"
import AstalHyprland from "gi://AstalHyprland"
import AstalApps from "gi://AstalApps"
import icons, { substitutions } from "../../../lib/icons";
import { Astal } from "astal/gtk3";
import { lookUpIcon } from "../../../lib/utils";

type Address = {
	address: string;
};

const Hyprland = AstalHyprland.get_default();
const Applications = AstalApps.Apps.new();

function getHyprlandClientIcon(client: AstalHyprland.Client, iconName: string) {
	if (!client) return icons.fallback.executable;

	let icon = "";
	if (iconName)
		icon = iconName;
  
	if ((!icon || icon === "") && client.initialClass !== "")
	  icon = Applications.exact_query(client.initialClass)[0]?.iconName;
	if ((!icon || icon === "") && client.initialTitle !== "")
	  icon = Applications.exact_query(client.initialTitle)[0]?.iconName;

	icon = substitutions.icons[client.initialTitle] || icon;
	return Astal.Icon.lookup_icon(icon) ? icon : icons.fallback.executable;
};

export default () => {
    const clients = bind(Hyprland, 'clients');
    const focus = ({ address }: Address) =>
        execAsync(`hyprctl dispatch focuswindow address:0x${address}`).catch(
            print
        );

    return clients.as((clientList) => {
        if (clientList.length === 0) {
            return <box />;
        }
        return (
            <box className="Tray">
                {clientList.map((client) => {

				const cls = client.class;
				const icon = substitutions.icons[cls]
					? substitutions.icons[cls]
					: lookUpIcon(cls)
						? cls
						: icons.fallback.executable;
	
                    return (
                        <button
                            onClicked={() => {
                                const address = client.get_address();
                                focus({ address });
                            }}
                        >
                            <icon
                                setup={(self) => {
                                    self.set_icon(getHyprlandClientIcon(client, icon));
                                }}
                            />
                        </button>
                    );
                })}
            </box>
        );
    });
};