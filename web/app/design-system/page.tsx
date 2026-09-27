import Link from 'next/link';

const colorSwatches = [
  { label: 'Primary 500', hex: '#F97316', swatch: 'bg-[#f97316]' },
  { label: 'Primary 400', hex: '#F98A4A', swatch: 'bg-[#f98a4a]' },
  { label: 'Primary 300', hex: '#FBD7B0', swatch: 'bg-[#fbd7b0]' },
  { label: 'Primary 200', hex: '#F5EDE6', swatch: 'bg-[#f5ede6]' },
  { label: 'Primary 100', hex: '#FEE9D7', swatch: 'bg-[#fee9d7]' },
  { label: 'Neutral 900', hex: '#111827', swatch: 'bg-[#111827]' },
  { label: 'Neutral 800', hex: '#334155', swatch: 'bg-[#334155]' },
  { label: 'Neutral 700', hex: '#475569', swatch: 'bg-[#475569]' },
  { label: 'Neutral 500', hex: '#64748b', swatch: 'bg-[#64748b]' },
  { label: 'Neutral 400', hex: '#94a3b8', swatch: 'bg-[#94a3b8]' },
  { label: 'Neutral 300', hex: '#cbd5e1', swatch: 'bg-[#cbd5e1]' },
  { label: 'Neutral 200', hex: '#e2e8f0', swatch: 'bg-[#e2e8f0]' },
  { label: 'Neutral 100', hex: '#f1f5f9', swatch: 'bg-[#f1f5f9]' },
  { label: 'Neutral 50', hex: '#f8fafc', swatch: 'bg-[#f8fafc]' },
  {
    label: 'White',
    hex: '#ffffff',
    swatch: 'bg-white border border-[#d5cfc8]',
  },
];

const typeScale = [
  {
    style: 'Display 1',
    font: 'Playfair Display',
    size: '48 / 56',
    weight: 'Bold',
    use: 'Page titles',
  },
  {
    style: 'Display 2',
    font: 'Playfair Display',
    size: '36 / 44',
    weight: 'Bold',
    use: 'Section titles',
  },
  {
    style: 'Heading 1',
    font: 'Inter',
    size: '28 / 36',
    weight: 'Semi Bold',
    use: 'Card titles',
  },
  {
    style: 'Heading 2',
    font: 'Inter',
    size: '24 / 32',
    weight: 'Semi Bold',
    use: 'Sub section titles',
  },
  {
    style: 'Body Large',
    font: 'Inter',
    size: '16 / 24',
    weight: 'Regular',
    use: 'Body copy',
  },
  {
    style: 'Body',
    font: 'Inter',
    size: '16 / 24',
    weight: 'Regular',
    use: 'Supporting text',
  },
  {
    style: 'Small',
    font: 'Inter',
    size: '12 / 16',
    weight: 'Regular',
    use: 'Captions, meta',
  },
];

const spacingBlocks = [
  { value: 4, label: '4', width: 'w-3' },
  { value: 8, label: '8', width: 'w-4' },
  { value: 12, label: '12', width: 'w-5' },
  { value: 16, label: '16', width: 'w-6' },
  { value: 24, label: '24', width: 'w-7' },
  { value: 32, label: '32', width: 'w-8' },
  { value: 40, label: '40', width: 'w-10' },
  { value: 48, label: '48', width: 'w-12' },
  { value: 64, label: '64', width: 'w-16' },
];

const shadowSizes = [
  { name: 'Sm', details: '0 4px 8px\nrgba(15, 23, 42, 0.08)' },
  { name: 'Md', details: '0 8px 16px\nrgba(15, 23, 42, 0.10)' },
  { name: 'Lg', details: '0 12px 24px\nrgba(15, 23, 42, 0.12)' },
  { name: 'Xl', details: '0 20px 40px\nrgba(15, 23, 42, 0.16)' },
];

const iconSet = [
  'bell',
  'search',
  'check',
  'plus',
  'menu',
  'bookmark',
  'play',
  'sparkle',
];

