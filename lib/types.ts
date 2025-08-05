export type FieldOptions<T, Extra = {}> = Array<
  {
    label: string
    value: T
  } & Extra
>

export type FieldOptionsWithPremium<T> = FieldOptions<T, { premium?: boolean }>
