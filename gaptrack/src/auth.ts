import { Clerk } from "@clerk/clerk-js";
import { arSA } from "@clerk/localizations";

declare global {
  interface Window {
    __internal_ClerkUICtor?: unknown;
  }
}

const configElement = document.getElementById("gaptrack-clerk-config");

if (configElement) {
  const config = JSON.parse(configElement.textContent || "{}") as {
    publishableKey?: string;
  };
  const publishableKey = config.publishableKey;

  if (publishableKey) {
    const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
    const clerk = new Clerk(
      publishableKey,
      clerkProxyUrl ? { proxyUrl: clerkProxyUrl } : undefined,
    );
    const rootUrl = new URL("index.php", window.location.origin);
    const dashboardUrl = new URL(
      "index.php?page=dashboard",
      window.location.origin,
    ).toString();
    const signInUrl = new URL(
      "index.php?page=sign-in",
      window.location.origin,
    ).toString();
    const signUpUrl = new URL(
      "index.php?page=sign-in&mode=sign-up",
      window.location.origin,
    ).toString();

    const appearance = {
      options: {
        logoPlacement: "inside" as const,
        logoLinkUrl: `${window.location.origin}/`,
        logoImageUrl: `${window.location.origin}/logo.svg`,
      },
      variables: {
        colorPrimary: "#317565",
        colorForeground: "#213b34",
        colorMutedForeground: "#7d8a80",
        colorDanger: "#b45348",
        colorBackground: "#fffefa",
        colorInput: "#fffefa",
        colorInputForeground: "#293d35",
        colorNeutral: "#293d35",
        fontFamily: '"Noto Sans Arabic", "Segoe UI", Tahoma, sans-serif',
        borderRadius: "12px",
      },
    };

    const loadClerkUi = async () => {
      if (!window.__internal_ClerkUICtor) {
        const encodedDomain = publishableKey.split("_")[2];
        if (!encodedDomain) throw new Error("تعذر تحديد خدمة تسجيل الدخول.");

        const clerkDomain = atob(encodedDomain).slice(0, -1);
        const script = document.createElement("script");
        const clerkHost = clerk.proxyUrl.replace(/\/$/, "") || `https://${clerkDomain}`;
        script.src = `${clerkHost}/npm/@clerk/ui@1/dist/ui.browser.js`;
        script.async = true;
        script.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error("تعذر تحميل صفحة تسجيل الدخول."));
          document.head.appendChild(script);
        });
      }

      const clerkUi = window.__internal_ClerkUICtor;
      if (!clerkUi) throw new Error("تعذر تهيئة صفحة تسجيل الدخول.");

      await clerk.load({
        ui: { ClerkUI: clerkUi as never },
        appearance,
        localization: arSA,
        signInUrl,
        signUpUrl,
      });

      const mount = document.getElementById("clerk-sign-in");
      if (mount instanceof HTMLDivElement) {
        const isSignUp =
          new URLSearchParams(window.location.search).get("mode") ===
          "sign-up";
        const commonProps = {
          routing: "hash" as const,
          fallbackRedirectUrl: dashboardUrl,
          appearance,
        };

        if (isSignUp) {
          clerk.mountSignUp(mount, { ...commonProps, signInUrl });
        } else {
          clerk.mountSignIn(mount, { ...commonProps, signUpUrl });
        }
      }

      const authLink = document.getElementById("clerk-auth-link");
      const signOutButton = document.getElementById("clerk-signout-button");
      const syncAuthState = () => {
        const user = clerk.user;
        if (authLink instanceof HTMLAnchorElement) {
          authLink.textContent =
            user?.primaryEmailAddress?.emailAddress || "تسجيل الدخول";
          authLink.href = user ? dashboardUrl : signInUrl;
        }
        if (signOutButton instanceof HTMLButtonElement) {
          signOutButton.hidden = !user;
        }
      };

      syncAuthState();
      clerk.addListener(syncAuthState);
      signOutButton?.addEventListener("click", () => {
        void clerk.signOut({ redirectUrl: rootUrl.toString() });
      });
    };

    void loadClerkUi().catch((error: unknown) => {
      console.error("GapTrack authentication could not initialize.", error);
      const mount = document.getElementById("clerk-sign-in");
      if (mount) {
        mount.textContent =
          "تعذر تحميل تسجيل الدخول. أعد تحميل الصفحة وحاول مرة أخرى.";
      }
    });
  } else {
    const mount = document.getElementById("clerk-sign-in");
    if (mount) mount.textContent = "إعداد تسجيل الدخول غير مكتمل.";
  }
}
