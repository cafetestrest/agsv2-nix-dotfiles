{pkgs, ...}: {
  systemd = {
    services.fix-hyprland-stutters = {
      description = "Sets intel gpu min frequency";
      path = [pkgs.intel-gpu-tools];
      script = "intel_gpu_frequency --custom min=800";
      wantedBy = ["graphical.target"];
    };
  };

  programs = {
    auto-cpufreq.enable = true;
    auto-cpufreq.settings = {
      battery = {
        governor = "powersave";
        turbo = "auto";
      };
      charger = {
        governor = "performance";
        turbo = "auto";
      };
    };
  };

  services = {
    thermald.enable = true;
  };
}
