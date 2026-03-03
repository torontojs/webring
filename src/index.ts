import { env } from 'cloudflare:workers';
import { nextPage, previousPage, randomPage } from './routes.ts';

async function fetchHandler(request: Request) {
	const url = new URL(request.url);

	let response: Response;

	switch (url.pathname) {
		case '/prev':
			{
				response = await previousPage(request);
			}
			break;
		case '/next':
			{
				response = await nextPage(request);
			}
			break;
		case '/random':
			{
				response = await randomPage(request);
			}
			break;
		default: {
			const errorPage = await env.Assets.fetch('https://assets.local/404.html');
			response = new Response(errorPage.body, { status: 404 });
		}
	}

	return response;
}

const handler: ExportedHandler<Env> = {
	fetch: fetchHandler
};

export default handler;
