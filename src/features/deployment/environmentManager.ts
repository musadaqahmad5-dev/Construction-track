export type ReleaseEnvironment = 'development' | 'preview' | 'production';

export interface DeploymentConfig {
  env: ReleaseEnvironment;
  ingressHost: string;
  enableTelemetry: boolean;
  sslRequired: boolean;
  corsOrigins: string[];
}

export class EnvironmentManager {
  private static activeEnv: ReleaseEnvironment = 'preview';

  static getActiveConfiguration(): DeploymentConfig {
    switch (this.activeEnv) {
      case 'production':
        return {
          env: 'production',
          ingressHost: 'https://ais-fashion-os.standard.platform',
          enableTelemetry: true,
          sslRequired: true,
          corsOrigins: ['*.standard.platform', 'https://ai.studio']
        };
      case 'development':
        return {
          env: 'development',
          ingressHost: 'http://localhost:3000',
          enableTelemetry: false,
          sslRequired: false,
          corsOrigins: ['*']
        };
      case 'preview':
      default:
        return {
          env: 'preview',
          ingressHost: 'https://ais-pre-wtdavhybbkcxxd2hielr2i.dev',
          enableTelemetry: true,
          sslRequired: true,
          corsOrigins: ['*']
        };
    }
  }

  static triggerEnvironmentShift(env: ReleaseEnvironment): void {
    this.activeEnv = env;
  }
}
