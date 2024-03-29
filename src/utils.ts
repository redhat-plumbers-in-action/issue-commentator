export function composeComment(message: string): string {
  const lines = message.split('\n');
  const composed = lines
    .map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return line;
      }
    })
    .filter(section => section !== '');

  return composed.join('\n\n---\n\n');
}
