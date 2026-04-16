import importlib


def load_auth_module(monkeypatch):
    monkeypatch.setenv("SECRET_KEY", "unit-test-secret")
    monkeypatch.setenv("ALGORITHM", "HS256")
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_HOURS", "1")
    monkeypatch.setenv("DEMO_USERNAME", "demo")
    monkeypatch.setenv("DEMO_PASSWORD", "demo123")

    import app.auth as auth_module

    return importlib.reload(auth_module)


def test_authenticate_user_accepts_demo_credentials(monkeypatch):
    auth_module = load_auth_module(monkeypatch)

    assert auth_module.authenticate_user("demo", "demo123") is True


def test_authenticate_user_rejects_invalid_credentials(monkeypatch):
    auth_module = load_auth_module(monkeypatch)

    assert auth_module.authenticate_user("demo", "wrong") is False
    assert auth_module.authenticate_user("other", "demo123") is False


def test_create_and_decode_access_token_round_trip(monkeypatch):
    auth_module = load_auth_module(monkeypatch)

    token = auth_module.create_access_token({"sub": "demo"})
    decoded = auth_module.decode_access_token(token)

    assert decoded == {"username": "demo"}
