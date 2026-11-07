interface Orderable {
  data: { order: number };
}

export function sortByOrder<Entry extends Orderable>(entries: Entry[]): Entry[] {
  return [...entries].sort((first, second) => first.data.order - second.data.order);
}
