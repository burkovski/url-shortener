SHORT_URL = "http://localhost/{url_id}"


def create_short_url(url_id):
    short_url = SHORT_URL.format(url_id=url_id)
    return short_url
