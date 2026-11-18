// Mengubah nama kategori menjadi warna (hue) yang selalu sama untuk kategori yang sama.
export function categoryHue(category: string): number {
  let hash = 0;
  for (const char of category.trim().toLowerCase()) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  }
  return hash;
}