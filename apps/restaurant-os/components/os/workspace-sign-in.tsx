export function WorkspaceSignInLink(){
 return (
  // eslint-disable-next-line @next/next/no-html-link-for-pages -- Sites dispatch owns SIWC; its authentication contract requires a top-level anchor without router prefetch.
  <a className="auth-link" href="/signin-with-chatgpt?return_to=%2F" target="_top">Sign in with ChatGPT</a>
 );
}
