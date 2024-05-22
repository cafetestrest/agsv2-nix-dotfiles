{
  inputs,
  pkgs,
  ...
}: {
  imports = [inputs.astal.homeManagerModules.default];

  home.packages = with pkgs; [
    (python311.withPackages (p: [p.python-pam p.requests p.material-color-utilities]))
    libnotify
    inputs.matugen.packages.${pkgs.system}.default
    dart-sass
    gtk4
  ];

  programs.astal = {
    enable = true;
    extraPackages = with pkgs; [
      libsoup_3
      accountsservice
    ];
  };
}
