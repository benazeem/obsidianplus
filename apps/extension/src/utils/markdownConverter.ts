import type { PageInfo } from '@/types'
import { Readability } from '@mozilla/readability'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'

interface ArticleData {
  title: string
  byline: string
  excerpt: string
  content: string
  markdown: string
  textContent: string
  length: number
}

interface MarkdownData {
  title: string
  url: string
  tags: string[]
  frontmatter: string
  markdown: string
}

const getPageInfo = (): Promise<PageInfo> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        reject(new Error('No active tab found'))
        return
      }
      const tabId = tabs[0]?.id
      if (!tabId) {
        reject(new Error('No active tab found'))
        return
      }

      try {
        chrome.tabs.sendMessage(
          tabId,
          { type: 'GET_PAGE_INFO' },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error('Runtime error:', chrome.runtime.lastError.message)
              reject(chrome.runtime.lastError)
              return
            }
            if (response?.success) {
              const pageInfo: PageInfo = response.data
              resolve(pageInfo)
            } else {
              console.warn('❌ Failed to Get Page Info:', response?.error)
              reject(response?.error)
            }
          },
        )
      } catch (err) {
        console.error('Unexpected error in Getting Page Info:', err)
        reject(err)
      }
    })
  })
}

/**
 * Extract clean article content from HTML and convert to Markdown with frontmatter
 */
export async function htmlPageToMarkdown(): Promise<MarkdownData> {
  // First extract clean article content using Readability
  const pageInfo = await getPageInfo()
  const { url, html, tags, domain, title, description } = pageInfo
  let newTitle = title
  if (newTitle.includes('-')) {
    const lastDash = newTitle.lastIndexOf('-')
    const secondLastDash =
      lastDash !== -1 ? newTitle.lastIndexOf('-', lastDash - 1) : -1
    if (secondLastDash !== -1) {
      newTitle = newTitle.slice(0, secondLastDash).trim()
    } else {
      newTitle = newTitle.slice(0, lastDash).trim()
    }
  }
  if (newTitle.length > 100) {
    newTitle = newTitle.slice(0, 100).trim() + '...'
  }

  const article = await extractArticleContent(html, url)

  // Initialize turndown with enhanced options
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    strongDelimiter: '**',
  })

  // Add GitHub Flavored Markdown plugin for tables
  turndownService.use(gfm)

  // Custom rules
  turndownService.addRule('simplifyLinks', {
    filter: 'a',
    replacement: (content, node) => {
      const href = (node as HTMLElement).getAttribute('href')
      return content ? `[${content}](${href})` : href || ''
    },
  })

  turndownService.addRule('images', {
    filter: 'img',
    replacement: (_content, node) => {
      const alt = (node as HTMLElement).getAttribute('alt') || ''
      const src = (node as HTMLElement).getAttribute('src') || ''
      const title = (node as HTMLElement).getAttribute('title')
      return title ? `![${alt}](${src} "${title}")` : `![${alt}](${src})`
    },
  })

  turndownService.addRule('tables', {
    filter: ['table'],
    replacement: (content, node) => {
      const table = node as HTMLTableElement
      if (table.rows.length <= 1) return ''
      return '\n\n' + content + '\n\n'
    },
  })

  const bodyMarkdown = turndownService.turndown(article.content)

  const escapeForYaml = (str: string) =>
    str.replace(/"/g, '\\"').replace(/\n/g, ' ')
  const createdAt = new Date()
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, ' UTC')
  const frontmatter = `---
title: "${escapeForYaml(article.title.trim() === '' ? newTitle : article.title)}"
byline: "${escapeForYaml(article.byline)}"
description: "${escapeForYaml(description ?? article.excerpt)}"
tags: [${tags.map((t) => `"${escapeForYaml(t)}"`).join(', ')}]
created_at: "${createdAt}"
source: "${url}"
domain: "${domain}"
length: ${article.length}
---

`

  const markdown = `${frontmatter}${bodyMarkdown}`

  return {
    title: article.title.trim() === '' ? newTitle : article.title,
    url: url,
    tags: tags,
    frontmatter,
    markdown: markdown,
  }
}

async function extractArticleContent(
  html: string,
  url: string,
): Promise<ArticleData> {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const base = doc.createElement('base')
  base.href = url
  doc.head.appendChild(base)

  const removals = [
    'script',
    'style',
    'iframe',
    'nav',
    'footer',
    'aside',
    'form',
    'input',
    'button',
    'select',
    '.ad',
    '.advertisement',
    '.promo',
    '.sponsored',
    '.tracking',
    '.popup',
    '.modal',
    '.cookie-banner',
    '[hidden]',
    '[aria-hidden="true"]',
    '[style*="display:none"]',
    '[style*="display: none"]',
    '[style*="visibility:hidden"]',
    '[style*="visibility: hidden"]',
    '[id*="ad"]',
    '[class*="ad"]',
    '[id*="banner"]',
    '[class*="banner"]',
    '[id*="sponsor"]',
    '[class*="sponsor"]',
    '[id*="social"]',
    '[class*="social"]',
    '[class*="ad"]',
    '[id*="ad"]',
    '.social-share',
    '.newsletter',
    '.comments',
    '.related-news',
  ]
  removals.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((el: Element) => el.remove())
  })

  // Extract main content using Readability
  const reader = new Readability(doc)
  const article = reader.parse()

  if (!article) {
    throw new Error('Could not extract article content')
  }

  return {
    title: article.title ?? '',
    byline: article.byline ?? '',
    excerpt: article.excerpt ?? '',
    content: article.content ?? '',
    textContent: article.textContent ?? '',
    length: article.length ?? 0,
    markdown: '', // Will be generated later
  }
}