function BrandMark() {
  return (
    <svg viewBox="0 0 36 36" className="h-7 w-7" aria-hidden="true">
      <path
        d="M4 27.5 17.7 5h5.5L17.8 15.8 30 27.5H24.7L17.5 20l-7.2 7.5H4Z"
        fill="#f97316"
      />
      <path
        d="M14.4 29.5 22 6.7h4.4l-7.7 22.8h-4.3Z"
        fill="#1d1a17"
        opacity={0.85}
      />
    </svg>
  );
}

function IconGlyph({ type }: { type: string }) {
  const common = 'h-5 w-5 stroke-[1.8] stroke-current fill-none';

  switch (type) {
    case 'bell':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path
            d="M15 17h5l-1.4-1.5c-.5-.5-.8-1.2-.8-1.9V11a5.5 5.5 0 1 0-11 0v2.6c0 .7-.3 1.4-.8 1.9L5 17h5m5 0a3 3 0 0 1-6 0m6 0h-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'search':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <circle cx="11" cy="11" r="5.5" />
          <path d="M16 16l4.5 4.5" strokeLinecap="round" />
        </svg>
      );
    case 'check':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path
            d="m5 12 4.5 4.5L19 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'plus':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      );
    case 'menu':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      );
    case 'bookmark':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path
            d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-4-6 4V5.5a1 1 0 0 1 1-1Z"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'play':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path
            d="M8 6.5v11l9-5.5-9-5.5Z"
            strokeLinejoin="round"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case 'sparkle':
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path
            d="m12 2 1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2Z"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[#f5f0ea] text-[#1f1b19]">
      <main className="mx-auto max-w-[1230px] px-5 py-8 md:px-8 lg:px-10">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 items-center justify-center">
              <BrandMark />
            </div>
            <span className="text-[38px] font-semibold tracking-[-0.06em] text-[#1e1b19]">
              Vertex
            </span>
          </div>
          <Link
            href="/"
            className="rounded-[10px] border border-[#d8d1ca] bg-white px-3 py-2 text-[12px] font-medium text-[#2c2825] transition hover:bg-[#f4efe9]"
          >
            Home
          </Link>
        </header>

        <section className="border-b border-[#d8d1ca] pb-8 pt-2">
          <h1 className="font-display text-[56px] leading-[0.9] tracking-[-0.07em] text-[#1c1a18] md:text-[78px]">
            Design System
          </h1>
          <p className="mt-6 max-w-[620px] text-[17px] leading-[1.5] text-[#5e5752]">
            A unified design language for Vertex learning platform. Clean,
            modern and focused on clarity, consistency and intuitive learning
            experiences.
          </p>
          <div className="mt-6 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#7a726a]">
            <span>Version 1.0</span>
            <span className="text-[#b7aea7]">•</span>
            <span>May 2025</span>
          </div>
        </section>

        <div className="grid gap-8 pt-8 xl:grid-cols-[1.15fr_1.15fr]">
          <section className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b1715]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#cfc5bc] text-[10px]">
                01
              </span>
              <span>Colors</span>
            </div>

            <div className="rounded-[18px] border border-[#d8d1ca] bg-[#f7f2ee] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="grid grid-cols-5 gap-3">
                {colorSwatches.slice(0, 5).map((swatch) => (
                  <div key={swatch.label} className="space-y-2">
                    <div className={`h-14 rounded-[10px] ${swatch.swatch}`} />
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#312d29]">
                        {swatch.label}
                      </div>
                      <div className="text-[10px] text-[#726a63]">
                        {swatch.hex}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-5 gap-3">
                {colorSwatches.slice(5).map((swatch) => (
                  <div key={swatch.label} className="space-y-2">
                    <div className={`h-14 rounded-[10px] ${swatch.swatch}`} />
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#312d29]">
                        {swatch.label}
                      </div>
                      <div className="text-[10px] text-[#726a63]">
                        {swatch.hex}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b1715]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#cfc5bc] text-[10px]">
                02
              </span>
              <span>Typography</span>
            </div>

            <div className="rounded-[18px] border border-[#d8d1ca] bg-[#f7f2ee] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="space-y-7">
                <div className="flex items-end gap-4">
                  <div className="font-display text-[48px] leading-none tracking-[-0.07em] text-[#1f1d1b]">
                    Ag
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#726a63]">
                    Playfair Display
                  </div>
                </div>
                <div className="flex items-end gap-4">
                  <div className="font-sans text-[48px] leading-none tracking-[-0.07em] text-[#1f1d1b]">
                    Ag
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#726a63]">
                    Inter
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-[#d7d0ca] pt-4">
                <div className="grid grid-cols-[1fr_1.2fr_0.7fr_0.8fr] gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#756d66]">
                  <span>Style</span>
                  <span>Font</span>
                  <span>Size</span>
                  <span>Use</span>
                </div>
                <div className="mt-3 space-y-2">
                  {typeScale.map((item) => (
                    <div
                      key={item.style}
                      className="grid grid-cols-[1fr_1.2fr_0.7fr_0.8fr] items-center gap-2 border-t border-[#e6dfd9] pt-2 text-[12px] text-[#2d2926]"
                    >
                      <span className="font-medium">{item.style}</span>
                      <span>{item.font}</span>
                      <span>{item.size}</span>
                      <span>{item.use}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_1fr]">
          <section className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b1715]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#cfc5bc] text-[10px]">
                03
              </span>
              <span>Spacing system</span>
            </div>
            <div className="rounded-[18px] border border-[#d8d1ca] bg-[#f7f2ee] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="mb-4 text-[12px] text-[#4b4540]">
                <span className="font-semibold text-[#221f1d]">Base unit:</span>{' '}
                4px
              </div>
              <div className="flex items-end gap-3">
                {spacingBlocks.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`bg-[#f5b38b] ${item.width} rounded-[4px]`}
                      style={{ height: `${Math.max(16, item.value * 1.65)}px` }}
                    />
                    <div className="text-[10px] text-[#726a63]">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b1715]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#cfc5bc] text-[10px]">
                04
              </span>
              <span>Radius & shadows</span>
            </div>
            <div className="rounded-[18px] border border-[#d8d1ca] bg-[#f7f2ee] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#433c37]">
                Radius
              </div>
              <div className="flex items-center gap-3">
                {[4, 8, 12, 16, 24, 40, 80].map((radius) => (
                  <div
                    key={radius}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className="h-8 w-8 border border-[#1d1d1d] bg-[#f8f3ef]"
                      style={{ borderRadius: `${radius}px` }}
                    />
                    <span className="text-[10px] text-[#726a63]">
                      {radius === 80 ? 'Full' : `${radius}px`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-[#e3dcd5] pt-4">
                <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#433c37]">
                  Shadows
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {shadowSizes.map((shadow) => (
                    <div
                      key={shadow.name}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className="h-14 w-14 rounded-[10px] border border-[#d5cec8] bg-white"
                        style={{
                          boxShadow:
                            shadow.name === 'Sm'
                              ? '0 4px 8px rgba(15, 23, 42, 0.08)'
                              : shadow.name === 'Md'
                                ? '0 8px 16px rgba(15, 23, 42, 0.10)'
                                : shadow.name === 'Lg'
                                  ? '0 12px 24px rgba(15, 23, 42, 0.12)'
                                  : '0 20px 40px rgba(15, 23, 42, 0.16)',
                        }}
                      />
                      <span className="text-[10px] text-[#726a63]">
                        {shadow.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[0.9fr_1.2fr_0.9fr]">
          <section className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b1715]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#cfc5bc] text-[10px]">
                05
              </span>
              <span>Icons</span>
            </div>
            <div className="rounded-[18px] border border-[#d8d1ca] bg-[#f7f2ee] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="grid grid-cols-3 gap-3">
                {iconSet.map((icon) => (
                  <div
                    key={icon}
                    className="flex h-12 items-center justify-center rounded-[8px] border border-[#d8d1ca] bg-white text-[#141312]"
                  >
                    <IconGlyph type={icon} />
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[10px] border border-[#d8d1ca] bg-white p-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#504a46]">
                  Icon specs
                </div>
                <ul className="mt-3 space-y-1 text-[11px] leading-5 text-[#6a635d]">
                  <li>• 24x24px grid</li>
                  <li>• Stroke width (outline)</li>
                  <li>• Rounded line caps</li>
                  <li>• Consistent optical balance</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b1715]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#cfc5bc] text-[10px]">
                06
              </span>
              <span>Buttons</span>
            </div>
            <div className="rounded-[18px] border border-[#d8d1ca] bg-[#f7f2ee] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <button className="rounded-[12px] bg-[#f97316] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_2px_0_rgba(0,0,0,0.08)]">
                    Default
                  </button>
                  <button className="rounded-[12px] border border-[#d7d0ca] bg-[#f5efe9] px-4 py-2 text-[13px] font-semibold text-[#1f1b1a]">
                    Secondary
                  </button>
                  <button className="rounded-[12px] border border-[#d7d0ca] bg-transparent px-4 py-2 text-[13px] font-semibold text-[#1f1b1a]">
                    Tertiary
                  </button>
                  <button className="rounded-[12px] border border-[#d7d0ca] bg-transparent px-4 py-2 text-[13px] font-semibold text-[#1f1b1a]">
                    Text
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="rounded-[12px] border border-[#f6b390] bg-[#fff5ef] px-4 py-2 text-[13px] font-semibold text-[#f97316]">
                    Get Started
                  </button>
                  <button className="rounded-[12px] border border-[#d7d0ca] bg-[#f5efe9] px-4 py-2 text-[13px] font-semibold text-[#1f1b1a]">
                    Explore Courses
                  </button>
                  <button className="rounded-[12px] border border-[#d7d0ca] bg-[#f5efe9] px-4 py-2 text-[13px] font-semibold text-[#1f1b1a]">
                    View Lesson
                  </button>
                  <button className="rounded-[12px] border border-[#d7d0ca] bg-[#f5efe9] px-4 py-2 text-[13px] font-semibold text-[#1f1b1a]">
                    Watch Video
                  </button>
                </div>
                <div className="rounded-[10px] border border-[#d8d1ca] bg-white/70 p-3 text-[11px] text-[#564f4b]">
                  <div className="font-semibold uppercase tracking-[0.14em] text-[#433c37]">
                    Button specs
                  </div>
                  <div className="mt-2 space-y-1">
                    <div>• Height: 44px (default)</div>
                    <div>• Padding: 16px / 12px</div>
                    <div>• Radius: 12px</div>
                    <div>• Font: Inter Medium</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b1715]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#cfc5bc] text-[10px]">
                07
              </span>
              <span>Inputs</span>
            </div>
            <div className="rounded-[18px] border border-[#d8d1ca] bg-[#f7f2ee] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="space-y-3">
                <div className="rounded-[10px] border border-[#d8d1ca] bg-white px-3 py-2 text-[12px] text-[#6d645e]">
                  Search anything...
                </div>
                <div className="rounded-[10px] border border-[#f8b58b] bg-[#fff9f5] px-3 py-2 text-[12px] text-[#2e2a28]">
                  Select
                </div>
                <div className="rounded-[10px] border border-[#d8d1ca] bg-white px-3 py-2 text-[12px] text-[#2e2a28]">
                  Most Relevant
                </div>
              </div>
              <div className="mt-4 rounded-[10px] border border-[#d8d1ca] bg-white p-3 text-[11px] text-[#564f4b]">
                <div className="font-semibold uppercase tracking-[0.14em] text-[#433c37]">
                  Field specs
                </div>
                <div className="mt-2 space-y-1">
                  <div>• Height: 44px</div>
                  <div>• Radius: 12px</div>
                  <div>• Border: 1px solid #E2DDD7</div>
                  <div>• Focus: border color #F97316</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_1fr_1fr]">
          <section className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b1715]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#cfc5bc] text-[10px]">
                08
              </span>
              <span>Badges & tags</span>
            </div>
            <div className="rounded-[18px] border border-[#d8d1ca] bg-[#f7f2ee] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-[6px] bg-[#f5e7df] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#d76a27]">
                  Video
                </span>
                <span className="rounded-[6px] bg-[#f5e7df] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#d76a27]">
                  Lesson
                </span>
                <span className="rounded-[6px] bg-[#f1e8d9] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#a96c11]">
                  Popular
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b1715]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#cfc5bc] text-[10px]">
                09
              </span>
              <span>Status / indicators</span>
            </div>
            <div className="rounded-[18px] border border-[#d8d1ca] bg-[#f7f2ee] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#b8d6c0] bg-[#edf8f1] px-2 py-1 text-[11px] text-[#267b4d]">
                  <IconGlyph type="check" /> In Progress
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d8d1ca] bg-white px-2 py-1 text-[11px] text-[#433c37]">
                  <IconGlyph type="check" /> Completed
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d8d1ca] bg-white px-2 py-1 text-[11px] text-[#433c37]">
                  <IconGlyph type="play" /> Now Playing
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d8d1ca] bg-[#f6f1eb] px-2 py-1 text-[11px] text-[#6a5b4f]">
                  Locked
                </span>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-[10px] uppercase tracking-[0.12em] text-[#6a5f58]">
                  <span>Progress</span>
                  <span>35% complete</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#e9e1d9]">
                  <div className="h-2.5 w-[35%] rounded-full bg-[#f97316]" />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b1715]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#cfc5bc] text-[10px]">
                10
              </span>
              <span>Cards</span>
            </div>
            <div className="rounded-[18px] border border-[#d8d1ca] bg-[#f7f2ee] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="grid gap-3">
                <article className="rounded-[12px] border border-[#d8d1ca] bg-white p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#1b1d1f] text-[13px] font-bold text-white">
                      N
                    </div>
                    <div className="text-[12px] font-semibold text-[#312d2b]">
                      Next.js for Production
                    </div>
                  </div>
                  <div className="text-[11px] text-[#806f62]">
                    Build scalable, high-performance web applications with
                    Next.js.
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-[#726a63]">
                    <span>Intermediate</span>
                    <span>6h 24m</span>
                    <span>12 modules</span>
                  </div>
                </article>
                <article className="rounded-[12px] border border-[#d8d1ca] bg-white p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-[6px] bg-[#f8e6db] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#d76a27]">
                      Video
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#706762]">
                      Lesson
                    </span>
                  </div>
                  <div className="text-[12px] font-semibold text-[#312d2b]">
                    Data Fetching in Server Components
                  </div>
                  <div className="mt-2 text-[11px] text-[#786e68]">
                    Learn how to fetch data on the server using async functions.
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] text-[#726a63]">
                    <span>Module 5</span>
                    <span>Watch from 12:45</span>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
          <section className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b1715]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#cfc5bc] text-[10px]">
                11
              </span>
              <span>Navigation</span>
            </div>
            <div className="rounded-[18px] border border-[#d8d1ca] bg-[#f7f2ee] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between gap-3 border-b border-[#e0d8d2] pb-3">
                <div className="flex items-center gap-3">
                  <BrandMark />
                  <span className="text-[18px] font-semibold text-[#211f1d]">
                    Vertex
                  </span>
                </div>
                <nav className="flex gap-5 text-[12px] text-[#4d4844]">
                  <span>Courses</span>
                  <span>My Learning</span>
                </nav>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-[#726a63]">
                <span>All Courses</span>
                <span>›</span>
                <span>Next.js for Production</span>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b1715]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#cfc5bc] text-[10px]">
                12
              </span>
              <span>Principles</span>
            </div>
            <div className="rounded-[18px] border border-[#d8d1ca] bg-[#f7f2ee] p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-[12px] border border-[#d8d1ca] bg-white p-3">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2d2927]">
                    <span>Clarity First</span>
                  </div>
                  <p className="text-[11px] leading-5 text-[#6d645e]">
                    Every element should communicate clearly and be easy to
                    understand.
                  </p>
                </div>
                <div className="rounded-[12px] border border-[#d8d1ca] bg-white p-3">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2d2927]">
                    <span>Consistency</span>
                  </div>
                  <p className="text-[11px] leading-5 text-[#6d645e]">
                    Use components and patterns consistently across the
                    platform.
                  </p>
                </div>
                <div className="rounded-[12px] border border-[#d8d1ca] bg-white p-3">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2d2927]">
                    <span>Accessible</span>
                  </div>
                  <p className="text-[11px] leading-5 text-[#6d645e]">
                    Design for clarity, contrast, and easy interaction across
                    contexts.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
