import re
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings
from app.utils.logger import logger

client: Optional[AsyncIOMotorClient] = None
db = None


def _mask_mongo_uri(uri: str) -> str:
    """Mask password credentials in MongoDB URI before logging."""
    return re.sub(r"://([^:]+):([^@]+)@", r"://\1:****@", uri)


async def connect_to_mongo():
    """
    Establish asynchronous connection pool to MongoDB with production pooling options.
    """
    global client, db
    try:
        masked_uri = _mask_mongo_uri(settings.mongo_uri)
        logger.info(f"Connecting to MongoDB at {masked_uri}...")
        client = AsyncIOMotorClient(
            settings.mongo_uri,
            maxPoolSize=50,
            minPoolSize=5,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
        )
        db = client[settings.mongo_db_name]
        # Ping the server to verify connectivity
        await client.admin.command("ping")
        logger.info(f"Successfully connected to MongoDB database: {settings.mongo_db_name}")
    except Exception as e:
        logger.error(f"MongoDB connection warning: {e}. (Service will continue in offline/mock mode)")
        print(f"[FASTAPI-DB-ERROR]: {e}", flush=True)


async def close_mongo_connection():
    """
    Close MongoDB connection pool.
    """
    global client
    if client:
        logger.info("Closing MongoDB connection pool...")
        client.close()
        logger.info("MongoDB connection closed.")


def get_client() -> Optional[AsyncIOMotorClient]:
    """
    Dependency helper to retrieve current MongoDB client instance.
    """
    return client


def get_database():
    """
    Dependency helper to retrieve current MongoDB database instance.
    """
    return db

