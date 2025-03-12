import { Document, Model, FilterQuery } from 'mongoose';

export interface IPaginationOptions {
  page: number;
  limit: number;
  sort?: Record<string, 1 | -1>;
}

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Generic function to paginate query results
 */
export async function paginateResults<T extends Document>(
  model: Model<T>,
  query: FilterQuery<T>,
  options: IPaginationOptions
): Promise<IPaginatedResult<T>> {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  
  const skip = (page - 1) * limit;
  
  const [results, total] = await Promise.all([
    model.find(query).sort(sort).skip(skip).limit(limit),
    model.countDocuments(query)
  ]);
  
  return {
    data: results,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}

/**
 * Safely update document properties
 */
export function safeUpdate<T>(
  original: Partial<T>,
  updates: Partial<T>
): Partial<T> {
  const result = { ...original };
  
  Object.keys(updates).forEach(key => {
    const typedKey = key as keyof T;
    if (updates[typedKey] !== undefined) {
      result[typedKey] = updates[typedKey];
    }
  });
  
  return result;
}
