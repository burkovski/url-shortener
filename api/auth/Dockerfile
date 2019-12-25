FROM python:3.8
RUN apt-get update && apt-get -y install gcc
WORKDIR /app
VOLUME ["/app"]
EXPOSE 8080
COPY requirements.txt /tmp
RUN pip install -r /tmp/requirements.txt
CMD ["python", "main.py"]