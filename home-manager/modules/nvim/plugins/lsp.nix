{
  programs.nixvim = {
    plugins = {
      lsp = {
        enable = true;

        keymaps = {
          silent = true;
          diagnostic = {
            # Navigate in diagnostics
            "<leader>k" = "goto_prev";
            "<leader>j" = "goto_next";
            "<leader>f" = "open_float";
          };

          lspBuf = {
            gd = "definition";
            gD = "references";
            gt = "type_definition";
            gi = "implementation";
            ca = "code_action";
            K = "hover";
            "<F2>" = "rename";
          };
        };

        servers = {
          svelte.enable = true;
          tsserver.enable = true;
          eslint.enable = true;
          emmet_ls.enable = true;
          bashls.enable = true;
          lua-ls.enable = true;
          nil_ls.enable = true;
          texlab.enable = true;
          pyright.enable = true;
          rust-analyzer = {
            installCargo = true;
            installRustc = true;
            enable = true;
          };
        };
      };
    };
  };
}
