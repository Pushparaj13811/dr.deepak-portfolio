import { BlogList } from "./BlogList";
import { BlogDetail } from "./BlogDetail";

interface BlogProps {
  selectedSlug: string | null;
  onSelectPost: (slug: string | null) => void;
}

export function Blog({ selectedSlug, onSelectPost }: BlogProps) {
  if (selectedSlug) {
    return (
      <BlogDetail
        slug={selectedSlug}
        onBack={() => onSelectPost(null)}
      />
    );
  }

  return (
    <section id="blog" className="relative">
      <BlogList onSelectPost={onSelectPost} />
    </section>
  );
}