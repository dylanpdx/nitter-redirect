import { URL } from "node:url";
import { Instances } from "./instances";


export default {
	async fetch(request, env, ctx): Promise<Response> {
		const apiUrl = "https://status.d420.de/api/v1/instances"

		async function getInstances(ctx:ExecutionContext<unknown>): Promise<Instances|undefined>{
			const cache = caches.default;
			const cacheKey = new Request(apiUrl,{headers:{"User-Agent":"nitter-redirect (https://github.com/dylanpdx/nitter-redirect)"}});

			let response = await cache.match(cacheKey);

			if (!response){
				response = await fetch(cacheKey)
				if (response.status != 200 || (await response.json() as Instances).latest_commit.includes("fix your bot"))
					return undefined;
				response = new Response(response.body, response);
				response.headers.append("Cache-Control", "s-maxage=3600");
				ctx.waitUntil(cache.put(cacheKey, response.clone()));
			}
			return await response.json() as Instances;
		}
		
		const instances = await getInstances(ctx);
		if (instances == undefined){
			return new Response("Getting nitter instances failed")
		}
		const filteredInstances = instances.hosts.filter((instance)=>instance.healthy==true).sort((a,b)=>b.points-a.points);

		if (filteredInstances.length==0){
			return new Response("All nitter instances are down :(")
		}
		const selectedInstance = filteredInstances[0];

		const requestPath = new URL(request.url).pathname;
		const finalUrl = selectedInstance.url+requestPath; // nitter.xyz.com + /status/123
		

		return Response.redirect(finalUrl,302);

	},
} satisfies ExportedHandler<Env>;
