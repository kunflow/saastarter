/**
 * AI Gateway Configuration
 * Centralized AI provider and model settings
 */

import { env } from '@/config/env'

export const aiConfig = {
  provider: env.ai.provider,
  model: env.ai.model,
  timeout: env.ai.timeout,
  maxRetries: env.ai.maxRetries,
  mockMode: env.ai.mockMode,
  rateLimitPerMinute: env.ai.rateLimitPerMinute,
} as const

// Text to Emoji mapping for mock/demo mode
export const emojiMap: Record<string, string> = {
  // Animals
  cat: '🐱',
  dog: '🐶',
  bird: '🐦',
  fish: '🐟',
  rabbit: '🐰',
  bear: '🐻',
  tiger: '🐯',
  lion: '🦁',
  monkey: '🐵',
  horse: '🐴',
  cow: '🐮',
  pig: '🐷',
  mouse: '🐭',
  frog: '🐸',
  fox: '🦊',
  wolf: '🐺',
  elephant: '🐘',
  panda: '🐼',
  koala: '🐨',
  penguin: '🐧',
  chicken: '🐔',
  duck: '🦆',
  owl: '🦉',
  butterfly: '🦋',
  bee: '🐝',
  snake: '🐍',
  turtle: '🐢',
  octopus: '🐙',
  dolphin: '🐬',
  whale: '🐳',
  shark: '🦈',
  crab: '🦀',
  // Nature
  sun: '☀️',
  moon: '🌙',
  star: '⭐',
  cloud: '☁️',
  rain: '🌧️',
  snow: '❄️',
  rainbow: '🌈',
  fire: '🔥',
  water: '💧',
  tree: '🌳',
  flower: '🌸',
  leaf: '🍃',
  mountain: '⛰️',
  ocean: '🌊',
  // Objects
  heart: '❤️',
  love: '💕',
  home: '🏠',
  car: '🚗',
  plane: '✈️',
  rocket: '🚀',
  phone: '📱',
  computer: '💻',
  book: '📚',
  music: '🎵',
  camera: '📷',
  gift: '🎁',
  money: '💰',
  clock: '⏰',
  key: '🔑',
  light: '💡',
  // Food
  apple: '🍎',
  banana: '🍌',
  orange: '🍊',
  grape: '🍇',
  pizza: '🍕',
  burger: '🍔',
  coffee: '☕',
  cake: '🎂',
  ice: '🧊',
  // Emotions
  happy: '😊',
  sad: '😢',
  angry: '😠',
  laugh: '😂',
  smile: '😄',
  cool: '😎',
  think: '🤔',
  sleep: '😴',
  sick: '🤒',
  // Activities
  run: '🏃',
  swim: '🏊',
  dance: '💃',
  sing: '🎤',
  work: '💼',
  study: '📖',
  play: '🎮',
  travel: '🧳',
  // Weather
  hot: '🥵',
  cold: '🥶',
  wind: '💨',
  thunder: '⚡',
  // Time
  morning: '🌅',
  night: '🌃',
  // Default
  default: '✨',
}

export function getEmojiForText(text: string): string {
  const normalized = text.toLowerCase().trim()
  return emojiMap[normalized] || emojiMap.default
}
