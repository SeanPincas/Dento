// Shared rules for searching the menu. Searches only match dishes on the menu
// (by name or category), and the input only accepts dish-style keywords.

export const MAX_QUERY_LENGTH = 40

// Keep letters, numbers, spaces, hyphens and apostrophes only.
export const sanitizeQuery = (value) =>
  value.replace(/[^\p{L}\p{N}\s'-]/gu, '').slice(0, MAX_QUERY_LENGTH)

export const toKeywords = (query) =>
  query.trim().toLowerCase().split(/\s+/).filter(Boolean)

// Every keyword must appear in the dish name or its menu category.
export const matchesDish = (item, keywords) => {
  if (keywords.length === 0) return true
  const haystack = `${item.name} ${item.category}`.toLowerCase()
  return keywords.every((word) => haystack.includes(word))
}

export const CATEGORY_JP = {
  All: '全部',
  Salad: 'サラダ',
  Rolls: '巻き寿司',
  Sushi: '寿司',
  Desserts: 'デザート',
  Sandwich: 'サンド',
  Cake: 'ケーキ',
  'Pure Veg': '野菜',
  Pasta: 'パスタ',
  Noodles: '麺',
  Onigiri: 'おにぎり',
  Teas: 'お茶',
}
