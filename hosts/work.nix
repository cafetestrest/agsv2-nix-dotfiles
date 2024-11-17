{
  config,
  lib,
  pkgs,
  ...
}: {
  imports = [
    ./shared.nix
    ./modules/hyprland.nix
    ./hardware/work.nix
  ];

  hardware.graphics = {
    enable = true;
  };

  services.xserver.videoDrivers = ["nvidia"];
  hardware.nvidia = {
    modesetting.enable = true;
    powerManagement.enable = false;
    powerManagement.finegrained = false;
    open = false;
    nvidiaSettings = true;
    package = config.boot.kernelPackages.nvidiaPackages.stable;
  };
}
