{
  programs.wezterm = {
    enable = true;
    enableZshIntegration = true;
    extraConfig = ''
      enable_wayland = true
      front_end = 'WebGpu'
      webgpu_power_preference = 'HighPerformance'
    '';
  };
}
