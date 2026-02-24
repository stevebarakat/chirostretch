export interface Chunk {
  chunkText: string;
  chunkIndex: number;
}

export function chunkText(
  text: string,
  maxChars = 1000,
  overlap = 150
): Chunk[] {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const chunks: Chunk[] = [];
  let current = "";
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;

    if (candidate.length > maxChars && current.length > 0) {
      if (current.length >= 50) {
        chunks.push({ chunkText: current.trim(), chunkIndex });
        chunkIndex++;
      }
      // Carry overlap from the end of the emitted chunk
      const overlapText = current.slice(-overlap);
      current = overlapText ? `${overlapText}\n\n${paragraph}` : paragraph;
    } else {
      current = candidate;
    }
  }

  // Emit the last chunk
  if (current.trim().length >= 50) {
    chunks.push({ chunkText: current.trim(), chunkIndex });
  }

  // If nothing was emitted (very short text), emit as single chunk
  if (chunks.length === 0 && text.trim().length >= 50) {
    chunks.push({ chunkText: text.trim(), chunkIndex: 0 });
  }

  return chunks;
}
