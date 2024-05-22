{
  inputs,
  pkgs,
  ...
}: {
  xdg = {
    autostart.enable = true;
    portal = {
      enable = true;
      wlr.enable = true;
      extraPortals = [pkgs.xdg-desktop-portal-gtk];
    };
  };

  hardware = {
    system76.power-daemon = {
      enable = true;
    };
    opengl = {
      enable = true;
      driSupport = true;
      driSupport32Bit = true;
      extraPackages = with pkgs; [
        intel-compute-runtime
        intel-media-driver
        vaapiVdpau
        libvdpau-va-gl
      ];
    };
  };

  programs = {
    hyprland = {
      enable = true;
      package = inputs.hyprland.packages.${pkgs.system}.hyprland;
    };
  };

  security = {
    polkit.enable = true;
    sudo = {
      enable = true;
      extraRules = [
        {
          groups = ["wheel"];
          commands = [
            {
              command = "/run/current-system/sw/bin/system76-power";
              options = ["NOPASSWD"];
            }
            {
              command = "/run/current-system/sw/bin/ec_probe";
              options = ["NOPASSWD"];
            }
          ];
        }
      ];
    };
  };

  environment = {
    variables = {
      S76_POWER_PCI_RUNTIME_PM = 1;
    };
    systemPackages = with pkgs.gnome; [
      inputs.nbfc-linux.packages.${pkgs.system}.default
      adwaita-icon-theme
      nautilus
      gnome-calendar
      gnome-boxes
      gnome-system-monitor
      gnome-control-center
      gnome-weather
      gnome-calculator
      gnome-software # for flatpak
      gnome-disk-utility
    ];
  };

  systemd = {
    user.services.polkit-gnome-authentication-agent-1 = {
      description = "Starts gnome polkit service";
      wantedBy = ["graphical-session.target"];
      serviceConfig = {
        Type = "simple";
        ExecStart = "${pkgs.polkit_gnome}/libexec/polkit-gnome-authentication-agent-1";
        Restart = "on-failure";
        RestartSec = 1;
      };
    };
  };

  services = {
    fprintd.enable = true;
    gvfs.enable = true;
    devmon.enable = true;
    udisks2.enable = true;
    upower.enable = true;
    accounts-daemon.enable = true;
    gnome = {
      evolution-data-server.enable = true;
      glib-networking.enable = true;
      gnome-keyring.enable = true;
      gnome-online-accounts.enable = true;
    };
  };
}
