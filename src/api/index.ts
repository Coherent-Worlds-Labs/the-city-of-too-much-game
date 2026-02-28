export interface ApiHealth {
  status: "ok";
  service: string;
  endpoints: string[];
}

export const getApiHealth = (): ApiHealth => ({
  status: "ok",
  service: "the-city-of-too-much-game",
  endpoints: ["/api/games", "/api/turn", "/api/games/:id/history", "/api/games/:id/timeline"]
});
