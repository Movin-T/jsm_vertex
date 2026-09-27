import { SparklesIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const learningOutcome = defineType({
  name: 'learningOutcome',
  title: 'Learning outcome',
  type: 'object',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      description: 'Design-system icon key rendered next to this outcome.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})
