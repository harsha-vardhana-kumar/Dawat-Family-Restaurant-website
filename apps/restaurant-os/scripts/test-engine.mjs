import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
await build({entryPoints:['tests/engine-entry.ts'],bundle:true,platform:'node',format:'esm',outfile:'.test-build/engine.mjs'});
await build({entryPoints:['lib/printing.ts'],bundle:true,platform:'node',format:'esm',outfile:'.test-build/printing.mjs'});
const run=spawnSync(process.execPath,['--test','tests/engine.test.mjs'],{stdio:'inherit'});
process.exitCode=run.status??1;
