import { app } from './app';
import { Env } from './env';

app
	.listen({
		host: '0.0.0.0',
		port: Env.PORT,
	})
	.then(() => console.log('🚀️ HTTP Server running!'));
