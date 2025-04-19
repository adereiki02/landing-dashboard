import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSettings } from '../../context/SettingsContext';

function DynamicHelmet() {
  const { settings } = useSettings();
  const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');

  useEffect(() => {
    // Handle favicon from settings
    if (settings.favicon) {
      // Check if the favicon is a data URL (from file upload)
      if (settings.favicon.startsWith('data:')) {
        setFaviconUrl(settings.favicon);
      } else {
        // If it's a path, ensure it's properly formatted
        setFaviconUrl(settings.favicon.startsWith('/') ? settings.favicon : `/${settings.favicon}`);
      }
    }
  }, [settings.favicon]);

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0D8ABC" />
      <link rel="icon" href={faviconUrl} />
      <title>{settings.siteName} - {settings.siteDescription}</title>
      <meta name="description" content={settings.siteDescription} />
      {settings.metaTags && <meta name="keywords" content={settings.metaTags} />}
      {settings.googleAnalyticsId && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}></script>
      )}
      {settings.googleAnalyticsId && (
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${settings.googleAnalyticsId}');
          `}
        </script>
      )}
      {settings.customCss && (
        <style type="text/css">
          {settings.customCss}
        </style>
      )}
      {settings.customJs && (
        <script>
          {settings.customJs}
        </script>
      )}
    </Helmet>
  );
}

export default DynamicHelmet;