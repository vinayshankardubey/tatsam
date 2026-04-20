// A small library of daily reflections. One is chosen per sign per day using
// a deterministic index so it's stable for the seeker through the day.

const REFLECTIONS: Record<string, string[]> = {
  Aries: [
    "Your fire is a tool, not a temper. Pick one thing worth your push today.",
    "Initiative finds you. Move early — the window closes by evening.",
    "Not every battle is yours. Choose the one that still matters tomorrow.",
    "Speed is your gift. Pair it with one breath before you speak.",
    "Momentum rewards you; meaning rewards the path you aim it at.",
  ],
  Taurus: [
    "Slow is a strategy today. Let others hurry past what lasts.",
    "Your senses know things your mind hasn't caught up to. Trust a texture.",
    "Earn one small beauty today — a meal, a song, a longer look.",
    "What feels heavy may just be unfinished. Name it and let it rest.",
    "A steady hand is a kind of devotion. Offer yours to something real.",
  ],
  Gemini: [
    "Curiosity is sacred, not scattered. Follow one thread all the way through.",
    "The words you've been avoiding will cost less today than tomorrow.",
    "Listen to the one who disagrees with you kindly. They've seen a door.",
    "Your mind moves fast. Your heart, today, is asking you to wait.",
    "Carry less. The next idea arrives when the last one has landed.",
  ],
  Cancer: [
    "What you nourish grows. Notice what you've been quietly feeding.",
    "Your feelings are not the weather — they're the climate. Plan around them gently.",
    "Home is a verb today. Do one thing that makes a place safer for you.",
    "The memory surfacing has a question in it. Ask it aloud.",
    "Tender is not weak. Stay soft; the world sharpens on its own.",
  ],
  Leo: [
    "Shine like you're lighting someone else's path, not performing on a stage.",
    "Generosity costs you nothing if it comes from the source, not the store.",
    "The compliment you can't quite accept is the one most true.",
    "Lead from warmth, not volume. People follow the first, long after the second fades.",
    "Your heart is loud today. Let it say the brave thing.",
  ],
  Virgo: [
    "Perfect isn't on the menu. Useful is. Pick one thing and finish it.",
    "Your care is a craft. Apply it to yourself for a moment today.",
    "The detail that's been nagging you is asking to be released, not refined.",
    "Service doesn't require suffering. Remove one thing from the list.",
    "Small order creates large peace. Tidy one corner and watch.",
  ],
  Libra: [
    "Fairness to others begins with fairness to yourself. Take the bigger slice today.",
    "Beauty is a form of truth. Choose one act of beauty over one act of politeness.",
    "The decision you're avoiding is asking for your preference, not perfection.",
    "Balance is not stillness; it's constant small returns. Yours, today, are needed.",
    "Say yes with your whole voice or no with your whole face. No more in-between.",
  ],
  Scorpio: [
    "What you burn for, burns for you. Tend it without apology.",
    "You're seeing through something. Don't rush to explain it — sit with it first.",
    "Depth isn't drama. The quiet answer today is the right one.",
    "Let something end. Space is what the next thing needs to arrive.",
    "Your instincts are a compass, not a mood. Follow them where they point.",
  ],
  Sagittarius: [
    "The horizon is wide. Pick a single direction and walk it through sunset.",
    "Truth without tenderness is noise. Temper your aim today.",
    "Your restlessness has a reason. Travel it, even if only in conversation.",
    "Meaning is the real map. Skip the attraction; find the route.",
    "Optimism is a discipline. Practice it on something small.",
  ],
  Capricorn: [
    "The view from the top is built, not found. One more step is enough.",
    "Your patience is a superpower. Aim it at something worthy today.",
    "Discipline is self-love in a suit. Keep the appointment you made with yourself.",
    "What you commit to today will echo in a year. Choose carefully.",
    "Rest is not the opposite of ambition. It is its fuel.",
  ],
  Aquarius: [
    "You think in decades. Do one thing today that serves the long arc.",
    "Solitude is your studio. Protect an hour of it.",
    "The future you imagine is asking for a small act from the present.",
    "Eccentric is a compliment. Let them call you that and keep going.",
    "Your gift is seeing a different shape. Draw it, even roughly.",
  ],
  Pisces: [
    "You feel everything. Today, choose what you'll let in — and what you won't.",
    "Your imagination is medicine. Take a dose, then bring it back.",
    "The dream has a practical edge today. Sketch it before it fades.",
    "Compassion is boundary-full. Care deeply; return clearly.",
    "Where words fail, music speaks. Follow the song you've been humming.",
  ],
};

/** Deterministic daily reflection: stable per (sign, date). */
export function reflectionFor(sign: string | undefined | null, date: Date = new Date()): string | null {
  if (!sign) return null;
  const pool = REFLECTIONS[sign];
  if (!pool) return null;
  const dayOfYear = Math.floor(
    (date.getTime() -
      new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  // Mix day-of-year with a sign-length offset so signs don't rotate in lock-step.
  const idx = ((dayOfYear + sign.length * 3) % pool.length + pool.length) % pool.length;
  return pool[idx];
}
