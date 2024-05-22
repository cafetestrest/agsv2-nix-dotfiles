{
  stdenv,
  lib,
  qtbase,
  qmake,
  wrapQtAppsHook,
  fetchFromGitLab,
}:
stdenv.mkDerivation rec {
  pname = "cutentr";
  version = "0.3.3";

  src = fetchFromGitLab {
    owner = "BoltsJ";
    repo = "cuteNTR";
    rev = "d217aae4";
    sha256 = "sha256-eAETlcIDK2VQz7PWwVFD0pLWPNH4mH6LTtV3SZGlR8E=";
  };

  meta = {
    description = "POC Qt 3DS streaming client for NTR CFW";
    license = "GPL3";
  };

  buildInputs = [qtbase qmake];
  nativeBuildInputs = [wrapQtAppsHook];
}
