{
  blueprint-compiler,
  desktop-file-utils,
  lib,
  libadwaita,
  libportal-gtk4,
  meson,
  ninja,
  python3Packages,
  wrapGAppsHook4,
}:
python3Packages.buildPythonApplication {
  pname = "hyprsettings";
  version = "0.0.1";
  format = "other";

  src = /home/posaydone/Projects/hyprsettings/.;

  buildInputs = [
    libadwaita
    libportal-gtk4
  ];

  nativeBuildInputs = [
    blueprint-compiler
    desktop-file-utils
    meson
    ninja
    wrapGAppsHook4
  ];

  propagatedBuildInputs = with python3Packages; [
    packaging
    pygobject3
  ];

  meta = with lib; {
    description = "Settings for hyprland";
    mainProgram = "hyprsettings";
    license = licenses.gpl3Plus;
  };
}
