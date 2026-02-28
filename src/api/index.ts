export interface ApiHealth {
  status: "ok";
  service: string;
}

export const getApiHealth = (): ApiHealth => ({
  status: "ok",
  service: "the-city-of-too-much-game"
});
