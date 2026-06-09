// src/pages/api/posts.json.ts
// 記事一覧をJSONで返すエンドポイント
export const prerender = true;

const postFiles = import.meta.glob('../posts/*.md', { eager: true });

const posts = Object.entries(postFiles)
  .map(([path, post]: [string, any]) => ({
    slug: path.replace('../posts/', '').replace('.md', ''),
    title: post.frontmatter?.title ?? '',
    description: post.frontmatter?.description ?? '',
    date: post.frontmatter?.date ?? '',
    tag: post.frontmatter?.tag ?? '',
    url: `/posts/${path.replace('../posts/', '').replace('.md', '')}`,
  }))
  .filter(p => p.title)
  .sort((a, b) => {
    const months: Record<string, number> = {
      January:1, February:2, March:3, April:4, May:5, June:6,
      July:7, August:8, September:9, October:10, November:11, December:12,
    };
    const parse = (d: string) => {
      const parts = d?.split(' ') ?? [];
      return parseInt(parts[1] ?? '2025') * 100 + (months[parts[0]] ?? 1);
    };
    return parse(b.date) - parse(a.date);
  });

export async function GET() {
  return new Response(JSON.stringify(posts), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
