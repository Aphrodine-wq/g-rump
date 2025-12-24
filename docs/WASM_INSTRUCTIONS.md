# 🦀 Building G-Rump WASM Compiler

To enable real-time compilation in the browser, you need to build the Rust compiler into a WebAssembly module.

## Prerequisites
1.  **Rust**: Ensure you have Rust installed (`rustup`).
2.  **wasm-pack**: Install the WASM packager.
    ```bash
    cargo install wasm-pack
    ```

## Build Instructions

Run these commands from the project root:

1.  **Build the WASM module**:
    ```bash
    cd grump-compiler
    wasm-pack build --target web
    ```

2.  **Deploy to Web Frontend**:
    Copy the generated `pkg` folder to the web source directory.
    ```bash
    # (PowerShell)
    Copy-Item -Path pkg\* -Destination ..\web\src\grump-compiler-wasm -Recurse -Force
    
    # (Bash)
    cp -r pkg/* ../web/src/grump-compiler-wasm/
    ```

3.  **Verify**:
    Start the web app (`npm run dev` in `web/`). The "Compile" button in the Game Dev Workspace should now run the actual Rust compiler logic!

## Troubleshooting
*   **PowerShell Execution Policy**: If you get errors running `wasm-pack` or npm scripts, you may need to bypass the execution policy:
    ```powershell
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```
*   **Vite Errors**: Ensure `vite-plugin-wasm` is installed in `web/`.
