
import os
from pathlib import Path
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone

env_path = Path(__file__).resolve().parents[3] / "myenv" / ".env"
if env_path.exists():
    load_dotenv(env_path)
else:
    load_dotenv()
# 
ph = PasswordHasher()

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:

    try:
        return ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, InvalidHashError):
        return False

if __name__ == "__main__" :
    pasword = "mysecretpassword"
    hashed = hash_password(pasword)
    print(f"Password: {pasword}")
    print(f"Hashed: {hashed}")
    print(f"Verified: {verify_password(pasword, hashed)}")


# JWT token generation and verification
SECRET_KEY = os.getenv("jws_secret_key")
ALGORITHM = os.getenv("jws_algorithm", "HS256")
try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("jws_expire_time", "30"))
except (TypeError, ValueError):
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

if not SECRET_KEY:
    raise RuntimeError("JWS secret key not found. Set jws_secret_key in myenv/.env or environment variables.")
class user_role:
    admin = "admin"
    manager = "manager"
    employee = "employee"
    user = "user"


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None