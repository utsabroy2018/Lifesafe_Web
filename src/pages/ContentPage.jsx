import { useEffect, useState } from "react";
import PageBanner from "../components/PageBanner";
import useAsync from "../hooks/useAsync";
import {
  getMediaById,
  getPageById,
  getPageBySlug,
} from "../services/wordpressApi";

export default function ContentPage({
  title,
  eyebrow,
  slug,
  pageId,
  children,
}) {
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const page = useAsync(
    () => (pageId ? getPageById(pageId) : getPageBySlug(slug)),
    [pageId, slug]
  );

  useEffect(() => {
    let active = true;
    const bannerImageId = page.data?.acf?.banner_content?.banner_image;

    if (!bannerImageId) {
      setBannerImageUrl(null);
      return;
    }

    getMediaById(bannerImageId)
      .then((media) => {
        if (!active) return;
        setBannerImageUrl(media?.source_url || null);
      })
      .catch(() => {
        if (active) setBannerImageUrl(null);
      });

    return () => {
      active = false;
    };
  }, [page.data]);

  const apiContent = page.data?.content?.rendered;
  const pageEyebrow =
    page.data?.acf?.banner_content?.caption_title || eyebrow;

  return (
    <>
      <PageBanner
        title={page.data?.title?.rendered || title}
        eyebrow={pageEyebrow}
        imageUrl={bannerImageUrl}
      />

      <section className="section">
        <div className="container">
          <div className="inner-intro section-heading">
            {typeof children === 'function' ? (
              children(apiContent)
            ) : (
              <>
                {apiContent && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: apiContent,
                    }}
                  />
                )}
                {children}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
