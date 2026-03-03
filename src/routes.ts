import { env } from 'cloudflare:workers';
import membersList from './members.json' with { type: 'json' };

export type MembersListSchema = typeof membersList;

export async function nextPage(request: Request) {
	const url = new URL(request.url);
	const origin = request.headers.get('Origin');

	if (!origin) {
		return new Response(null, {
			status: 307,
			headers: new Headers({ Location: url.hostname })
		});
	}

	try {
		const originUrl = new URL(origin);

		const originIndex = membersList.members.findIndex(({ url: candidateUrl }) => new URL(candidateUrl).hostname === originUrl.hostname);

		if (originIndex === -1) {
			return new Response(null, {
				status: 307,
				headers: new Headers({ Location: url.hostname })
			});
		}

		return new Response(null, {
			status: 307,
			headers: new Headers({ Location: membersList.members.at(originIndex + 1)?.url ?? url.hostname })
		});
	} catch (err) {
		console.error(err);

		const errorPage = await env.Assets.fetch('https://assets.local/404.html');

		return new Response(errorPage.body, { status: 404 });
	}
}

export async function previousPage(request: Request) {
	const url = new URL(request.url);
	const origin = request.headers.get('Origin');

	if (!origin) {
		return new Response(null, {
			status: 307,
			headers: new Headers({ Location: url.hostname })
		});
	}

	try {
		const originUrl = new URL(origin);

		const originIndex = membersList.members.findIndex(({ url: candidateUrl }) => new URL(candidateUrl).hostname === originUrl.hostname);

		if (originIndex === -1) {
			return new Response(null, {
				status: 307,
				headers: new Headers({ Location: url.hostname })
			});
		}

		return new Response(null, {
			status: 307,
			headers: new Headers({ Location: membersList.members.at(originIndex - 1)?.url ?? url.hostname })
		});
	} catch (err) {
		console.error(err);

		const errorPage = await env.Assets.fetch('https://assets.local/404.html');

		return new Response(errorPage.body, { status: 404 });
	}
}

export async function randomPage(request: Request) {
	try {
		const url = new URL(request.url);
		const origin = request.headers.get('Origin');
		let filteredList = membersList.members;

		if (origin) {
			const originUrl = new URL(origin);

			filteredList = membersList.members.filter(({ url: candidateUrl }) => new URL(candidateUrl).hostname === originUrl.hostname);
		}

		const randomIndex = Math.floor(Math.random() * filteredList.length);

		return new Response(null, {
			status: 307,
			headers: new Headers({ Location: filteredList.at(randomIndex)?.url ?? url.hostname })
		});
	} catch (err) {
		console.error(err);

		const errorPage = await env.Assets.fetch('https://assets.local/404.html');

		return new Response(errorPage.body, { status: 404 });
	}
}
