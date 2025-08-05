import { getArticleBySlug } from '@/lib/data/articles/actions'
import { constructMetadata } from '@/lib/utils'
import { db, schema } from '@slat/db'
import { eq } from 'drizzle-orm'
import { kebabCase } from 'lodash'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ClientUpdateDate } from '../_components/client-update-date'
import { TableOfContents, type TocItem } from '../_components/table-of-contents'

type Params = {
  slug?: string[]
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata | undefined> {
  const { slug } = await props.params

  if (!slug) return

  const article = await getArticleBySlug(slug[slug.length - 1])

  if (!article) return

  return constructMetadata({
    title: article.title,
    description: article.description ?? undefined,
  })
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const articles = await db
    .select({ slug: schema.articles.slug, categorySlug: schema.categories.slug })
    .from(schema.articles)
    .leftJoin(schema.categories, eq(schema.articles.categoryId, schema.categories.id))

  return articles.map((article) => ({
    slug: article.categorySlug ? [article.categorySlug, article.slug] : [article.slug],
  }))
}

export default async function Page(props: { params: Promise<Params> }) {
  const { slug } = await props.params

  const article = await getArticleBySlug(slug?.[slug.length - 1])

  if (!article) return notFound()

  const contentWithIds = addIdsToHeadings(article.content)
  const items = generateTableOfContents(contentWithIds)

  return (
    <div className="py-24">
      <div className="flex flex-col-reverse gap-8 lg:flex-row">
        <div className="lg:mt-4">
          {article.image && (
            <Image
              alt={`${article.title}`}
              src={article.image}
              width={1000}
              height={500}
              className="mb-12 object-cover"
            />
          )}
          <div className="space-y-2">
            <ClientUpdateDate date={article.updatedAt ?? article.createdAt} />
          </div>
          <div>
            {article.category && <div className="text-primary-500 mb-2">{article.category.name}</div>}
            <h1 className="text-foreground text-2xl font-semibold md:text-4xl">{article.title}</h1>
            {article.description && <p className="mt-2 text-base">{article.description}</p>}
            {article.isPremiumFeature && (
              <div className="mt-4 rounded-md border border-blue-500/20 bg-blue-500/10 p-4">
                <div className="text-sm">
                  <span className="text-foreground font-semibold">💎 Premium feature:</span> This feature is available
                  for premium users.
                </div>
              </div>
            )}
          </div>
          <article
            className="prose prose-invert prose-h2:mt-2 prose-strong:font-semibold text-muted-foreground prose-hr:border prose-hr:border-foreground/25 underline:text-red-500 hr:bg-red-500 marker:text-foreground mt-4 w-full max-w-prose pb-24 break-words"
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />
        </div>
        <div className="w-full lg:sticky lg:top-24 lg:max-w-xs lg:self-start">
          <TableOfContents items={items} />
        </div>
      </div>
    </div>
  )
}

function addIdsToHeadings(html: string): string {
  const headingRegex = /<(h[1-3])([^>]*)>(.*?)<\/\1>/gi

  // Track used IDs to ensure uniqueness
  const usedIds = new Set<string>()

  // Process the HTML and add IDs
  const processedHtml = html.replace(headingRegex, (match, tagName, attributes, content) => {
    const textContent = content.replace(/<\/?[^>]+(>|$)/g, '').trim() // Strip HTML tags
    let id = kebabCase(textContent)

    // Ensure unique ID by appending a counter if necessary
    let uniqueId = id
    let counter = 1
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`
      counter++
    }
    usedIds.add(uniqueId)

    return `<${tagName} ${attributes} id="${uniqueId}">${content}</${tagName}>`
  })

  return processedHtml
}

function generateTableOfContents(html: string): TocItem[] {
  const headingRegex = /<(h[1-3])\b[^>]*id="([^"]+)"[^>]*>(.*?)<\/\1>/gi

  const toc: TocItem[] = []
  const stack: { level: number; item: TocItem }[] = []

  let match
  let isFirstH1Skipped = false

  while ((match = headingRegex.exec(html)) !== null) {
    const [, tagName, id, content] = match
    const level = parseInt(tagName[1]) // Extract level from tag name (h1, h2, h3)
    const title = content.replace(/<\/?[^>]+(>|$)/g, '').trim()
    const url = `#${id}`

    // Skip the first <h1>
    if (!isFirstH1Skipped && tagName === 'h1') {
      isFirstH1Skipped = true
      continue
    }

    const tocItem: TocItem = { title, url, items: [] }

    // Adjust the stack for nesting
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop() // Remove items that are not parents for the current level
    }

    if (stack.length === 0) {
      // Top-level item
      toc.push(tocItem)
    } else {
      // Nested item
      stack[stack.length - 1].item.items!.push(tocItem)
    }

    stack.push({ level, item: tocItem })
  }

  return toc
}
