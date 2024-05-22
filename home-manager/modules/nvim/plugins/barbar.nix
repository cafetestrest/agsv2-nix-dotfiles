{
  programs.nixvim.plugins.barbar = {
    enable = true;
    autoHide = true;
    keymaps = {
      silent = true;

      next = "<TAB>";
      previous = "<S-TAB>";
      close = "<leader>x";
    };
  };
}
