import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/categories", () => {
    return HttpResponse.json([
      { id: 1, name: "Electronics" },
      { id: 2, name: "Beauty" },
      { id: 3, name: "Gardenng" },
    ]);
  }),

  http.get("/products", () => {
    return HttpResponse.json([
      { id: 1, name: "product 1" },
      { id: 2, name: "product 2" },
      { id: 3, name: "product 3" },
    ]);
  }),
];
