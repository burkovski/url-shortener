from json.decoder import JSONDecodeError
from jwt.exceptions import InvalidSignatureError
from aiohttp_jwt import JWTMiddleware
from aiohttp.web import middleware, Request, Response, HTTPException, json_response
from .utils.security import get_secret_key
from .utils.fields import Fields


@middleware
async def error_middleware(request: Request, handler) -> Response:
    catch_codes = {404, 500}
    try:
        response: Response = await handler(request)
        if response.status not in catch_codes:
            return response
        message = response.text
        status = response.status
    except JSONDecodeError as exc:
        message = f"JSON isn't passed or invalid: {exc}"
        status = 400
    except HTTPException as exc:
        if exc.status not in catch_codes:
            raise
        message = exc.reason
        status = exc.status
    except InvalidSignatureError as exc:
        message = str(exc)
        status = 400
    return json_response({"error": message}, status=status)


jwt_middleware = JWTMiddleware(
    get_secret_key(),
    request_property=Fields.USER,
    credentials_required=False,
)
