import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth && !matchUnprotected(req.nextUrl)) {
    const newUrl = new URL("/sign-in", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

function matchUnprotected(url: URL) {
  return ["/sign-in", "/setup"].some((path) => url.pathname.startsWith(path));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
