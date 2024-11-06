{
  inputs,
  pkgs,
  ...
}: {
  imports = [inputs.ags.homeManagerModules.default];

  home.packages = with pkgs; [
    inputs.ags.packages.${pkgs.system}.notifd
    inputs.ags.packages.${pkgs.system}.mpris
    inputs.ags.packages.${pkgs.system}.auth
    inputs.matugen.packages.${pkgs.system}.default
    material-symbols
    (pkgs.callPackage ../../../pkgs/wl-screenrec {})
  ];

  programs.ags = {
    enable = true;
    extraPackages = [
      pkgs.libsoup_3
      pkgs.gtksourceview
      pkgs.libnotify
      inputs.ags.packages.${pkgs.system}.apps
      inputs.ags.packages.${pkgs.system}.battery
      inputs.ags.packages.${pkgs.system}.hyprland
      inputs.ags.packages.${pkgs.system}.wireplumber
      inputs.ags.packages.${pkgs.system}.network
      inputs.ags.packages.${pkgs.system}.tray
      inputs.ags.packages.${pkgs.system}.battery
      inputs.ags.packages.${pkgs.system}.notifd
      inputs.ags.packages.${pkgs.system}.mpris
      inputs.ags.packages.${pkgs.system}.bluetooth
      inputs.ags.packages.${pkgs.system}.auth
    ];
  };
}
