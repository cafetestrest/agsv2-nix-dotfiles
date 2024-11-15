{
  pkgs,
  inputs,
  ...
}: {
  imports = [
    ./shared.nix
    ./modules/hyprland.nix
    ./hardware/laptop.nix
  ];

  environment = {
    systemPackages = [
      inputs.nbfc-linux.packages.${pkgs.system}.default
    ];
  };

  systemd = {
    services.fix-hyprland-stutters = {
      description = "Sets intel gpu min frequency";
      path = [pkgs.intel-gpu-tools];
      script = "intel_gpu_frequency --custom min=800";
      wantedBy = ["graphical.target"];
    };
  };

  services = {
    thermald.enable = true;
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

  hardware = {
    enableRedistributableFirmware = true;
    opengl = {
      driSupport32Bit = true;
      extraPackages = with pkgs; [
        intel-compute-runtime
        intel-media-driver
        vaapiVdpau
        libvdpau-va-gl
      ];
    };
  };
}
