export const moduleName = "auto_feature_09";
export const revision = 9;

export const featureBrief = {
  title: "static-site-flash-game",
  summary: "A focused product module.",
  checkpoints: [
    "Define success metric",
    "Ship first user flow",
    "Instrument activation funnel",
  ],
};

export const getNextAction = () =>
  featureBrief.checkpoints[0] || "Ship the MVP";
