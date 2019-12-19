from aiohttp import web
from json.decoder import JSONDecodeError


async def foo(request):
    try:
        json = await request.json()
    except JSONDecodeError:
        return web.json_response({"hello": "world"})
    return web.json_response({"data": json.get('data')})


app = web.Application()

app.add_routes([
    web.get('/', foo),
    web.post('/', foo),
    web.get('/foo', foo),
    web.post('/foo', foo),
])


web.run_app(app)
