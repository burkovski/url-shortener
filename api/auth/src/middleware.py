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
        status = response.status
    except JSONDecodeError:
        message = "JSON isn't passed"
        status = 400
    except HTTPException as exc:
        if exc.status not in catch_codes:
            raise
        message = exc.reason
        status = exc.status
    return json_response({"error": message}, status=status)
