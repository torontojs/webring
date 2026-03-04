import { env } from 'cloudflare:workers';
import membersList from './members.json' with { type: 'json' };

function getRequestInfo(request: Request) {
	const originHeader = request.headers.get('Referer') ?? request.headers.get('Origin') ?? undefined;
	const origin = URL.canParse(originHeader ?? '') ? new URL(originHeader ?? '') : undefined;

	return {
		requestUrl: new URL(request.url),
		origin,
		protocol: origin?.protocol.replace(':', '') ?? 'https',
		index: origin ? membersList.members.findIndex(({ url: candidateUrl }) => new URL(candidateUrl).origin === origin.origin) : -1
	};
}

function filterMemberList(protocol: string, origin?: URL) {
	return membersList.members.filter(({ url }) => {
		const candidateUrl = new URL(url);

		return candidateUrl.protocol === protocol && candidateUrl.origin !== origin?.origin;
	});
}

function nextPage(request: Request) {
	const { origin, index, requestUrl, protocol } = getRequestInfo(request);

	if (!origin || index === -1) {
		return new Response(null, {
			status: 307,
			headers: new Headers({ Location: requestUrl.origin })
		});
	}

	const filteredList = filterMemberList(protocol);
	const nextPage = index + 1 === filteredList.length ? 0 : index + 1;

	return new Response(null, {
		status: 307,
		headers: new Headers({ Location: filteredList.at(nextPage)!.url })
	});
}

function previousPage(request: Request) {
	const { origin, index, requestUrl, protocol } = getRequestInfo(request);

	if (!origin || index === -1) {
		return new Response(null, {
			status: 307,
			headers: new Headers({ Location: requestUrl.origin })
		});
	}

	const filteredList = filterMemberList(protocol);

	return new Response(null, {
		status: 307,
		headers: new Headers({ Location: filteredList.at(index - 1)!.url })
	});
}

function randomPage(request: Request) {
	const { protocol, origin, requestUrl } = getRequestInfo(request);
	const filteredList = filterMemberList(protocol, origin);

	const randomIndex = Math.floor(Math.random() * filteredList.length);

	return new Response(null, {
		status: 307,
		headers: new Headers({ Location: filteredList.at(randomIndex)?.url ?? requestUrl.origin })
	});
}

async function fetchHandler(request: Request) {
	const url = new URL(request.url);

	console.log(url);

	let response: Response;

	switch (url.pathname) {
		case '/prev':
		case '/prev/':
			response = previousPage(request);
			break;
		case '/next':
		case '/next/':
			response = nextPage(request);
			break;
		case '/random':
		case '/random/':
			response = randomPage(request);
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
