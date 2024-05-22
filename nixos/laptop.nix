{pkgs, ...}: {
  systemd.services.fix-hyprland-stutters = {
    description = "Sets intel gpu min frequency";
    path = [pkgs.intel-gpu-tools];
    script = "intel_gpu_frequency --custom min=600";
    wantedBy = ["graphical.target"];
  };

  hardware.opengl = {
    enable = true;
    driSupport = true;
    driSupport32Bit = true;
    extraPackages = with pkgs; [
      intel-compute-runtime
      intel-media-driver # LIBVA_DRIVER_NAME=iHD
      vaapiVdpau
      libvdpau-va-gl
    ];
  };
}
