from json.decoder import JSONDecodeError
from aiohttp.web import middleware, Request, Response, HTTPException, json_response


@middleware
async def error_middleware(request: Request, handler) -> Response:
    catch_codes = {404, 500}
    try:
        response: Response = await handler(request)
        if response.status not in catch_codes:
            return response
        message = response.text
    except JSONDecodeError:
        message = "JSON isn't passed"
    except HTTPException as exc:
        if exc.status not in catch_codes:
            raise
        message = exc.reason
    return json_response({"error": message})
