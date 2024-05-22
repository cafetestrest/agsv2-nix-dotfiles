{
  inputs,
  pkgs,
  ...
}: {
  imports = [inputs.ags.homeManagerModules.default];

  home.packages = with pkgs; [
    (python311.withPackages (p: [p.python-pam p.requests p.material-color-utilities]))
    libnotify
    inputs.matugen.packages.${pkgs.system}.default
    dart-sass
    gtk3 # gtk-launch
  ];

  programs.ags = {
    enable = true;
    extraPackages = [pkgs.libsoup_3];
  };
}
