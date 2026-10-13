'use client'
// Under "Custom schema (advanced)": test the published page in Google's Rich Results Test, or
// see all of its schema (automatic + FAQ + custom) in the schema.org validator.
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

export const SchemaTools = ({ siteUrl, globalPaths }: { siteUrl: string; globalPaths: Record<string, string> }) => {
  const { globalSlug } = useDocumentInfo()
  const slug = useFormFields(([fields]) => fields.slug?.value)
  const path = globalSlug ? (globalPaths[globalSlug] ?? '') : typeof slug === 'string' ? slug : ''
  const pageUrl = `${siteUrl}/${path ? `${path}/` : ''}`
  const link = { target: '_blank', rel: 'noopener noreferrer', style: { marginRight: '1.5rem' } } as const
  return (
    <div className="field-type" style={{ marginTop: '-0.5rem' }}>
      <a href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(pageUrl)}`} {...link}>
        Test in Google Rich Results ↗
      </a>
      <a href={`https://validator.schema.org/#url=${encodeURIComponent(pageUrl)}`} {...link}>
        Show the full schema for this page ↗
      </a>
      <p className="field-description" style={{ marginTop: '0.5rem' }}>
        Both check the published page, so publish your changes first.
      </p>
    </div>
  )
}
