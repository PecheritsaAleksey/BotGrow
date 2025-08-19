export class BaseRepository<T, Key extends keyof T> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected readonly model: any,
    protected readonly idField: Key = 'id' as Key,
  ) {}

  create(data: Omit<T, Key>) {
    return this.model.create({ data });
  }

  findById(id: T[Key]) {
    return this.model.findUnique({ where: { [this.idField]: id } });
  }

  findOne(where: Partial<T>) {
    return this.model.findFirst({ where });
  }

  findMany(where?: Partial<T>) {
    return this.model.findMany({ where });
  }

  update(id: T[Key], data: Partial<T>) {
    return this.model.update({ where: { [this.idField]: id }, data });
  }

  delete(id: T[Key]) {
    return this.model.delete({ where: { [this.idField]: id } });
  }
}
