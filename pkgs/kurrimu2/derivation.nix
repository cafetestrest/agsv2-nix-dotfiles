{
  fetchFromGitHub,
  buildDotnetModule,
  dotnetCorePackages,
}:
buildDotnetModule rec {
  pname = "Kuriimu2";
  version = "1.2.2";

  src = fetchFromGitHub {
    owner = "FanTranslatorsInternational";
    repo = "335a0da";
    sha256 = "sha256-eAETlcIDK2VQz7PWwVFD0pLWPNH4mH6LTtV3SZGlR2E=";
  };

  dotnet-sdk = dotnetCorePackages.sdk_7 .0;
  dotnet-runtime = dotnetCorePackages.runtime_7_0;

  projectFile = "src/Kuriimu2.EtoForms.sln";
  nugetDeps = ./deps.nix;

  meta = {
    description = "Kuriimu is a general purpose game translation project manager and toolkit for authors of fan translations and game mods.";
    license = "GPL3";
  };
}
