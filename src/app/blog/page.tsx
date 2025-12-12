import { sql } from '@/lib/db';
import { Navigation, Footer, BlogList } from '@/components/public';
import type { Profile, SocialLink } from '@/types';

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

export const metadata = {
  title: 'Blog - Health Insights & Updates',
  description: 'Expert insights on health, wellness, and medical innovations',
};

export default async function BlogPage() {
  const { profile, socialLinks } = await getLayoutData();

  return (
    <main className="min-h-screen">
      <Navigation profile={profile} isBlogRoute />
      <div className="pt-20">
        <BlogList />
      </div>
      <Footer socialLinks={socialLinks} profile={profile} />
    </main>
  );
}
