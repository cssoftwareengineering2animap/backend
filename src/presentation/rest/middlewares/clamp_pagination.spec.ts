/* eslint-disable @typescript-eslint/no-explicit-any */

import { clampPagination } from "./clamp_pagination"

describe("Clamp pagination middleware unit test suite", () => {
  test("when page is not present in the query object, it should be set to 0", () => {
    const request = {
      query: {},
    }

    const next = jest.fn()

    clampPagination(request as any, {} as any, next)

    expect(next.mock.calls.length).toBe(1)

    expect((request as any).context.pagination.page).toBe(0)
  })

  test("when limit is not present in the query object, it should be set to 20", () => {
    const request = {
      query: {},
    }

    const next = jest.fn()

    clampPagination(request as any, {} as any, next)

    expect(next.mock.calls.length).toBe(1)

    expect((request as any).context.pagination.limit).toBe(20)
  })

  test("when limit is greater than 100, it should be set to 100", () => {
    const request = {
      query: { limit: 1000 },
    }

    const next = jest.fn()

    clampPagination(request as any, {} as any, next)

    expect(next.mock.calls.length).toBe(1)

    expect((request as any).context.pagination.limit).toBe(100)
  })
})
