FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1

WORKDIR /app

# Install runtime deps (no credentials or secrets here). Keep layer for requirements.
COPY requirements.txt ./

# Upgrade pip and install dependencies (cached layer)
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
 && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . /app

# Create a non-root user and give ownership of /app
RUN addgroup --system app && adduser --system --ingroup app app \
 && chown -R app:app /app

USER app

EXPOSE 8000

# Run the app with uvicorn; rely on env vars for config (no hardcoded credentials)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
