{pkgs, ...}: {
  systemd = {
    user.services.polkit-gnome-authentication-agent-1 = {
      description = "polkit-gnome-authentication-agent-1";
      wantedBy = ["graphical-session.target"];
      wants = ["graphical-session.target"];
      after = ["graphical-session.target"];
      serviceConfig = {
        user = "posaydone";
        ExecStart = "${pkgs.polkit_gnome}/libexec/polkit-gnome-authentication-agent-1";
        Restart = "on-failure";
        RestartSec = 1;
        TimeoutStopSec = 10;
      };
    };
    services.fix-hyprland-stutters = {
      description = "Sets intel gpu min frequency";
      path = [pkgs.intel-gpu-tools];
      script = "intel_gpu_frequency --custom min=800";
      wantedBy = ["graphical.target"];
    };
  };

  hardware.opengl = {
    driSupport = true;
    driSupport32Bit = true;
    extraPackages = with pkgs; [
      intel-compute-runtime
      intel-media-driver
      vaapiVdpau
      libvdpau-va-gl
    ];
  };
}
