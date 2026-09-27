export function localizeSourceLabel(
  label: string,
  translate: (key: 'input.pastedLabel') => string,
): string {
  return label === 'Texto colado' ? translate('input.pastedLabel') : label
}
