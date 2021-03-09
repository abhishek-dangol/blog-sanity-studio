const projectUrl = process.env.SANITY_STUDIO_PROJECT_URL;
const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET;

///adding comments
export default function resolveProductionUrl(document) {
  return `${projectUrl}/api/preview?secret=${previewSecret}&slug=${document.slug.current}`;
}
