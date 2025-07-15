from loguru import logger
import sys


def setup_logging():
    logger.remove()  # Remove default logger
    logger.add(
        sys.stdout, level="INFO", format="{time} {level} {message}", colorize=True
    )
    logger.add(
        "logs/app.log",
        level="DEBUG",
        rotation="1 MB",
        retention="10 days",
        compression="zip",
    )


setup_logging()
