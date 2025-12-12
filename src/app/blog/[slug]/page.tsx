import { sql } from '@/lib/db';
import { Navigation, Footer, BlogDetail } from '@/components/public';
import type { Profile, SocialLink, BlogPost } from '@/types';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getLayoutData() {
  try {
    const [profileResult, socialLinksResult] = await Promise.all([
      sql`SELECT * FROM profile LIMIT 1`,
      sql`SELECT * FROM social_links ORDER BY display_order ASC`,
    ]);

    return {
      profile: (profileResult[0] as Profile) || null,
      socialLinks: socialLinksResult as SocialLink[],
    };
  } catch (error) {
    console.error('Failed to fetch layout data:', error);
    return {
      profile: null,
      socialLinks: [],
    };
  }
}

async function getBlogPost(slug: string) {
  try {
    const result = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} AND published = true`;
    return (result[0] as BlogPost) || null;
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const { profile, socialLinks } = await getLayoutData();

  return (
    <main className="min-h-screen">
      <Navigation profile={profile} isBlogRoute />
      <div className="pt-20">
        <BlogDetail slug={slug} />
      </div>
      <Footer socialLinks={socialLinks} profile={profile} />
    </main>
  );
}
