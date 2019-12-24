import pathlib
import yaml


BASE_DIR = pathlib.Path(__file__).parent.parent
CONFIG_PATH = BASE_DIR / "config.yaml"


def get_config(path: pathlib.Path) -> dict:
    with path.open() as file:
        config = yaml.load(file, Loader=yaml.FullLoader)
    return config


CONFIG = get_config(CONFIG_PATH)
