import { Container } from 'inversify';
import { appBindings } from './appBindings';
import { App } from './app';
import { DITypes } from './DITypes';

async function bootstrap(): Promise<void> {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(DITypes.Application);
	await app.init();
}

export const boot = bootstrap();
