export class SearchParams {
  private readonly searchParams: URLSearchParams;

  constructor(request: Request) {
    this.searchParams = new URL(request.url).searchParams;
  }

  getString(key: string): string | undefined {
    const value = this.searchParams.get(key);

    if (!value) {
      return;
    }

    return value;
  }

  getEnum<T>(key: string, enumType: Record<string, T>): T | undefined {
    const stringValue = this.getString(key);

    if (!stringValue) {
      return;
    }

    for (const value of Object.values(enumType)) {
      if (stringValue === String(value)) {
        return value;
      }
    }
  }
}
