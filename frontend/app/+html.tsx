import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

import { Colors } from '@/constants/theme';

const TAB_BAR_WEB_STYLES = `
  html,
  body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    background-color: ${Colors.light.pageBackground};
  }

  @media (prefers-color-scheme: dark) {
    html,
    body {
      background-color: ${Colors.dark.pageBackground};
    }
  }

  #app-tab-bar {
    width: 100% !important;
    align-self: stretch !important;
    flex-shrink: 0 !important;
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

  [role="dialog"] {
    position: fixed !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    max-height: 100% !important;
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
