{
  lib,
  python3Packages,
  fetchFromGitHub,
  pkgs,
}: let
  save3ds = pkgs.callPackage ../save3ds/derivation.nix {};
  pname = "custom-install";
  version = "2.1";
in
  python3Packages.buildPythonPackage {
    inherit pname version;

    src = fetchFromGitHub {
      owner = "ihaveamac";
      repo = pname;
      rev = "9ab8236a784f738f213013ce08636bae9f155968";
      hash = "sha256-Hgv8GMOvs8J3iIDe+6yg0uS8zBotcQ+dwidqrVUr54c=";
    };

    buildInputs = [
      save3ds
    ];

    nativeBuildInputs = [
      python3Packages.setuptools
      python3Packages.wheel
    ];

    propagatedBuildInputs = [
      python3Packages.events
      python3Packages.pyctr
      python3Packages.tkinter
    ];

    preBuild = ''
      cat > setup.py << EOF
      from setuptools import setup, find_packages

      setup(
        name='custom-install',
        version='2.1.0',
        packages=find_packages(),
        scripts=['custominstall.py', 'ci-gui.py']
      )
      EOF
    '';

    postInstall = ''
      mkdir -p $out/bin/bin/linux/
      ln -sf "${save3ds}/bin/save3ds_fuse" $out/bin/bin/linux/
      mv -v $out/bin/custominstall.py $out/bin/custominstall
      mv -v $out/bin/ci-gui.py $out/bin/ci-gui
    '';

    meta = with lib; {
      description = "Installs a title directly to an SD card for the Nintendo 3DS. Originally created late June 2019.";
      homepage = "https://github.com/ihaveamac/custom-install";
      license = licenses.mit;
      maintainers = [];
    };
  }
