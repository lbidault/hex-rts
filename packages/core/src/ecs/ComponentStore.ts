export class ComponentStore<T> {
  private components = new Map<string, T>();

  add(entityId: string, component: T) {
    this.components.set(entityId, component);
  }

  get(entityId: string): T | undefined {
    return this.components.get(entityId);
  }

  remove(entityId: string) {
    this.components.delete(entityId);
  }

  getAll(): [string, T][] {
    return Array.from(this.components.entries());
  }

  has(entityId: string): boolean {
    return this.components.has(entityId);
  }
}