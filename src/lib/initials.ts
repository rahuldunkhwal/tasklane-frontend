// A person's initials for an avatar circle: "Rahul Singh" → "RS", "Ada" → "A".
// Falls back to "?" so the circle is never empty while the name is still loading.
export function initialsOf(name: string | undefined): string {
  if (!name) return '?';
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
  return letters || '?';
}
