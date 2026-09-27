import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const instructor = defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise',
      description: 'Short role or specialty, e.g. "Senior Frontend Engineer".',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'expertise', media: 'photo' },
  },
})
