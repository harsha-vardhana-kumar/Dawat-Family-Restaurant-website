import assert from "node:assert/strict";
import test from "node:test";
import {register} from "node:module";
register("./workers-test-loader.mjs",import.meta.url);

const privateWorkspaceMeta = /<meta(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["'][^"']*noindex[^"']*["'])[^>]*>/i;

test("renders the private restaurant shell without operational data", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html=await response.text();
  assert.match(html, privateWorkspaceMeta);
  assert.match(html, /Dawat Restaurant OS/);
  assert.doesNotMatch(html, /password_hash|pin_hash|qa-owner@invalid/);
});
