export type Environment = 'local' | 'dev' | 'pro';

interface EnvironmentConfig {
  apiBaseUrl: string;
}

const environments: Record<Environment, EnvironmentConfig> = {
  local: {
    apiBaseUrl: 'https://api-rooms-node-git-main-alejandromgos-projects.vercel.app/api'
  },
  dev: {
    apiBaseUrl: 'https://api-rooms-node-git-main-alejandromgos-projects.vercel.app/api'
  },
  pro: {
    apiBaseUrl: 'https://api-rooms-node-git-main-alejandromgos-projects.vercel.app/api'
  }
};

let currentEnvironment: Environment = 'local';

export const setEnvironment = (env: Environment) => {
  currentEnvironment = env;
  localStorage.setItem('app_environment', env);
};

export const getEnvironment = (): Environment => {
  const savedEnv = localStorage.getItem('app_environment') as Environment;
  if (savedEnv && ['local', 'dev', 'pro'].includes(savedEnv)) {
    currentEnvironment = savedEnv;
  }
  return currentEnvironment;
};

export const getApiBaseUrl = (): string => {
  return environments[currentEnvironment].apiBaseUrl;
}; 