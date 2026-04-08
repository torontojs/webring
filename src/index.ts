import type { Handler, HandlerEvent } from '@netlify/functions';
import membersList from './members.json' with { type: 'json' };

function filterMemberList(protocol: string, origin?: URL) {
	return membersList.members.filter(({ url }) => {
		const candidateUrl = new URL(url);

		return candidateUrl.protocol === protocol && candidateUrl.origin !== origin?.origin;
	});
}

function getRequestInfo(event: HandlerEvent) {
	const referer = event.headers['referer'] ?? event.headers['referrer'];
	const originHeader = referer ?? event.headers['origin'];
	const origin = originHeader && URL.canParse(originHeader) ? new URL(originHeader) : undefined;

	const url = new URL(event.path, `https://${event.headers['host'] ?? 'localhost'}`);

	return {
		requestUrl: url,
		origin,
		protocol: origin?.protocol ?? 'https:'
	};
}

function nextPage(event: HandlerEvent) {
	const { origin, requestUrl, protocol } = getRequestInfo(event);

	if (!origin) {
		return {
			statusCode: 307,
			headers: { Location: requestUrl.origin }
		};
	}

	const filteredList = filterMemberList(protocol);
	const index = filteredList.findIndex(({ url: candidateUrl }) => new URL(candidateUrl).origin === origin.origin);

	if (index === -1) {
		return {
			statusCode: 307,
			headers: { Location: requestUrl.origin }
		};
	}

	const nextPage = index + 1 >= filteredList.length ? 0 : index + 1;

	return {
		statusCode: 307,
		headers: { Location: filteredList.at(nextPage)?.url ?? requestUrl.origin }
	};
}

function previousPage(event: HandlerEvent) {
	const { origin, requestUrl, protocol } = getRequestInfo(event);

	if (!origin) {
		return {
			statusCode: 307,
			headers: { Location: requestUrl.origin }
		};
	}

	const filteredList = filterMemberList(protocol);
	const index = filteredList.findIndex(({ url: candidateUrl }) => new URL(candidateUrl).origin === origin.origin);

	if (index === -1) {
		return {
			statusCode: 307,
			headers: { Location: requestUrl.origin }
		};
	}

	return {
		statusCode: 307,
		headers: { Location: filteredList.at(index - 1)?.url ?? requestUrl.origin }
	};
}

function randomPage(event: HandlerEvent) {
	const { protocol, origin, requestUrl } = getRequestInfo(event);
	const filteredList = filterMemberList(protocol, origin);

	const randomIndex = Math.floor(Math.random() * filteredList.length);

	return {
		statusCode: 307,
		headers: { Location: filteredList.at(randomIndex)?.url ?? requestUrl.origin }
	};
}

const handler: Handler = async (event: HandlerEvent) => {
	let response;

	switch (event.path) {
		case '/prev':
		case '/prev/':
			response = previousPage(event);
			break;
		case '/next':
		case '/next/':
			response = nextPage(event);
			break;
		case '/random':
		case '/random/':
			response = randomPage(event);
			break;
		case '/members.json':
			response = {
				statusCode: 200,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(membersList)
			};
			break;
		default:
			response = {
				statusCode: 404,
				body: 'Not Found'
			};
	}

	return response;
};

export { handler };
