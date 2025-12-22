// Placeholder type definition for the WASM module
// This file will be overwritten by wasm-pack build
/* tslint:disable */
/* eslint-disable */

export interface CompilationResult {
    success: boolean;
    output?: string;
    error?: string;
}

export function compile_code_wasm(source_code: string, target: string): CompilationResult;

export default function init(): Promise<void>;
