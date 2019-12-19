FROM python:3.8
WORKDIR /app
RUN apt-get update && apt-get -y install gcc
ADD requirements.txt /tmp
RUN pip install -r /tmp/requirements.txt
VOLUME ["/app"]
EXPOSE 8080
CMD ["python", "__main__.py"]