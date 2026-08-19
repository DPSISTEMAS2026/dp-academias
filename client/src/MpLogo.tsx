import { BRAND } from './brand';

type Variant = 'color' | 'white' | 'mark';

const SRC: Record<Variant, string> = {
  color: BRAND.mpLogo,
  white: BRAND.mpLogoWhite,
  mark: BRAND.mpLogoMark,
};

export function MpLogo({
  variant = 'color',
  height = 28,
  className = '',
  alt = 'Mercado Pago',
}: {
  variant?: Variant;
  height?: number;
  className?: string;
  alt?: string;
}) {
  const src = SRC[variant];
  return (
    <img
      src={src}
      alt={alt}
      className={`mp-logo ${className}`.trim()}
      style={{ height, width: variant === 'mark' ? height : 'auto' }}
    />
  );
}
