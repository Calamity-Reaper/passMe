import { ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { DITypes } from './DITypes';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { LoggerService } from './logger/logger.service';
import { ILoggerService } from './logger/logger.service.interface';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(DITypes.Application).to(App).inSingletonScope();
	bind<IConfigService>(DITypes.ConfigService).to(ConfigService).inSingletonScope();
	bind<ILoggerService>(DITypes.LoggerService).to(LoggerService).inSingletonScope();
});
