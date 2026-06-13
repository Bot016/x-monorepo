import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const TAB_BAR_WEB_STYLES = `
  #app-tab-bar,
  #app-tab-bar * {
    overflow: visible !important;
  }

  #app-tab-bar {
    min-height: calc(58px + env(safe-area-inset-bottom, 0px)) !important;
    padding-bottom: max(12px, env(safe-area-inset-bottom, 0px)) !important;
    box-sizing: border-box !important;
  }

  [role="tablist"] {
    min-height: calc(58px + env(safe-area-inset-bottom, 0px)) !important;
    height: auto !important;
    overflow: visible !important;
    padding-bottom: max(12px, env(safe-area-inset-bottom, 0px)) !important;
    box-sizing: border-box !important;
  }

  [role="tab"] {
    overflow: visible !important;
    min-height: 48px !important;
    justify-content: center !important;
    align-items: center !important;
    padding-top: 6px !important;
    padding-bottom: 4px !important;
  }

  [role="tab"] * {
    overflow: visible !important;
    line-height: 1.3 !important;
  }
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: TAB_BAR_WEB_STYLES }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
