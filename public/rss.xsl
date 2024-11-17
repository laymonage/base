<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="5.2" encoding="UTF-8" />
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> Web Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <link rel="stylesheet" href="/rss.css"/>
      </head>
      <body>
        <header>
          <h1>🚀 <xsl:value-of select="/rss/channel/title"/></h1>
          <p><xsl:value-of select="/rss/channel/description"/></p>
          <a>
            <xsl:attribute name="href">
              <xsl:value-of select="/rss/channel/link"/>
            </xsl:attribute>
            Visit website &#x2192;
          </a>
        </header>
        <main>
          <section>
            <p>The web feed is available in the following variants:</p>
            <ul>
              <li><a href="/rss.xml">All</a></li>
              <li><a href="/posts/rss.xml">Blog posts only</a></li>
              <li><a href="/thoughts/rss.xml">Thoughts only</a></li>
            </ul>
          </section>
          <section>
            <ol>
              <xsl:for-each select="/rss/channel/item">
                <li>
                  <h2>
                    <a>
                      <xsl:attribute name="href">
                        <xsl:value-of select="link"/>
                      </xsl:attribute>
                      <xsl:value-of select="title"/>
                    </a>
                  </h2>
                  <small>
                    Published: <xsl:value-of select="pubDate" />
                  </small>
                  <p>
                    <xsl:value-of select="description"/>
                  </p>
                </li>
              </xsl:for-each>
            </ol>
          </section>
        </main>
        <footer>
          <p>
            <strong>This is an RSS web feed</strong>. You can <strong>subscribe</strong> by copying the URL from the address bar into your newsreader. Visit <a href="https://aboutfeeds.com">About Feeds</a> to get started with newsreaders and subscribing.
          </p>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
