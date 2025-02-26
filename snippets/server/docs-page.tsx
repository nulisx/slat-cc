import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Article as ArticleType } from "@slat/db";
import { constructMetadata } from "@slat/utils";
import {
  getArticleBySlug,
  getArticles,
} from "@/lib/application/docs/actions/get-articles";
import { getAuthorsByIds } from "@/lib/application/docs/actions/get-authors";
import { getPreviousBreadcrumb } from "@/lib/application/docs/actions/get-docs-navigation";
import {
  addIdsToHeadings,
  generateTableOfContents,
} from "@/utils/functions/html";

import { TableOfContents } from "../_components/table-of-contents";
import { Breadcrumbs } from "../_components/breadcrumbs";
import { Tooltip } from "@/components/ui/tooltip";
import { ClientUpdateDate } from "../_components/client-update-date";
import Article from "@/components/core/article";
import IndexPage from "../_components/index-page";

// app/(docs)/docs/[[...slug]]/page.tsx

type Params = {
  slug?: string[];
};

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata | undefined> {
  const { slug } = await props.params;

  if (!slug) return;

  const article = await getArticleBySlug(slug[slug.length - 1]);

  if (!article) return;

  return constructMetadata({
    title: article.title,
    description: article.description || undefined,
  });
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const articles = await getArticles();

  return articles.map((article) => ({
    slug: article.categorySlug
      ? [article.categorySlug, article.slug]
      : [article.slug],
  }));
}

export default async function Page(props: { params: Promise<Params> }) {
  const { slug } = await props.params;

  if (!slug) return <IndexPage />;

  const article = await getArticleBySlug(slug[slug.length - 1]);

  if (!article) notFound();

  const contentWithIds = addIdsToHeadings(article.content);
  const items = generateTableOfContents(contentWithIds);

  return (
    <div className="py-24">
      {article && <BreadcrumbsAsync article={article} />}
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
            <Authors />
            <ClientUpdateDate date={article.updatedAt ?? article.createdAt} />
          </div>
          {article.isPremiumFeature && (
            <div className="my-4 border-l-2 border-blue-500 bg-blue-500/10 p-4">
              <div className="text-sm">
                <span className="font-semibold text-foreground">
                  💎 Premium feature:
                </span>{" "}
                This feature is available for premium users.
              </div>
            </div>
          )}
          <Article
            invert
            content={contentWithIds}
            className="prose-strong:font-[600]"
          />
        </div>
        <div className="w-full lg:sticky lg:top-24 lg:max-w-xs lg:self-start">
          <TableOfContents items={items} />
        </div>
      </div>
    </div>
  );
}

async function BreadcrumbsAsync({ article }: { article: ArticleType }) {
  const prevBreadcrumb = await getPreviousBreadcrumb(article.categoryId);

  const breadcrumbs = [
    { name: "Docs" },
    ...(prevBreadcrumb ? [{ name: prevBreadcrumb.name }] : []),
    { name: article.title },
  ];

  return <Breadcrumbs items={breadcrumbs} />;
}

async function Authors() {
  const authors = await getAuthorsByIds([1]);
  return (
    <div className="flex -space-x-[0.525rem]">
      {authors.map((author, idx) => (
        <Link key={idx} href={`/${author.username}`}>
          <Tooltip content={author.name!}>
            <Image
              className="size-8 shrink-0 rounded-full object-cover ring-2 ring-card"
              src={author.avatar || "/images/default-avatar.jpg"}
              width={28}
              height={28}
              alt={author.name || author.username}
            />
          </Tooltip>
        </Link>
      ))}
    </div>
  );
}
