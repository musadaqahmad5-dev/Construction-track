import { VisualTimeline, VisualMemoryRecord } from './visualTimeline';

export class StyleRecall {
  /**
   * Recalls favorite saved outfits based on structural tags.
   */
  static searchPastLooks(queryText: string): VisualMemoryRecord[] {
    const all = VisualTimeline.getSavedMemoryTimeline();
    const raw = queryText.toLowerCase().trim();

    if (!raw) return all;

    return all.filter((rec) => {
      const matchVibe = rec.vibeSnapshot.toLowerCase().includes(raw);
      const matchTitle = rec.look.heroLook.title.toLowerCase().includes(raw);
      const matchDesc = rec.look.heroLook.description.toLowerCase().includes(raw);
      const matchLayers = rec.look.garmentLayers.some(l => 
        l.title.toLowerCase().includes(raw) || 
        l.description.toLowerCase().includes(raw)
      );

      return matchVibe || matchTitle || matchDesc || matchLayers;
    });
  }
}
