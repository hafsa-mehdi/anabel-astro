// "View website" button in the admin's top bar. SITE_URL = the Payload version of the site.
export const ViewSite = () => {
  const url = process.env.SITE_URL || 'https://anabel-astro-payload.vercel.app'
  return (
    <a className="anabels-view-site" href={url} target="_blank" rel="noopener noreferrer">
      View website ↗
    </a>
  )
}
