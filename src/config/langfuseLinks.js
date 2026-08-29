/**
 * Langfuse dashboard deep links for Admin observability UI.
 * Set VITE_LANGFUSE_URL (+ optional VITE_LANGFUSE_PROJECT_ID) in Tech-Hub/.env
 */
const base = (import.meta.env.VITE_LANGFUSE_URL || 'https://cloud.langfuse.com').replace(
  /\/+$/,
  '',
);
const projectId = (import.meta.env.VITE_LANGFUSE_PROJECT_ID || '').trim();

const projectPath = (segment) =>
  projectId ? `${base}/project/${projectId}/${segment}` : base;

export const langfuseLinks = {
  home: base,
  traces: projectPath('traces'),
  sessions: projectPath('sessions'),
  prompts: projectPath('prompts'),
  scores: projectPath('scores'),
  /** Has project id for deep links */
  hasProject: Boolean(projectId),
};
