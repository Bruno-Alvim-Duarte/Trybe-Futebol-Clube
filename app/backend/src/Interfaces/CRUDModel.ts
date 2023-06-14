export interface ICRUDModelReader<T> {
  findAll(): Promise<T[]>
  findById(id: number): Promise<T | null>
}

export interface ICRUDModelCreator<T> {
  create(data: Omit<T, 'id'>): Promise<T>
}

export interface ICRUDModelUpdater<T> {
  update(data: Partial<T>): Promise<T>
}

export interface ICRUDModelDeleter {
  delete(id: number): void
}

export interface ICRUDModel<T> extends
  ICRUDModelReader<T>,
  ICRUDModelCreator<T>,
  ICRUDModelDeleter,
  ICRUDModelUpdater<T> {}
