import type { GlobalConfig } from 'payload'
import { group, image, link, linkList, rowLabel, tabs, text, textarea } from '../fields'
import { rebuildAfterGlobalChange } from '../hooks/rebuild'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site settings',
  admin: { group: 'Site-wide' },
  access: { read: () => true },
  hooks: { afterChange: [rebuildAfterGlobalChange] },
  versions: { drafts: true, max: 50 },
  fields: [
    tabs(
      [
        'Business',
        [
          text('businessName', 'Business name', 'Used in the footer, page titles and Google business data.'),
          group(
            'wordmark',
            'Header name',
            [
              {
                type: 'row',
                fields: [
                  text('name', 'Name (large, italic)', "e.g. Anabel's"),
                  text('tagline', 'Line underneath (small capitals)', 'e.g. Oriental Rugs'),
                ],
              },
            ],
            'The name shown in the middle of the header and in the footer.',
          ),
          image('logo', 'Logo image', 'Used by Google and when pages are shared on social media. The header shows the name above instead.'),
          {
            type: 'row',
            fields: [
              text(
                'phone',
                'Phone number',
                'Written the way visitors should see it, e.g. 502 895 9595. The click-to-call link is created automatically.',
              ),
              { name: 'email', label: 'Email address', type: 'email' },
            ],
          },
          group('address', 'Showroom address', [
            {
              type: 'row',
              fields: [
                text('street', 'Street address', 'e.g. 3740 Frankfort Avenue'),
                text('city', 'City'),
                text('region', 'State (two letters)', 'e.g. KY'),
                text('postalCode', 'ZIP code'),
              ],
            },
          ]),
          textarea('footerNote', 'Footer sentence', 'One short line about the business under the logo in the footer.'),
        ],
      ],
      [
        'Hours & map',
        [
          {
            name: 'hours',
            label: 'Showroom hours',
            type: 'array',
            labels: { singular: 'Hours line', plural: 'Hours lines' },
            admin: { description: 'One line per group of days with the same hours.', ...rowLabel('label', 'Hours line') },
            fields: [
              text('label', 'Days as shown on the site', 'e.g. Monday – Friday'),
              {
                name: 'days',
                label: 'Which days this line covers',
                type: 'select',
                hasMany: true,
                options: days,
                admin: { description: 'Used for the opening hours Google shows. Pick every day this line applies to.' },
              },
              { name: 'closed', label: 'Closed on these days', type: 'checkbox', defaultValue: false },
              {
                type: 'row',
                admin: { condition: (_, siblingData) => !siblingData?.closed },
                fields: [
                  text('opens', 'Opens at (24-hour clock)', 'e.g. 10:00'),
                  text('closes', 'Closes at (24-hour clock)', 'e.g. 17:30 for 5:30 PM'),
                ],
              },
            ],
          },
          text('directionsUrl', 'Directions link', 'The Google Maps link that opens when someone taps "Get directions".'),
          text(
            'mapQuery',
            'Map search text',
            'What the embedded map on the Visit page searches for. The business name plus address is the safest choice.',
          ),
          group('geo', 'Map coordinates (for Google)', [
            {
              type: 'row',
              fields: [
                text('latitude', 'Latitude', 'Only used by Google. Change it only if the showroom moves.'),
                text('longitude', 'Longitude'),
              ],
            },
          ]),
          {
            name: 'mapTowns',
            label: 'Nearby towns on the map',
            type: 'array',
            labels: { singular: 'Town', plural: 'Towns' },
            admin: {
              description: 'Shown briefly on the homepage map before it flies to the showroom. Optional.',
              ...rowLabel('name', 'Town'),
            },
            fields: [{ type: 'row', fields: [text('name', 'Town name'), text('latitude', 'Latitude'), text('longitude', 'Longitude')] }],
          },
        ],
      ],
      [
        'Menu & links',
        [
          link('headerCta', 'Header button', 'The red button that stays in the header on every page (and in the bar at the bottom of phones).'),
          {
            name: 'mainMenu',
            label: 'Main menu',
            type: 'array',
            labels: { singular: 'Menu item', plural: 'Menu items' },
            admin: { description: 'Keep it to five or six items so it fits on one line.', ...rowLabel('label', 'Menu item') },
            fields: [
              {
                type: 'row',
                fields: [
                  text('label', 'Menu label'),
                  text('url', 'Link address', 'Where the label itself goes. For an item with a dropdown this can be left empty.'),
                ],
              },
              linkList('children', 'Dropdown links (optional)', 'Add links here to turn this item into a dropdown.', 'Dropdown link'),
            ],
          },
          text('shopUrl', 'Online shop link', 'Used by "Browse rugs" buttons.'),
          linkList('serviceAreas', 'Service areas', 'Shown on the Visit page and in the footer.', 'Service area'),
          {
            name: 'social',
            label: 'Social media profiles',
            type: 'array',
            labels: { singular: 'Profile', plural: 'Profiles' },
            admin: rowLabel('platform', 'Profile'),
            fields: [
              {
                type: 'row',
                fields: [
                  {
                    name: 'platform',
                    label: 'Platform',
                    type: 'select',
                    defaultValue: 'Facebook',
                    options: ['Facebook', 'Instagram', 'Pinterest', 'YouTube'],
                  },
                  text('url', 'Profile link'),
                ],
              },
            ],
          },
        ],
      ],
      [
        'Forms',
        [
          text(
            'formEndpoint',
            'Booking form destination (webhook URL)',
            'Where booking forms are sent, for example an n8n webhook URL. Leave empty while testing: the form will then tell visitors it is not connected yet and show the phone number.',
          ),
        ],
      ],
    ),
  ],
}
